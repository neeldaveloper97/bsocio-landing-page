/**
 * ============================================
 * BSOCIO - Google Sign In Button
 * ============================================
 * Google OAuth sign-in button with backend integration.
 * Uses the standard /users signup endpoint so duplicate-email
 * detection works identically to manual registration.
 */

'use client';

import { GoogleOAuthProvider, useGoogleLogin, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
  variant?: 'button' | 'google-branded';
}

/** Decode a JWT payload without a library (works in all modern browsers). */
function decodeJwtPayload(token: string): Record<string, unknown> {
  const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
  return JSON.parse(atob(base64));
}

/** Register via the same POST /users endpoint that manual signup uses. */
async function registerViaUsersEndpoint(email: string): Promise<void> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      role: 'USER',
      isTermsAccepted: true,
      authProvider: 'GOOGLE',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    // message can be a string or an array of strings from the API
    const msg = Array.isArray(errorData.message)
      ? errorData.message.join(', ')
      : typeof errorData.message === 'string'
        ? errorData.message
        : '';
    const msgLower = msg.toLowerCase();

    if (response.status === 409 || msgLower.includes('already') || msgLower.includes('exist')) {
      throw new Error('This email is already registered');
    }
    throw new Error(msg || 'Registration failed. Please try again.');
  }
}

/**
 * Self-contained Google Sign In Button
 * Wraps itself with GoogleOAuthProvider so the Google SDK only loads
 * when this component is rendered (signup page only).
 */
export function GoogleSignInButton(props: GoogleSignInButtonProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleSignInButtonInner {...props} />
    </GoogleOAuthProvider>
  );
}

function GoogleSignInButtonInner({ 
  onSuccess,
  onError,
  className,
  variant = 'button'
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Handle successful Google credential response (One Tap / branded button)
   */
  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      onError?.(new Error('No credential received from Google'));
      return;
    }

    try {
      setIsLoading(true);

      // Extract email from the Google ID token
      const payload = decodeJwtPayload(credentialResponse.credential);
      const email = payload.email as string | undefined;
      if (!email) {
        throw new Error('Could not retrieve email from Google account.');
      }

      // Register through the standard /users endpoint (same as manual signup)
      await registerViaUsersEndpoint(email);

      onSuccess?.();
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

        // Register through the standard /users endpoint (same as manual signup)
        await registerViaUsersEndpoint(userInfo.email);

        onSuccess?.();
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
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
