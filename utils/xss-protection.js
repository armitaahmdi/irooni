/**
 * XSS Protection utilities for frontend
 * Client-side XSS protection helpers
 */

/**
 * Escape HTML special characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text safe for HTML
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
    '/': '&#x2F;',
  };

  return text.replace(/[&<>"'/]/g, m => map[m]);
}

/**
 * Safely render user content in React
 * @param {string} content - User content
 * @returns {string} - Safe HTML string
 */
export function safeRender(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  return escapeHTML(content);
}

/**
 * Validate and sanitize URL before using in href
 * @param {string} url - URL to validate
 * @returns {string|null} - Safe URL or null
 */
export function safeURL(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    const urlObj = new URL(url, window.location.origin);
    // Only allow http and https
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return null;
    }
    // Prevent javascript: and data: URLs
    if (urlObj.protocol === 'javascript:' || urlObj.protocol === 'data:') {
      return null;
    }
    return urlObj.toString();
  } catch {
    return null;
  }
}

/**
 * Safe JSON stringify with error handling
 * @param {any} data - Data to stringify
 * @returns {string} - JSON string or empty string
 */
export function safeJSONStringify(data) {
  try {
    return JSON.stringify(data);
  } catch {
    return '';
  }
}

/**
 * Safe innerHTML setter with validation
 * @param {HTMLElement} element - DOM element
 * @param {string} html - HTML content
 */
export function safeSetInnerHTML(element, html) {
  if (!element || typeof html !== 'string') {
    return;
  }

  // Use DOMPurify if available
  if (typeof window !== 'undefined' && window.DOMPurify) {
    element.innerHTML = window.DOMPurify.sanitize(html);
  } else {
    // Fallback: escape all HTML
    element.textContent = html;
  }
}

