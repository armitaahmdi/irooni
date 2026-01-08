/**
 * Global error handler and resilience patterns
 * Provides consistent error handling across the application
 */

import { NextResponse } from 'next/server';
import logger from './logger';
import { captureException } from './sentry';

/**
 * Standard API error response
 * @param {Error|string} error - Error object or message
 * @param {number} statusCode - HTTP status code
 * @param {Object} options - Additional options
 * @returns {NextResponse}
 */
export function createErrorResponse(error, statusCode = 500, options = {}) {
  const { 
    message: customMessage, 
    details,
    showDetails = process.env.NODE_ENV === 'development',
  } = options;

  const isDevelopment = process.env.NODE_ENV === 'development';
  const errorMessage = error instanceof Error ? error.message : error;
  const finalMessage = customMessage || errorMessage;

  // Log error
  if (error instanceof Error) {
    logger.error('API Error', error, { statusCode, ...options });
  } else {
    logger.error('API Error', new Error(errorMessage), { statusCode, ...options });
  }

  // Send to error tracking (Sentry)
  if (error instanceof Error && statusCode >= 500) {
    captureException(error, { statusCode, ...options });
  }

  // Build response
  const response = {
    error: finalMessage,
    statusCode,
  };

  // Include details in development
  if (showDetails || isDevelopment) {
    if (error instanceof Error && isDevelopment) {
      response.stack = error.stack;
    }
    if (details) {
      response.details = details;
    }
  }

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Handle database errors
 * @param {Error} error - Database error
 * @returns {NextResponse}
 */
export function handleDatabaseError(error) {
  // Common Prisma errors
  if (error.code === 'P2002') {
    return createErrorResponse('رکورد تکراری است', 409);
  }
  if (error.code === 'P2025') {
    return createErrorResponse('رکورد مورد نظر یافت نشد', 404);
  }
  if (error.code === 'P2003') {
    return createErrorResponse('رکورد مرتبط یافت نشد', 400);
  }

  // Connection errors
  if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
    logger.fatal('Database connection failed', error);
    return createErrorResponse('خطا در اتصال به دیتابیس', 503);
  }

  // Unknown database error
  logger.error('Database error', error);
  return createErrorResponse('خطا در انجام عملیات دیتابیس', 500);
}

/**
 * Handle validation errors
 * @param {Error} error - Validation error (e.g., Zod error)
 * @returns {NextResponse}
 */
export function handleValidationError(error) {
  if (error.issues && Array.isArray(error.issues)) {
    // Zod validation error
    const firstError = error.issues[0];
    return createErrorResponse(
      firstError.message || 'خطا در اعتبارسنجی داده‌ها',
      400,
      { details: error.issues }
    );
  }
  return createErrorResponse('داده‌های ارسالی معتبر نیستند', 400);
}

/**
 * Circuit breaker pattern for external services
 */
export class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 1 minute
    this.monitorTimeout = options.monitorTimeout || 10000; // 10 seconds
    
    this.failures = 0;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.nextAttempt = Date.now();
    this.successCount = 0;
  }

  async execute(fn, fallback = null) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        // Still in cooldown period
        if (fallback) {
          logger.warn('Circuit breaker is OPEN, using fallback');
          return fallback();
        }
        throw new Error('Circuit breaker is OPEN');
      }
      // Try to transition to HALF_OPEN
      this.state = 'HALF_OPEN';
      this.successCount = 0;
    }

    try {
      const result = await Promise.race([
        fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), this.monitorTimeout)
        ),
      ]);

      // Success
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      if (fallback) {
        logger.warn('Circuit breaker failure, using fallback', { error: error.message });
        return fallback();
      }
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= 2) {
        // Successfully recovered
        this.state = 'CLOSED';
        logger.info('Circuit breaker recovered, state: CLOSED');
      }
    }
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;
      logger.error('Circuit breaker opened', { failures: this.failures });
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      nextAttempt: this.nextAttempt,
    };
  }
}

/**
 * Retry with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @returns {Promise}
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    factor = 2,
  } = options;

  let lastError;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.status >= 400 && error.status < 500) {
        throw error;
      }

      if (attempt < maxRetries) {
        logger.warn(`Retry attempt ${attempt + 1}/${maxRetries}`, {
          error: error.message,
          delay,
        });
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * factor, maxDelay);
      }
    }
  }

  throw lastError;
}

/**
 * Async error handler wrapper for API routes
 * @param {Function} handler - API route handler
 * @returns {Function} Wrapped handler with error handling
 */
export function withErrorHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      // Handle specific error types
      if (error.name === 'ZodError' || error.issues) {
        return handleValidationError(error);
      }

      // Database errors
      if (error.code && error.code.startsWith('P')) {
        return handleDatabaseError(error);
      }

      // Generic error
      return createErrorResponse(error);
    }
  };
}

