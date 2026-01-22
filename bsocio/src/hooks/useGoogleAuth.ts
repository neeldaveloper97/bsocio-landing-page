/**
 * ============================================
 * BSOCIO - useGoogleAuth Hook
 * ============================================
 * TanStack Query hook for Google OAuth authentication
 */

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { googleAuthService, GoogleAuthResponse, GoogleUserData } from '@/lib/api/services/google-auth.service';

/**
 * Hook for Google ID Token authentication
 * 
 * @example
 * ```tsx
 * const { mutate: authenticateWithGoogle, isPending } = useGoogleIdTokenAuth();
 * 
 * // In your GoogleLogin callback
 * authenticateWithGoogle(credentialResponse.credential);
 * ```
 */
export function useGoogleIdTokenAuth(options?: {
  onSuccess?: (data: GoogleAuthResponse) => void;
  onError?: (error: Error) => void;
  redirectTo?: string;
}) {
  const router = useRouter();
  const { onSuccess, onError, redirectTo = '/' } = options ?? {};

  return useMutation({
    mutationFn: (idToken: string) => googleAuthService.authenticateWithIdToken(idToken),
    onSuccess: (data) => {
      onSuccess?.(data);
      router.push(redirectTo);
    },
    onError: (error: Error) => {
      console.error('Google auth error:', error);
      onError?.(error);
    },
  });
}

/**
 * Hook for Google user data authentication
 * 
 * @example
 * ```tsx
 * const { mutate: authenticateWithGoogle, isPending } = useGoogleUserDataAuth();
 * 
 * // After getting user info from Google
 * authenticateWithGoogle({
 *   email: userInfo.email,
 *   name: userInfo.name,
 *   picture: userInfo.picture,
 *   googleId: userInfo.sub,
 * });
 * ```
 */
export function useGoogleUserDataAuth(options?: {
  onSuccess?: (data: GoogleAuthResponse) => void;
  onError?: (error: Error) => void;
  redirectTo?: string;
}) {
  const router = useRouter();
  const { onSuccess, onError, redirectTo = '/' } = options ?? {};

  return useMutation({
    mutationFn: (userData: GoogleUserData) => googleAuthService.authenticateWithUserData(userData),
    onSuccess: (data) => {
      onSuccess?.(data);
      router.push(redirectTo);
    },
    onError: (error: Error) => {
      console.error('Google auth error:', error);
      onError?.(error);
    },
  });
}

/**
 * Combined hook for Google authentication
 */
export function useGoogleAuthMutation() {
  const idTokenAuth = useGoogleIdTokenAuth();
  const userDataAuth = useGoogleUserDataAuth();

  return {
    authenticateWithIdToken: idTokenAuth.mutate,
    authenticateWithUserData: userDataAuth.mutate,
    isPending: idTokenAuth.isPending || userDataAuth.isPending,
    isError: idTokenAuth.isError || userDataAuth.isError,
    error: idTokenAuth.error || userDataAuth.error,
  };
}
