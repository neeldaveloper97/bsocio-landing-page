/**
 * ============================================
 * BSOCIO - TanStack Query Configuration
 * ============================================
 * QueryClient setup with default options
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Query keys factory for type-safe query keys
 */
export const queryKeys = {
  // Auth queries
  auth: {
    me: () => ['auth', 'me'] as const,
  },
  
  // FAQ queries
  faqs: {
    all: () => ['faqs'] as const,
    byId: (id: string) => ['faqs', id] as const,
  },
  
  // Legal queries
  legal: {
    terms: () => ['legal', 'terms'] as const,
    privacy: () => ['legal', 'privacy'] as const,
  },
  
  // User queries
  users: {
    profile: () => ['users', 'profile'] as const,
  },
} as const;

/**
 * Create and configure QueryClient
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Keep unused data in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Retry failed requests
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus for fresh data
        refetchOnWindowFocus: true,
        // Don't refetch on mount if data is fresh
        refetchOnMount: true,
      },
      mutations: {
        // Retry mutations once
        retry: 1,
      },
    },
  });
}

// Export singleton instance
export const queryClient = createQueryClient();
