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
    <div className="admin-dashboard min-h-screen" role="status" aria-label="Loading dashboard">
      <span className="sr-only">Loading...</span>
      {/* Sidebar skeleton */}
      <aside className="admin-sidebar bg-[#101828] w-[280px] min-h-screen">
        <div className="p-6 bg-[#101828]">
          <div className="w-[100px] h-7 bg-[#1F2937] rounded" />
          <div className="w-[140px] h-4 bg-[#1F2937] rounded mt-2" />
        </div>
      </aside>
      {/* Main content skeleton */}
      <main className="admin-main flex-1 bg-[#F3F4F6] p-6">
        <header className="admin-header bg-white p-6 rounded-lg mb-6">
          <div className="w-[200px] h-7 bg-[#E5E7EB] rounded" />
          <div className="w-[300px] h-4 bg-[#E5E7EB] rounded mt-2" />
        </header>
        <div className="flex justify-center items-center h-[200px]">
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
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Immediate check from storage - no delay needed
    const hasToken = tokenStorage.isAuthenticated();
    const user = tokenStorage.getUser();
    const isAdminUser = !!(user?.role && ['SUPER_ADMIN', 'CONTENT_ADMIN', 'COMMUNICATIONS_ADMIN', 'ANALYTICS_VIEWER'].includes(user.role));
    
    setIsAuthenticated(hasToken);
    setIsAdmin(isAdminUser);
    setIsChecking(false);
    
    if (!hasToken) {
      router.replace('/login');
    } else if (!isAdminUser) {
      // User is authenticated but not an admin
      tokenStorage.clearAll();
      router.replace('/login?error=unauthorized');
    }
  }, [router]);

  // Show skeleton layout while checking auth (provides visual structure for LCP)
  if (isChecking) {
    return <AuthLoadingSkeleton />;
  }

  // Don't render children if not authenticated or not admin
  if (!isAuthenticated || !isAdmin) {
    return <AuthLoadingSkeleton />;
  }

  return <>{children}</>;
}
