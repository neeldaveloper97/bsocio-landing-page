import React, { Suspense } from "react";
import dynamic from "next/dynamic";

/**
 * ============================================
 * Dashboard Page - Mobile Optimized
 * ============================================
 * - Dynamic import reduces initial bundle
 * - Lightweight skeleton (no animations = lower TBT)
 * - Suspense for streaming SSR
 * ============================================
 */

// Dynamic import - reduces initial JS bundle by ~30KB
const ClientDashboard = dynamic(
  () => import('./ClientDashboard'),
  {
    loading: () => <DashboardSkeleton />,
    ssr: true,
  }
);

// ============================================
// LIGHTWEIGHT SKELETON (No animations = lower TBT)
// ============================================

function DashboardSkeleton() {
  return (
    <div className="page-content" aria-label="Loading dashboard...">
      {/* Header skeleton */}
      <div className="flex flex-col gap-2">
        <div className="w-48 max-sm:w-40 h-7 max-sm:h-6 bg-gray-100 rounded" />
        <div className="w-72 max-sm:w-56 h-5 max-sm:h-4 bg-gray-100 rounded" />
      </div>

      {/* Stats section - simplified for mobile */}
      <div className="flex flex-col gap-4">
        <div className="w-28 h-5 bg-gray-100 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="flex flex-col items-center justify-center p-4 sm:p-6 gap-2 bg-white border border-gray-100 rounded-xl min-h-24 sm:min-h-32"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100" />
              <div className="w-12 h-6 rounded bg-gray-100 mt-1" />
              <div className="w-16 h-3 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Activity section - reduced items on skeleton */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
        <div className="w-28 h-5 bg-gray-100 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex-1">
                <div className="w-3/4 h-4 bg-gray-100 rounded mb-1" />
                <div className="w-1/2 h-3 bg-gray-100 rounded" />
              </div>
              <div className="w-14 h-3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE COMPONENT
// ============================================

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <ClientDashboard />
    </Suspense>
  );
}
