/**
 * Auth Slice - Manages authentication state
 * Handles login, logout, session management
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/lib/api/client';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isInitialized: false, // Track if initial session check is done
};

/**
 * Async thunk: Get current session
 */
export const fetchSession = createAsyncThunk(
  'auth/fetchSession',
  async (_, { rejectWithValue }) => {
    try {
      const data = await authApi.getSession();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'خطا در دریافت اطلاعات کاربر');
    }
  }
);

/**
 * Async thunk: Send OTP
 */
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (phone, { rejectWithValue }) => {
    try {
      const data = await authApi.sendOTP(phone);
      return { phone, ...data };
    } catch (error) {
      return rejectWithValue(error.message || 'خطا در ارسال کد تأیید');
    }
  }
);

/**
 * Async thunk: Login with phone and OTP
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ phone, otp }, { rejectWithValue, dispatch }) => {
    try {
      // Login directly - OTP verification is done in the login API
      const data = await authApi.login(phone, otp);
      
      // Fetch session after successful login
      await dispatch(fetchSession());
      
      // Dispatch event for other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-state-change'));
      }
      
      return data;
    } catch (error) {
      return rejectWithValue(error.message || 'خطا در ورود');
    }
  }
);

/**
 * Async thunk: Logout
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      
      // Dispatch event for other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('auth-state-change'));
      }
      
      return null;
    } catch (error) {
      return rejectWithValue(error.message || 'خطا در خروج');
    }
  }
);

/**
 * Auth Slice
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Reset auth state
    resetAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    // Update user info (for profile updates)
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Session
      .addCase(fetchSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        if (action.payload?.user) {
          state.user = action.payload.user;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(fetchSession.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        // OTP sent successfully, store phone for login
        if (action.payload.otp) {
          // In development, OTP is returned
          state.error = null;
        }
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        // User and isAuthenticated are set by fetchSession
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.user = null;
        state.isAuthenticated = false;
      })
      
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Still clear user on logout error
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

// Export actions
export const { clearError, resetAuth, updateUser } = authSlice.actions;

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsInitialized = (state) => state.auth.isInitialized;

// Export reducer
export default authSlice.reducer;

