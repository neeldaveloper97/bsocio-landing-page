/**
 * ============================================
 * BSOCIO - React Query Provider
 * ============================================
 * Wraps app with QueryClientProvider and DevTools
 */

'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { ReactNode, lazy, Suspense } from 'react';

// Lazy load DevTools - only in development and on client
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtools,
  }))
);

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * Provider component for TanStack Query
 * Includes DevTools in development mode (lazy loaded)
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      )}
    </QueryClientProvider>
  );
}
