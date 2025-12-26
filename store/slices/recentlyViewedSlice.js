/**
 * Recently Viewed Products Slice
 * Manages user's recently viewed products (last 20 products)
 */

import { createSlice } from '@reduxjs/toolkit';

// Load from localStorage on initialization
const loadFromLocalStorage = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('recentlyViewed');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Return array of product objects with timestamp
      return Array.isArray(parsed) ? parsed : [];
    }
  } catch (error) {
    console.error('Error loading recently viewed from localStorage:', error);
  }
  return [];
};

// Save to localStorage
const saveToLocalStorage = (items) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('recentlyViewed', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving recently viewed to localStorage:', error);
  }
};

const initialState = {
  items: loadFromLocalStorage(), // Array of { product, viewedAt }
  maxItems: 20, // Maximum number of recently viewed products
};

const recentlyViewedSlice = createSlice({
  name: 'recentlyViewed',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      const product = action.payload;
      
      // Remove if already exists
      const existingIndex = state.items.findIndex(
        (item) => item.product.id === product.id
      );
      
      if (existingIndex !== -1) {
        // Remove existing
        state.items.splice(existingIndex, 1);
      }
      
      // Add to beginning with current timestamp
      state.items.unshift({
        product,
        viewedAt: new Date().toISOString(),
      });
      
      // Keep only maxItems
      if (state.items.length > state.maxItems) {
        state.items = state.items.slice(0, state.maxItems);
      }
      
      // Save to localStorage
      saveToLocalStorage(state.items);
    },
    removeProduct: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(
        (item) => item.product.id !== productId
      );
      saveToLocalStorage(state.items);
    },
    clearRecentlyViewed: (state) => {
      state.items = [];
      saveToLocalStorage([]);
    },
    // Load from localStorage (for hydration)
    loadFromStorage: (state) => {
      state.items = loadFromLocalStorage();
    },
  },
});

export const {
  addProduct,
  removeProduct,
  clearRecentlyViewed,
  loadFromStorage,
} = recentlyViewedSlice.actions;

// Selectors
export const selectRecentlyViewed = (state) => state.recentlyViewed.items;
export const selectRecentlyViewedProducts = (state) =>
  state.recentlyViewed.items.map((item) => item.product);
export const selectRecentlyViewedCount = (state) =>
  state.recentlyViewed.items.length;
// Get recently viewed excluding a specific product (useful for product detail page)
export const selectRecentlyViewedExcluding = (state, excludeProductId) =>
  state.recentlyViewed.items
    .filter((item) => item.product.id !== excludeProductId)
    .map((item) => item.product);

export default recentlyViewedSlice.reducer;

