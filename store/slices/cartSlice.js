/**
 * Cart Slice - Manages shopping cart state
 * Handles cart operations: add, update, remove items
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartApi } from '@/lib/api/client';

// Initial state
const initialState = {
  items: [],
  total: 0,
  isLoading: false,
  error: null,
  isInitialized: false,
};

/**
 * Async thunk: Fetch cart
 */
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const data = await cartApi.getCart();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'خطا در دریافت سبد خرید');
    }
  }
);

/**
 * Async thunk: Add item to cart
 */
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1, size, color, variantId }, { rejectWithValue, dispatch }) => {
    try {
      const data = await cartApi.addToCart(productId, quantity, size, color, variantId);
      // Refresh cart after adding
      await dispatch(fetchCart());
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'خطا در افزودن به سبد خرید');
    }
  }
);

/**
 * Async thunk: Update cart item quantity
 */
export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      const data = await cartApi.updateCartItem(itemId, quantity);
      // Refresh cart after updating
      await dispatch(fetchCart());
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'خطا در به‌روزرسانی سبد خرید');
    }
  }
);

/**
 * Async thunk: Remove item from cart
 */
export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue, dispatch }) => {
    try {
      await cartApi.removeFromCart(itemId);
      // Refresh cart after removing
      await dispatch(fetchCart());
      return itemId;
    } catch (error) {
      return rejectWithValue(error.message || 'خطا در حذف از سبد خرید');
    }
  }
);

// Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch cart
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload.success && action.payload.data) {
          state.items = action.payload.data.items || [];
          state.total = action.payload.data.total || 0;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Add to cart
    builder
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Update cart item
    builder
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Remove from cart
    builder
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;


