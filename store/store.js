/**
 * Redux Store Configuration
 * Central store with all slices and middleware
 */

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from './slices/ordersSlice';
import recentlyViewedReducer from './slices/recentlyViewedSlice';
import { productsApi } from './api/productsApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
    orders: ordersReducer,
    recentlyViewed: recentlyViewedReducer,
    // RTK Query API reducer
    [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(productsApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Note: Type exports removed for JavaScript compatibility
// If you migrate to TypeScript, uncomment these:
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

