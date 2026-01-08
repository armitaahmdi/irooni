/**
 * Fuzzy search utilities
 * Simple fuzzy matching for product search
 */

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} str1
 * @param {string} str2
 * @returns {number}
 */
function levenshteinDistance(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j - 1] + 1  // substitution
        );
      }
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate similarity score between two strings (0-1)
 * @param {string} str1
 * @param {string} str2
 * @returns {number}
 */
export function similarity(str1, str2) {
  if (!str1 || !str2) return 0;
  if (str1 === str2) return 1;

  const maxLen = Math.max(str1.length, str2.length);
  if (maxLen === 0) return 1;

  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  return 1 - distance / maxLen;
}

/**
 * Fuzzy search in array of objects
 * @param {Array} items - Array of items to search
 * @param {string} query - Search query
 * @param {Array} fields - Fields to search in
 * @param {number} threshold - Minimum similarity score (0-1)
 * @returns {Array} - Sorted results with scores
 */
export function fuzzySearch(items, query, fields = ['name'], threshold = 0.3) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const queryLower = query.toLowerCase().trim();
  const results = [];

  for (const item of items) {
    let maxScore = 0;
    let matchedField = '';

    for (const field of fields) {
      const value = item[field];
      if (!value) continue;

      const valueStr = String(value).toLowerCase();
      
      // Exact match
      if (valueStr === queryLower) {
        maxScore = 1;
        matchedField = field;
        break;
      }

      // Starts with
      if (valueStr.startsWith(queryLower)) {
        maxScore = Math.max(maxScore, 0.9);
        matchedField = field;
        continue;
      }

      // Contains
      if (valueStr.includes(queryLower)) {
        maxScore = Math.max(maxScore, 0.7);
        matchedField = field;
        continue;
      }

      // Fuzzy match
      const score = similarity(queryLower, valueStr);
      if (score > maxScore) {
        maxScore = score;
        matchedField = field;
      }
    }

    if (maxScore >= threshold) {
      results.push({
        ...item,
        _score: maxScore,
        _matchedField: matchedField,
      });
    }
  }

  // Sort by score (highest first)
  return results.sort((a, b) => b._score - a._score);
}

/**
 * Search history management
 */
export const searchHistory = {
  key: 'search_history',
  maxItems: 10,

  get() {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(this.key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  add(query) {
    if (!query || query.trim().length < 2) return;
    
    const history = this.get();
    const trimmedQuery = query.trim().toLowerCase();
    
    // Remove duplicate
    const filtered = history.filter(item => item.toLowerCase() !== trimmedQuery);
    
    // Add to beginning
    filtered.unshift(trimmedQuery);
    
    // Limit size
    const limited = filtered.slice(0, this.maxItems);
    
    try {
      localStorage.setItem(this.key, JSON.stringify(limited));
    } catch (error) {
      console.error('Failed to save search history:', error);
    }
  },

  clear() {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {
      console.error('Failed to clear search history:', error);
    }
  },

  remove(query) {
    const history = this.get();
    const filtered = history.filter(item => item.toLowerCase() !== query.toLowerCase());
    try {
      localStorage.setItem(this.key, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to remove from search history:', error);
    }
  },
};

