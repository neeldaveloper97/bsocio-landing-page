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

// Skeleton layout to show while checking auth - provides visual structure for LCP
function AuthLoadingSkeleton() {
  return (
    <div className="admin-dashboard" style={{ minHeight: '100vh' }}>
      {/* Sidebar skeleton */}
      <aside className="admin-sidebar" style={{ background: '#101828', width: '280px', minHeight: '100vh' }}>
        <div className="sidebar-header" style={{ padding: '24px', background: '#101828' }}>
          <div style={{ width: '100px', height: '28px', background: '#1F2937', borderRadius: '4px' }} />
          <div style={{ width: '140px', height: '16px', background: '#1F2937', borderRadius: '4px', marginTop: '8px' }} />
        </div>
      </aside>
      {/* Main content skeleton */}
      <main className="admin-main" style={{ flex: 1, background: '#F3F4F6', padding: '24px' }}>
        <header className="admin-header" style={{ background: '#fff', padding: '24px', borderRadius: '8px', marginBottom: '24px' }}>
          <div style={{ width: '200px', height: '28px', background: '#E5E7EB', borderRadius: '4px' }} />
          <div style={{ width: '300px', height: '16px', background: '#E5E7EB', borderRadius: '4px', marginTop: '8px' }} />
        </header>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <div className="loading-spinner" />
        </div>
      </main>
    </div>
  );
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Immediate check from storage - no delay needed
    const hasToken = tokenStorage.isAuthenticated();
    setIsAuthenticated(hasToken);
    setIsChecking(false);
    
    if (!hasToken) {
      router.replace('/login');
    }
  }, [router]);

  // Show skeleton layout while checking auth (provides visual structure for LCP)
  if (isChecking) {
    return <AuthLoadingSkeleton />;
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return <AuthLoadingSkeleton />;
  }

  return <>{children}</>;
}
