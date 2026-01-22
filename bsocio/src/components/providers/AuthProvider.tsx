/**
 * ============================================
 * BSOCIO - Google OAuth Provider
 * ============================================
 * Wraps app with Google OAuth context
 */

'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Provider component for Google OAuth
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
