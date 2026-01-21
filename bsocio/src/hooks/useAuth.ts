/**
 * ============================================
 * BSOCIO - useAuth Hook
 * ============================================
 * Central authentication state management hook
 * 
 * Provides reactive authentication state with:
 * - Current user information
 * - Authentication status
 * - Logout functionality
 * - User data refresh capability
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { authService, tokenStorage, parseApiError, type ApiException } from '@/lib/api';
import type { User } from '@/types';

/**
 * Auth state interface
 */
interface UseAuthState {
  /** Current authenticated user */
  user: User | null;
  /** Whether the user is authenticated */
  isAuthenticated: boolean;
  /** Whether auth state is being checked */
  isLoading: boolean;
  /** Whether initial auth check is complete */
  isInitialized: boolean;
  /** Error from auth operations, if any */
  error: ApiException | null;
}

/**
 * Auth hook return interface
 */
interface UseAuthReturn extends UseAuthState {
  /** Log out the current user */
  logout: () => Promise<void>;
  /** Refresh user data from API */
  refreshUser: () => Promise<void>;
  /** Re-check authentication status */
  checkAuth: () => void;
}

/**
 * Custom hook for managing authentication state
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, isLoading, logout } = useAuth();
 * 
 * if (isLoading) return <Spinner />;
 * 
 * if (isAuthenticated) {
 *   return <Dashboard user={user} onLogout={logout} />;
 * }
 * 
 * return <LoginPage />;
 * ```
 */
export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<UseAuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    isInitialized: false,
    error: null,
  });

  /**
   * Check authentication status from storage
   */
  const checkAuth = useCallback(() => {
    const isAuthenticated = tokenStorage.isAuthenticated();
    const user = tokenStorage.getUser() as User | null;

    setState((prev) => ({
      ...prev,
      isAuthenticated,
      user,
      isLoading: false,
      isInitialized: true,
    }));
  }, []);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /**
   * Logout user and clear state
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        isInitialized: true,
        error: null,
      });
    }
  }, []);

  /**
   * Refresh user data from API
   */
  const refreshUser = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true }));

      const user = await authService.getCurrentUser();

      setState((prev) => ({
        ...prev,
        user,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const apiError = parseApiError(error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: apiError,
      }));
    }
  }, []);

  return {
    ...state,
    logout,
    refreshUser,
    checkAuth,
  };
}
