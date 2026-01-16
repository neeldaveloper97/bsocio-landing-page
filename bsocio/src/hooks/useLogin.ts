/**
 * ============================================
 * BSOCIO - useLogin Hook
 * ============================================
 * Custom hook for user authentication
 */

'use client';

import { useState, useCallback } from 'react';
import { authService, ApiException, parseApiError } from '@/lib/api';
import type { LoginRequest, LoginResponse } from '@/types';

/**
 * Hook state interface
 */
interface UseLoginState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: ApiException | null;
  data: LoginResponse | null;
}

/**
 * Hook return interface
 */
interface UseLoginReturn extends UseLoginState {
  login: (data: LoginRequest) => Promise<LoginResponse | null>;
  reset: () => void;
}

/**
 * Initial state for the hook
 */
const initialState: UseLoginState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  data: null,
};

/**
 * Custom hook for handling user login
 * 
 * @example
 * ```tsx
 * const { login, isLoading, isError, error } = useLogin();
 * 
 * const handleSubmit = async (data: LoginRequest) => {
 *   const result = await login(data);
 *   if (result) {
 *     // Success - redirect to dashboard
 *   }
 * };
 * ```
 */
export function useLogin(): UseLoginReturn {
  const [state, setState] = useState<UseLoginState>(initialState);

  /**
   * Execute login request
   */
  const login = useCallback(async (data: LoginRequest): Promise<LoginResponse | null> => {
    // Start loading
    setState({
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      data: null,
    });

    try {
      const response = await authService.login(data);

      // Success
      setState({
        isLoading: false,
        isSuccess: true,
        isError: false,
        error: null,
        data: response,
      });

      return response;
    } catch (error) {
      const apiError = parseApiError(error);

      // Error
      setState({
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: apiError,
        data: null,
      });

      return null;
    }
  }, []);

  /**
   * Reset hook state
   */
  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    login,
    reset,
  };
}
