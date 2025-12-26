/**
 * Favorites Slice
 * Manages user's favorite products
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Array of product IDs
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const productId = action.payload;
      const index = state.items.indexOf(productId);
      
      if (index === -1) {
        // Add to favorites
        state.items.push(productId);
      } else {
        // Remove from favorites
        state.items.splice(index, 1);
      }
    },
    addToFavorites: (state, action) => {
      const productId = action.payload;
      if (!state.items.includes(productId)) {
        state.items.push(productId);
      }
    },
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      const index = state.items.indexOf(productId);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    },
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { toggleFavorite, addToFavorites, removeFromFavorites, clearFavorites } = favoritesSlice.actions;

// Selectors
export const selectFavorites = (state) => state.favorites.items;
export const selectIsFavorite = (state, productId) => state.favorites.items.includes(productId);
export const selectFavoritesCount = (state) => state.favorites.items.length;

export default favoritesSlice.reducer;

