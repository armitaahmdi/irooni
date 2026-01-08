/**
 * Caching utilities
 * Simple in-memory cache with TTL support
 * Redis has been removed - using in-memory cache
 */

class Cache {
  constructor() {
    this.store = new Map();
    this.timers = new Map();
  }

  /**
   * Set a value in cache with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttl - Time to live in seconds (default: 300 = 5 minutes)
   */
  set(key, value, ttl = 300) {
    // Clear existing timer if any
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set value
    this.store.set(key, {
      value,
      expiresAt: Date.now() + ttl * 1000,
    });

    // Set timer to auto-delete
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl * 1000);

    this.timers.set(key, timer);
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if not found/expired
   */
  get(key) {
    const item = this.store.get(key);

    if (!item) {
      return null;
    }

    // Check if expired
    if (Date.now() > item.expiresAt) {
      this.delete(key);
      return null;
    }

    return item.value;
  }

  /**
   * Delete a value from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }
    this.store.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers.clear();
    this.store.clear();
  }

  /**
   * Check if key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    const item = this.store.get(key);
    if (!item) {
      return false;
    }
    if (Date.now() > item.expiresAt) {
      this.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Get cache statistics
   * @returns {Object}
   */
  stats() {
    // Clean expired items
    const now = Date.now();
    let expired = 0;
    for (const [key, item] of this.store.entries()) {
      if (now > item.expiresAt) {
        this.delete(key);
        expired++;
      }
    }

    return {
      size: this.store.size,
      expired,
    };
  }
}

// Create singleton instance
const cache = new Cache();

// Cache key generators
export const cacheKeys = {
  products: (filters) => `products:${JSON.stringify(filters)}`,
  product: (id) => `product:${id}`,
  productBySlug: (slug) => `product:slug:${slug}`,
  categories: () => 'categories:all',
  category: (slug) => `category:${slug}`,
  articles: (filters) => `articles:${JSON.stringify(filters)}`,
  article: (slug) => `article:${slug}`,
  user: (id) => `user:${id}`,
  order: (id) => `order:${id}`,
};

/**
 * Cache decorator for async functions
 * @param {Function} fn - Function to cache
 * @param {string|Function} keyGenerator - Cache key or function to generate key
 * @param {number} ttl - Time to live in seconds
 */
export function cached(fn, keyGenerator, ttl = 300) {
  return async (...args) => {
    const key = typeof keyGenerator === 'function'
      ? keyGenerator(...args)
      : keyGenerator;

    // Check cache
    const cached = cache.get(key);
    if (cached !== null) {
      return cached;
    }

    // Execute function
    const result = await fn(...args);

    // Cache result
    cache.set(key, result, ttl);

    return result;
  };
}

export default cache;

