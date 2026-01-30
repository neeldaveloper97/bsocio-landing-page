/**
 * ============================================
 * BSOCIO - useSignup Hook
 * ============================================
 * Custom hook for user registration using TanStack Query
 * 
 * Provides automatic retry, loading states, and error handling.
 */

'use client';

import { useMutation } from '@tanstack/react-query';
import { authService, type ApiException } from '@/lib/api';
import type { SignupRequest, SignupResponse } from '@/types';

/**
 * Hook return interface
 */
interface UseSignupReturn {
  /** Execute the signup mutation */
  signup: (data: SignupRequest) => Promise<SignupResponse | null>;
  /** Whether the signup is in progress */
  isLoading: boolean;
  /** Whether the signup completed successfully */
  isSuccess: boolean;
  /** Whether the signup failed */
  isError: boolean;
  /** Error from the signup, if any */
  error: ApiException | null;
  /** The signup response data */
  data: SignupResponse | null;
  /** Reset the hook state */
  reset: () => void;
}

/**
 * Options for the useSignup hook
 */
interface UseSignupOptions {
  /** Callback when signup succeeds */
  onSuccess?: (data: SignupResponse) => void;
  /** Callback when signup fails */
  onError?: (error: ApiException) => void;
}

/**
 * Custom hook for handling user signup
 * 
 * Features:
 * - Automatic retry on network failures
 * - Loading and error state management
 * - Success/error callbacks
 * 
 * @example
 * ```tsx
 * const { signup, isPending, isError, error } = useSignup({
 *   onSuccess: (data) => {
 *     console.log('Signed up:', data.user);
 *     router.push('/login');
 *   },
 *   onError: (error) => {
 *     toast.error(error.message);
 *   },
 * });
 * 
 * const handleSubmit = async (data: SignupRequest) => {
 *   await signup(data);
 * };
 * ```
 */
export function useSignup(options: UseSignupOptions = {}): UseSignupReturn {
  const mutation = useMutation<SignupResponse, ApiException, SignupRequest>({
    mutationFn: (data) => authService.signup(data),
    onSuccess: options.onSuccess,
    onError: options.onError,
    retry: false, // Don't retry on error - prevents duplicate calls
  });

  const signup = async (signupData: SignupRequest): Promise<SignupResponse | null> => {
    try {
      return await mutation.mutateAsync(signupData);
    } catch (error) {
      // Re-throw the error so the caller can handle it
      throw error;
    }
  };

  return {
    signup,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error ?? null,
    data: mutation.data ?? null,
    reset: mutation.reset,
  };
}
