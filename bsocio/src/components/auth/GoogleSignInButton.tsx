/**
 * ============================================
 * BSOCIO - Google Sign In Button
 * ============================================
 * Google OAuth sign-in button with backend integration
 */

'use client';

import { useGoogleLogin, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/lib/api/storage';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  variant?: 'button' | 'google-branded';
}

/**
 * Google Sign In Button Component
 * 
 * @example
 * ```tsx
 * // Custom styled button
 * <GoogleSignInButton onSuccess={() => router.push('/dashboard')} />
 * 
 * // Google's official branded button
 * <GoogleSignInButton variant="google-branded" />
 * ```
 */
export function GoogleSignInButton({ 
  onSuccess,
  onError,
  className,
  variant = 'button'
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  /**
   * Handle successful Google credential response
   */
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      onError?.(new Error('No credential received from Google'));
      return;
    }

    try {
      setIsLoading(true);
      
      // Send ID token to backend for verification
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken: credentialResponse.credential,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to authenticate with backend');
      }

      const data = await response.json();
      
      // Store tokens using existing storage utility
      if (data.accessToken) {
        tokenStorage.setAccessToken(data.accessToken);
      }
      if (data.refreshToken) {
        tokenStorage.setRefreshToken(data.refreshToken);
      }
      
      onSuccess?.();
      router.push('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
      onError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Google OAuth popup flow (alternative method)
   */
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        
        // Get user info from Google using access token
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        if (!userInfoResponse.ok) {
          throw new Error('Failed to get user info from Google');
        }

        const userInfo = await userInfoResponse.json();
        
        // Send user data to backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/google/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            googleId: userInfo.sub,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 404) {
            throw new Error('Google authentication is not yet available. Please try again later or use email signup.');
          }
          throw new Error(errorData.message || 'Failed to authenticate with backend');
        }

        const data = await response.json();
        
        // Store tokens
        if (data.accessToken) {
          tokenStorage.setAccessToken(data.accessToken);
        }
        if (data.refreshToken) {
          tokenStorage.setRefreshToken(data.refreshToken);
        }
        
        onSuccess?.();
        router.push('/');
      } catch (error) {
        console.error('Google sign-in error:', error);
        onError?.(error as Error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      onError?.(new Error('Google sign-in failed'));
    },
  });

  // Render Google's official branded button
  if (variant === 'google-branded') {
    return (
      <div className={className}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => onError?.(new Error('Google sign-in failed'))}
          theme="outline"
          size="large"
          width="100%"
          text="continue_with"
        />
      </div>
    );
  }

  // Render custom styled button
  return (
    <Button
      onClick={() => login()}
      disabled={isLoading}
      variant="outline"
      size="lg"
      className={className}
    >
      <GoogleIcon className="mr-2 h-5 w-5" />
      {isLoading ? 'Signing in...' : 'Continue with Google'}
    </Button>
  );
}

/**
 * Google Icon Component
 */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

/**
 * Hook for using Google auth programmatically
 */
export function useGoogleAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  const signInWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        setError(null);
        
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        });
        
        const userInfo = await userInfoResponse.json();
        
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}auth/google/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            picture: userInfo.picture,
            googleId: userInfo.sub,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to authenticate');
        }

        const data = await response.json();
        
        if (data.accessToken) {
          tokenStorage.setAccessToken(data.accessToken);
        }
        if (data.refreshToken) {
          tokenStorage.setRefreshToken(data.refreshToken);
        }
        
        router.push('/');
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setError(new Error('Google sign-in failed'));
    },
  });

  return {
    signInWithGoogle,
    isLoading,
    error,
  };
}
