/**
 * Typed Redux Hooks
 * Pre-typed versions of useDispatch and useSelector
 */

import { useDispatch, useSelector } from 'react-redux';
import { store } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;

// Helper hook for auth state
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const isLoading = useAppSelector((state) => state.auth.isLoading);
  const error = useAppSelector((state) => state.auth.error);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
  };
};

