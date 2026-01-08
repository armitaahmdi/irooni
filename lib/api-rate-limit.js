/**
 * API Rate Limiting Helper
 * Use this in API routes for rate limiting
 * Uses in-memory rate limiting (Redis has been removed)
 */

import { authRateLimiter, apiRateLimiter, searchRateLimiter, checkRateLimit } from './rate-limit';
import { NextResponse } from 'next/server';

/**
 * Get client IP address from request
 * @param {Request} request
 * @returns {string}
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIP || 'unknown';
  return ip;
}

/**
 * Rate limit middleware for API routes
 * @param {Request} request
 * @param {Object} options
 * @param {RateLimiter} options.limiter - Rate limiter instance (default: apiRateLimiter)
 * @param {string} options.key - Custom key for rate limiting (default: IP address)
 * @returns {Promise<NextResponse|null>} Returns response if rate limited, null if allowed
 */
export async function withRateLimit(request, options = {}) {
  const { limiter = apiRateLimiter, key } = options;
  
  const rateLimitKey = key || `api:${getClientIP(request)}:${new URL(request.url).pathname}`;
  const result = checkRateLimit(rateLimitKey, limiter);

  if (!result.allowed) {
    const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
    return NextResponse.json(
      {
        error: 'Too many requests. Please try again later.',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': limiter.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
        },
      }
    );
  }

  return null; // Request allowed
}

/**
 * Wrapper function for API routes with rate limiting
 * @param {Function} handler - API route handler
 * @param {Object} options - Rate limiting options
 * @returns {Function} Wrapped handler
 */
export function withApiRateLimit(handler, options = {}) {
  return async (request, context) => {
    const rateLimitResponse = await withRateLimit(request, options);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
    return handler(request, context);
  };
}

// Export pre-configured limiters for convenience
export { authRateLimiter, apiRateLimiter, searchRateLimiter };

