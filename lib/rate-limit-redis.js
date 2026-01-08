/**
 * Rate limiting utilities
 * Uses in-memory rate limiting (Redis has been removed)
 * Re-exports from rate-limit.js for backward compatibility
 */

export {
  RateLimiter,
  authRateLimiter,
  apiRateLimiter,
  searchRateLimiter,
  checkRateLimit,
} from './rate-limit';

