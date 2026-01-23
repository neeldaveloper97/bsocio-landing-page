/**
 * ============================================
 * BSOCIO ADMIN - Auth Guard Component
 * ============================================
 * Protects routes by checking authentication status
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { tokenStorage } from '@/lib/api';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Direct check from storage for reliability
    const checkAuth = () => {
      const hasToken = tokenStorage.isAuthenticated();
      setIsAuthenticated(hasToken);
      setIsChecking(false);
      
      if (!hasToken) {
        router.replace('/login');
      }
    };

    // Small delay to ensure storage is ready after hydration
    const timer = setTimeout(checkAuth, 50);
    return () => clearTimeout(timer);
  }, [router]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="auth-loading">
        <div className="loading-spinner"></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return <>{children}</>;
}
