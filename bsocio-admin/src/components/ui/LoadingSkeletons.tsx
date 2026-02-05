/**
 * ============================================
 * Page Loading Skeletons - Mobile Optimized
 * ============================================
 * NO animations = lower TBT on mobile
 * Solid bg-gray-100 instead of animate-pulse
 * ============================================
 */

import React, { memo } from 'react';

/**
 * Generic page loading skeleton
 */
export const PageLoadingSkeleton = memo(function PageLoadingSkeleton() {
  return (
    <div className="flex-1 w-full min-h-screen p-4 sm:p-6 lg:p-8" aria-label="Loading...">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="w-48 h-7 bg-gray-100 rounded" />
        <div className="w-72 h-5 bg-gray-100 rounded" />
      </div>

      {/* Content area */}
      <div className="mt-6 bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg" />
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-gray-100 rounded" />
                <div className="w-1/2 h-3 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

/**
 * Table loading skeleton
 */
export const TableLoadingSkeleton = memo(function TableLoadingSkeleton() {
  return (
    <div className="flex-1 w-full min-h-screen p-4 sm:p-6 lg:p-8" aria-label="Loading...">
      {/* Header with actions */}
      <div className="flex justify-between items-center flex-wrap gap-4 w-full">
        <div className="flex flex-col gap-2">
          <div className="w-40 h-7 bg-gray-100 rounded" />
          <div className="w-64 h-5 bg-gray-100 rounded" />
        </div>
        <div className="w-28 h-9 bg-gray-100 rounded-lg" />
      </div>

      {/* Table */}
      <div className="mt-6 bg-white rounded-xl border border-gray-100 overflow-hidden w-full">
        {/* Table header */}
        <div className="flex gap-4 p-3 sm:p-4 bg-gray-50 border-b border-gray-100 w-full">
          <div className="w-1/4 h-4 bg-gray-100 rounded" />
          <div className="w-1/4 h-4 bg-gray-100 rounded" />
          <div className="w-1/4 h-4 bg-gray-100 rounded hidden sm:block" />
          <div className="w-1/4 h-4 bg-gray-100 rounded hidden sm:block" />
        </div>
        
        {/* Table rows - fewer on mobile */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-4 p-3 sm:p-4 border-b border-gray-50 last:border-0 w-full">
            <div className="w-1/4 h-4 bg-gray-100 rounded" />
            <div className="w-1/4 h-4 bg-gray-100 rounded" />
            <div className="w-1/4 h-4 bg-gray-100 rounded hidden sm:block" />
            <div className="w-1/4 h-4 bg-gray-100 rounded hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
});

/**
 * Analytics loading skeleton
 */
export const AnalyticsLoadingSkeleton = memo(function AnalyticsLoadingSkeleton() {
  return (
    <div className="flex-1 w-full min-h-screen p-4 sm:p-6 lg:p-8" aria-label="Loading analytics...">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="w-40 h-7 bg-gray-100 rounded" />
        <div className="w-64 h-5 bg-gray-100 rounded" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 sm:p-6 bg-white rounded-xl border border-gray-100">
            <div className="w-16 h-3 bg-gray-100 rounded mb-2" />
            <div className="w-20 h-7 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Chart area */}
      <div className="mt-6 bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
        <div className="w-28 h-5 bg-gray-100 rounded mb-4" />
        <div className="w-full h-48 sm:h-64 bg-gray-50 rounded" />
      </div>
    </div>
  );
});

/**
 * Form loading skeleton
 */
export const FormLoadingSkeleton = memo(function FormLoadingSkeleton() {
  return (
    <div className="flex-1 w-full min-h-screen p-4 sm:p-6 lg:p-8" aria-label="Loading...">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="w-40 h-7 bg-gray-100 rounded" />
        <div className="w-64 h-5 bg-gray-100 rounded" />
      </div>

      {/* Form */}
      <div className="mt-6 bg-white rounded-xl border border-gray-100 p-4 sm:p-6 space-y-5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="w-20 h-4 bg-gray-100 rounded" />
            <div className="w-full h-10 bg-gray-50 rounded-lg" />
          </div>
        ))}
        <div className="flex justify-end gap-3 pt-4">
          <div className="w-20 h-9 bg-gray-100 rounded-lg" />
          <div className="w-20 h-9 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
});

/**
 * Full-width Error State component
 * Used when data fetching fails - fills entire page width
 */
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export const ErrorState = memo(function ErrorState({
  title = 'Failed to load data',
  message = 'There was an error loading the content. Please try again.',
  onRetry,
  retryLabel = 'Retry',
}: ErrorStateProps) {
  return (
    <div className="flex-1 w-full min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="error-state-container">
        <span className="error-state-icon">⚠️</span>
        <h3 className="error-state-title">{title}</h3>
        <p className="error-state-message">{message}</p>
        {onRetry && (
          <button className="btn-primary-responsive" onClick={onRetry}>
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
});

/**
 * Inline Error State - for use inside sections (not full page)
 */
export const InlineErrorState = memo(function InlineErrorState({
  message = 'Failed to load data',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="inline-error-state">
      {message}{' '}
      {onRetry && (
        <button onClick={onRetry} className="text-primary font-semibold hover:underline">
          Retry
        </button>
      )}
    </div>
  );
});

export default PageLoadingSkeleton;
