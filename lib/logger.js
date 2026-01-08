/**
 * Structured logging using Pino
 * Replaces console.log with structured logging
 * Production-ready with support for log aggregation services
 */

import pino from 'pino';

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Base logger configuration
const baseConfig = {
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  // Add environment and service name
  base: {
    env: process.env.NODE_ENV || 'development',
    service: 'irooni',
    version: process.env.npm_package_version || '1.0.0',
  },
  // Redact sensitive information
  redact: {
    paths: [
      'password',
      'token',
      'secret',
      'authorization',
      'cookie',
      'apiKey',
      'api_key',
      'access_token',
      'refresh_token',
    ],
    remove: true,
  },
};

// Transport configuration
// Note: pino-pretty transport doesn't work in Next.js API routes
// Using simple pino logger without transport for compatibility with Next.js
// In development, logs will be in JSON format (can be piped to pino-pretty manually if needed)
const logger = pino(baseConfig);

/**
 * Log levels:
 * - trace: Very detailed debugging
 * - debug: Debugging information
 * - info: General information
 * - warn: Warning messages
 * - error: Error messages
 * - fatal: Fatal errors
 */

export default logger;

// Convenience methods
export const log = {
  trace: (msg, ...args) => logger.trace({ ...args }, msg),
  debug: (msg, ...args) => logger.debug({ ...args }, msg),
  info: (msg, ...args) => logger.info({ ...args }, msg),
  warn: (msg, ...args) => logger.warn({ ...args }, msg),
  error: (msg, error, ...args) => {
    if (error instanceof Error) {
      logger.error({
        err: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        ...args,
      }, msg);
    } else {
      logger.error({ ...args, error }, msg);
    }
  },
  fatal: (msg, error, ...args) => {
    if (error instanceof Error) {
      logger.fatal({
        err: {
          message: error.message,
          stack: error.stack,
          name: error.name,
        },
        ...args,
      }, msg);
    } else {
      logger.fatal({ ...args, error }, msg);
    }
  },
};

// Child logger factory for context
export function createChildLogger(bindings) {
  return logger.child(bindings);
}

/**
 * Create a request logger with request context
 * @param {Object} context - Request context (userId, requestId, ip, etc.)
 * @returns {pino.Logger} Logger instance with context
 */
export function createRequestLogger(context = {}) {
  return logger.child({
    ...context,
    type: 'request',
  });
}

/**
 * Create an API logger with API context
 * @param {string} route - API route
 * @param {Object} context - Additional context
 * @returns {pino.Logger} Logger instance with context
 */
export function createAPILogger(route, context = {}) {
  return logger.child({
    route,
    type: 'api',
    ...context,
  });
}

/**
 * Log HTTP request
 * @param {Object} request - Request object
 * @param {Object} context - Additional context
 */
export function logRequest(request, context = {}) {
  const { method, url, headers } = request;
  const requestLogger = createRequestLogger({
    method,
    url,
    ip: headers.get('x-forwarded-for') || headers.get('x-real-ip') || 'unknown',
    userAgent: headers.get('user-agent'),
    ...context,
  });
  
  requestLogger.info('Incoming request');
  return requestLogger;
}

/**
 * Log HTTP response
 * @param {Object} requestLogger - Request logger instance
 * @param {number} statusCode - HTTP status code
 * @param {number} responseTime - Response time in milliseconds
 */
export function logResponse(requestLogger, statusCode, responseTime) {
  requestLogger.info({
    statusCode,
    responseTime,
  }, 'Request completed');
}

/**
 * Performance logging helper
 * @param {string} operation - Operation name
 * @param {Function} fn - Function to measure
 * @returns {Promise} Function result
 */
export async function logPerformance(operation, fn) {
  const start = Date.now();
  try {
    const result = await fn();
    const duration = Date.now() - start;
    logger.debug({ operation, duration }, 'Performance metric');
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error({ operation, duration, error: error.message }, 'Performance error');
    throw error;
  }
}

