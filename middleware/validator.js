/**
 * Validation middleware for API routes
 * Uses Zod schemas for request validation
 */

import { NextResponse } from 'next/server';
import { validate, safeParse } from '@/utils/validation';
import { sanitizeObject } from '@/utils/sanitize';
import logger from '@/lib/logger';

/**
 * Create validation middleware
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {Object} options - Options
 * @returns {Function} - Middleware function
 */
export function validateRequest(schema, options = {}) {
  const { sanitize = true, allowPartial = false } = options;

  return async (request, handler) => {
    try {
      let body = {};

      // Try to parse JSON body
      try {
        const text = await request.text();
        if (text) {
          body = JSON.parse(text);
        }
      } catch (parseError) {
        logger.warn('Failed to parse request body', { error: parseError.message });
        // If body parsing fails, continue with empty body
      }

      // Sanitize input if requested
      if (sanitize) {
        body = sanitizeObject(body, true);
      }

      // Validate
      const result = allowPartial
        ? safeParse(schema.partial(), body)
        : safeParse(schema, body);

      if (!result.success) {
        const firstError = result.error.errors[0];
        logger.warn('Validation failed', {
          errors: result.error.errors,
          body: Object.keys(body),
        });

        return NextResponse.json(
          {
            success: false,
            error: firstError?.message || 'اعتبارسنجی ناموفق بود',
            errors: result.error.errors.map(e => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }

      // Create new request with validated data
      const validatedRequest = {
        ...request,
        validatedData: result.data,
      };

      // Call handler with validated request
      return handler(validatedRequest);
    } catch (error) {
      logger.error('Validation middleware error', error);
      return NextResponse.json(
        {
          success: false,
          error: 'خطا در پردازش درخواست',
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Validate query parameters
 * @param {z.ZodSchema} schema - Zod schema
 * @returns {Function} - Middleware function
 */
export function validateQuery(schema) {
  return async (request, handler) => {
    try {
      const { searchParams } = new URL(request.url);
      const query = Object.fromEntries(searchParams.entries());

      const result = safeParse(schema, query);

      if (!result.success) {
        const firstError = result.error.errors[0];
        return NextResponse.json(
          {
            success: false,
            error: firstError?.message || 'پارامترهای جستجو نامعتبر است',
            errors: result.error.errors.map(e => ({
              path: e.path.join('.'),
              message: e.message,
            })),
          },
          { status: 400 }
        );
      }

      const validatedRequest = {
        ...request,
        validatedQuery: result.data,
      };

      return handler(validatedRequest);
    } catch (error) {
      logger.error('Query validation error', error);
      return NextResponse.json(
        {
          success: false,
          error: 'خطا در پردازش درخواست',
        },
        { status: 500 }
      );
    }
  };
}

