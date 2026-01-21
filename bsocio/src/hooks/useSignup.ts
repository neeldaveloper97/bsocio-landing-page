/**
 * ============================================
 * BSOCIO - useSignup Hook
 * ============================================
 * Custom hook for user registration
 * 
 * Uses the generic useMutation pattern for consistent
 * loading, error, and success state management.
 */

'use client';

import { authService, type ApiException } from '@/lib/api';
import { useMutation, type AsyncOptions } from './useAsync';
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
type UseSignupOptions = AsyncOptions<SignupResponse>;

/**
 * Custom hook for handling user signup
 * 
 * @example
 * ```tsx
 * const { signup, isLoading, isError, error } = useSignup({
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
  const { mutate, isLoading, isSuccess, error, data, reset } = useMutation(
    async (signupData: SignupRequest) => authService.signup(signupData),
    options
  );

  return {
    signup: mutate,
    isLoading,
    isSuccess,
    isError: !!error,
    error,
    data,
    reset,
  };
}
