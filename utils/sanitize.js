/**
 * Sanitization utilities for user inputs
 * Prevents XSS attacks by sanitizing HTML and user inputs
 */

import DOMPurify from 'dompurify';

// For server-side sanitization (Node.js)
let createDOMPurify;
if (typeof window === 'undefined') {
  // Server-side: use jsdom
  const { JSDOM } = require('jsdom');
  const window = new JSDOM('').window;
  createDOMPurify = DOMPurify(window);
} else {
  // Client-side: use browser DOMPurify
  createDOMPurify = DOMPurify;
}

/**
 * Sanitize HTML string to prevent XSS
 * @param {string} dirty - HTML string to sanitize
 * @param {Object} options - DOMPurify options
 * @returns {string} - Sanitized HTML
 */
export function sanitizeHTML(dirty, options = {}) {
  if (!dirty || typeof dirty !== 'string') {
    return '';
  }

  const defaultOptions = {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['href', 'title', 'target'],
    ALLOW_DATA_ATTR: false,
  };

  return createDOMPurify.sanitize(dirty, { ...defaultOptions, ...options });
}

/**
 * Sanitize plain text - removes all HTML tags
 * @param {string} text - Text to sanitize
 * @returns {string} - Plain text without HTML
 */
export function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return createDOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
  });
}

/**
 * Sanitize object recursively
 * @param {any} obj - Object to sanitize
 * @param {boolean} deep - Whether to sanitize nested objects
 * @returns {any} - Sanitized object
 */
export function sanitizeObject(obj, deep = true) {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => (deep ? sanitizeObject(item, deep) : item));
  }

  if (typeof obj === 'object') {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = deep ? sanitizeObject(value, deep) : value;
    }
    return sanitized;
  }

  return obj;
}

/**
 * Escape special characters for use in HTML
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export function escapeHTML(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, m => map[m]);
}

/**
 * Sanitize phone number - only digits
 * @param {string} phone - Phone number to sanitize
 * @returns {string} - Sanitized phone number
 */
export function sanitizePhone(phone) {
  if (!phone || typeof phone !== 'string') {
    return '';
  }

  return phone.replace(/\D/g, '');
}

/**
 * Sanitize email - basic validation and lowercase
 * @param {string} email - Email to sanitize
 * @returns {string} - Sanitized email
 */
export function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return '';
  }

  return email.trim().toLowerCase();
}

/**
 * Sanitize URL - validate and clean
 * @param {string} url - URL to sanitize
 * @returns {string} - Sanitized URL or empty string if invalid
 */
export function sanitizeURL(url) {
  if (!url || typeof url !== 'string') {
    return '';
  }

  try {
    const urlObj = new URL(url);
    // Only allow http and https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return '';
    }
    return urlObj.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize SQL injection patterns (additional layer)
 * Note: Prisma already handles this, but this is an extra safety measure
 * @param {string} input - Input to check
 * @returns {boolean} - True if potentially dangerous
 */
export function containsSQLInjection(input) {
  if (!input || typeof input !== 'string') {
    return false;
  }

  const dangerousPatterns = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /(--|#|\/\*|\*\/)/,
    /(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/i,
    /(\bEXEC\b|\bEXECUTE\b)/i,
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
}

