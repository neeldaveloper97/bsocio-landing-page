/**
 * ============================================
 * BSOCIO ADMIN - TanStack Query Configuration
 * ============================================
 * QueryClient setup with optimized defaults for admin panel
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Query keys factory for type-safe query keys
 */
export const queryKeys = {
  // Dashboard
  dashboard: {
    overview: (params?: Record<string, any>) => ['dashboard', 'overview', params] as const,
  },
  
  // Admin Activity
  activity: {
    list: (skip: number, take: number, filter?: string, type?: string, search?: string, includeLogin?: boolean) => ['activity', 'list', skip, take, filter, type, search, includeLogin] as const,
    infinite: (filter?: string) => ['activity', 'infinite', filter] as const,
  },
  
  // News
  news: {
    all: (page?: number) => ['news', 'list', page] as const,
    byId: (id: string) => ['news', id] as const,
  },
  
  // Events
  events: {
    all: (page?: number) => ['events', 'list', page] as const,
    byId: (id: string) => ['events', id] as const,
  },
  
  // FAQs
  faqs: {
    all: () => ['faqs'] as const,
    byId: (id: string) => ['faqs', id] as const,
  },
  
  // Legal
  legal: {
    terms: () => ['legal', 'terms'] as const,
    privacy: () => ['legal', 'privacy'] as const,
    byType: (type: string) => ['legal', type] as const,
  },
  
  // Analytics
  analytics: {
    overview: (timeRange?: string) => ['analytics', 'overview', timeRange] as const,
    metrics: (metric: string, timeRange?: string) => ['analytics', 'metrics', metric, timeRange] as const,
  },
  
  // Users
  users: {
    all: (page?: number) => ['users', 'list', page] as const,
    byId: (id: string) => ['users', id] as const,
  },
  
  // Campaigns
  campaigns: {
    all: (page?: number) => ['campaigns', 'list', page] as const,
    byId: (id: string) => ['campaigns', id] as const,
  },
  
  // Awards
  awards: {
    all: (page?: number) => ['awards', 'list', page] as const,
    byId: (id: string) => ['awards', id] as const,
  },
  
  // Contacts
  contacts: {
    all: (page?: number) => ['contacts', 'list', page] as const,
    byId: (id: string) => ['contacts', id] as const,
  },
} as const;

/**
 * Create and configure QueryClient with optimized defaults
 * for admin dashboard performance
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Cache for 5 minutes - admin data changes less frequently
        staleTime: 5 * 60 * 1000,
        // Keep unused data in cache for 10 minutes
        gcTime: 10 * 60 * 1000,
        // Retry logic for failed requests
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry up to 2 times for 5xx errors
          return failureCount < 2;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus for real-time admin updates
        refetchOnWindowFocus: true,
        // Don't refetch on reconnect - admin panel
        refetchOnReconnect: false,
        // Refetch on mount only if data is stale
        refetchOnMount: true,
        // Network mode - online only
        networkMode: 'online',
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        retryDelay: 1000,
        // Network mode
        networkMode: 'online',
      },
    },
  });
}

/**
 * Singleton query client for the admin application
 * Created once and reused across the app
 */
export const queryClient = createQueryClient();

/**
 * Helper to prefetch data
 */
export async function prefetchQuery<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>
) {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
}

/**
 * Helper to invalidate queries by pattern
 */
export function invalidateQueries(queryKey: readonly unknown[]) {
  return queryClient.invalidateQueries({ queryKey });
}

/**
 * Helper to set query data
 */
export function setQueryData<T>(queryKey: readonly unknown[], data: T) {
  queryClient.setQueryData(queryKey, data);
}

/**
 * Helper to get query data
 */
export function getQueryData<T>(queryKey: readonly unknown[]): T | undefined {
  return queryClient.getQueryData(queryKey);
}
