# راهنمای Redux Toolkit Setup

## 📦 ساختار پروژه

```
irooni/
├── store/
│   ├── store.js          # Store configuration
│   ├── hooks.js          # Typed hooks (useAppDispatch, useAppSelector, useAuth)
│   └── slices/
│       └── authSlice.js  # Auth slice با async thunks
├── lib/
│   └── api/
│       └── client.js     # API Client - Centralized API calls
└── components/
    └── providers/
        └── ReduxProvider.js  # Redux Provider wrapper
```

## 🚀 ویژگی‌های پیاده‌سازی شده

### 1. Store Configuration
- ✅ Redux Toolkit با `configureStore`
- ✅ DevTools در development mode
- ✅ Middleware configuration

### 2. Auth Slice
- ✅ `fetchSession` - دریافت session کاربر
- ✅ `sendOTP` - ارسال کد تأیید
- ✅ `login` - ورود کاربر
- ✅ `logout` - خروج کاربر
- ✅ State management کامل (loading, error, user)

### 3. API Service Layer
- ✅ Centralized API client
- ✅ Error handling
- ✅ Type-safe API calls
- ✅ Consistent request/response handling

### 4. Typed Hooks
- ✅ `useAppDispatch` - Typed dispatch
- ✅ `useAppSelector` - Typed selector
- ✅ `useAuth` - Custom hook برای auth state

## 📖 نحوه استفاده

### در کامپوننت‌ها

```javascript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useAuth } from '@/store/hooks';
import { login, logout, fetchSession } from '@/store/slices/authSlice';

function MyComponent() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // یا استفاده مستقیم از selector
  const user = useAppSelector(state => state.auth.user);
  
  const handleLogin = async () => {
    try {
      await dispatch(login({ phone: '09123456789', otp: '123456' })).unwrap();
      // Success
    } catch (error) {
      // Error handling
    }
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <p>خوش آمدید {user.phone}</p>
      ) : (
        <p>لطفاً وارد شوید</p>
      )}
    </div>
  );
}
```

### استفاده از Async Thunks

```javascript
// با unwrap() برای error handling
try {
  const result = await dispatch(sendOTP(phone)).unwrap();
  // Success
} catch (error) {
  // Error
}

// یا بدون unwrap (error در state ذخیره می‌شود)
dispatch(sendOTP(phone));
const error = useAppSelector(state => state.auth.error);
```

## 🔧 افزودن Slice جدید

### 1. ایجاد Slice

```javascript
// store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/lib/api/client';

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId, { rejectWithValue }) => {
    try {
      const data = await apiClient.get(`/api/users/${userId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    // Sync reducers
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
```

### 2. اضافه کردن به Store

```javascript
// store/store.js
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer, // اضافه کردن
  },
});
```

## 🎯 Best Practices

### 1. استفاده از Typed Hooks
```javascript
// ✅ Good
import { useAppDispatch, useAppSelector } from '@/store/hooks';

// ❌ Bad
import { useDispatch, useSelector } from 'react-redux';
```

### 2. Error Handling
```javascript
// ✅ Good - با unwrap()
try {
  await dispatch(login(credentials)).unwrap();
} catch (error) {
  // Handle error
}

// ✅ Good - از state
const error = useAppSelector(state => state.auth.error);
```

### 3. Selector Optimization
```javascript
// ✅ Good - Specific selector
const user = useAppSelector(state => state.auth.user);

// ❌ Bad - Select entire state
const auth = useAppSelector(state => state.auth);
```

## 📝 کامپوننت‌های به‌روزرسانی شده

- ✅ `app/login/page.js` - استفاده از Redux برای login
- ✅ `components/layout/UserMenu.js` - استفاده از Redux برای session
- ✅ `components/layout/FavoritesIcon.js` - استفاده از Redux برای auth check
- ✅ `app/profile/page.js` - استفاده از Redux برای profile

## 🔍 DevTools

در development mode، Redux DevTools در دسترس است:
- نصب Redux DevTools Extension در مرورگر
- مشاهده state و actions در real-time

## 🚨 نکات مهم

1. **همیشه از typed hooks استفاده کنید** (`useAppDispatch`, `useAppSelector`)
2. **Error handling** را با `unwrap()` انجام دهید
3. **Loading states** را از Redux state بخوانید
4. **API calls** را فقط در async thunks انجام دهید
5. **State updates** را فقط از طریق reducers انجام دهید

## 📚 منابع

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)

