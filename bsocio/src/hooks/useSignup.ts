/**
 * ============================================
 * BSOCIO - useSignup Hook
 * ============================================
 * Custom hook for user registration
 */

'use client';

import { useState, useCallback } from 'react';
import { authService, ApiException, parseApiError } from '@/lib/api';
import type { SignupRequest, SignupResponse } from '@/types';

/**
 * Hook state interface
 */
interface UseSignupState {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  error: ApiException | null;
  data: SignupResponse | null;
}

/**
 * Hook return interface
 */
interface UseSignupReturn extends UseSignupState {
  signup: (data: SignupRequest) => Promise<SignupResponse | null>;
  reset: () => void;
}

/**
 * Initial state for the hook
 */
const initialState: UseSignupState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  error: null,
  data: null,
};

/**
 * Custom hook for handling user signup
 * 
 * @example
 * ```tsx
 * const { signup, isLoading, isError, error } = useSignup();
 * 
 * const handleSubmit = async (data: SignupRequest) => {
 *   const result = await signup(data);
 *   if (result) {
 *     // Success - redirect or show message
 *   }
 * };
 * ```
 */
export function useSignup(): UseSignupReturn {
  const [state, setState] = useState<UseSignupState>(initialState);

  /**
   * Execute signup request
   */
  const signup = useCallback(async (data: SignupRequest): Promise<SignupResponse | null> => {
    // Start loading
    setState({
      isLoading: true,
      isSuccess: false,
      isError: false,
      error: null,
      data: null,
    });

    try {
      const response = await authService.signup(data);

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
    signup,
    reset,
  };
}
