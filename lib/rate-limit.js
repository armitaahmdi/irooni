/**
 * Rate limiting utilities
 * In production, replace with Redis-based implementation
 */

const rateLimits = new Map();

export class RateLimiter {
  constructor(windowMs = 15 * 60 * 1000, maxRequests = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  check(key) {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    if (!rateLimits.has(key)) {
      rateLimits.set(key, []);
    }

    const requests = rateLimits.get(key);
    const recentRequests = requests.filter(time => time > windowStart);

    if (recentRequests.length >= this.maxRequests) {
      return {
        allowed: false,
        remainingRequests: 0,
        resetTime: recentRequests[0] + this.windowMs,
      };
    }

    recentRequests.push(now);
    rateLimits.set(key, recentRequests);

    return {
      allowed: true,
      remainingRequests: this.maxRequests - recentRequests.length,
      resetTime: now + this.windowMs,
    };
  }

  reset(key) {
    rateLimits.delete(key);
  }
}

// Pre-configured rate limiters for different use cases
export const authRateLimiter = new RateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes for auth
export const apiRateLimiter = new RateLimiter(60 * 1000, 60); // 60 requests per minute for API
export const searchRateLimiter = new RateLimiter(60 * 1000, 30); // 30 requests per minute for search

// Utility function for middleware
export function checkRateLimit(key, limiter = apiRateLimiter) {
  return limiter.check(key);
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, requests] of rateLimits.entries()) {
    const recentRequests = requests.filter(time => now - time < 60 * 60 * 1000); // Keep last hour
    if (recentRequests.length === 0) {
      rateLimits.delete(key);
    } else {
      rateLimits.set(key, recentRequests);
    }
  }
}, 10 * 60 * 1000); // Clean every 10 minutes
