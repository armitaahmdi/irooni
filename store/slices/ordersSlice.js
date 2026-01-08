/**
 * Orders Slice - Manages user orders state
 * Handles order operations: fetch, create orders
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersApi } from '@/lib/api/client';

// Initial state
const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

/**
 * Async thunk: Fetch user orders
 */
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const data = await ordersApi.getOrders();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'خطا در دریافت سفارش‌ها');
    }
  }
);

/**
 * Async thunk: Fetch single order
 */
export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await ordersApi.getOrder(orderId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'خطا در دریافت سفارش');
    }
  }
);

/**
 * Async thunk: Create order
 */
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({ addressId, paymentMethod, notes, shippingCost, couponId }, { rejectWithValue, dispatch }) => {
    try {
      const data = await ordersApi.createOrder(addressId, paymentMethod, notes, shippingCost, couponId);
      // Refresh orders after creating
      await dispatch(fetchOrders());
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'خطا در ثبت سفارش');
    }
  }
);

// Orders slice
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload.success && action.payload.data) {
          state.orders = action.payload.data;
        }
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Fetch single order
    builder
      .addCase(fetchOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.data) {
          state.currentOrder = action.payload.data;
        }
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create order
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success && action.payload.data) {
          state.currentOrder = action.payload.data;
        }
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentOrder, clearError } = ordersSlice.actions;
export default ordersSlice.reducer;


