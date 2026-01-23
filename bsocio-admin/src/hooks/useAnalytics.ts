/**
 * ============================================
 * BSOCIO ADMIN - useAnalytics Hook
 * ============================================
 * Custom hook for fetching analytics data
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { analyticsService, type ApiException } from '@/lib/api';
import type { AnalyticsOverviewResponse, AnalyticsRequest } from '@/types';

/**
 * Hook return interface
 */
interface UseAnalyticsReturn {
  /** Analytics overview data */
  data: AnalyticsOverviewResponse | null;
  /** Whether data is loading */
  isLoading: boolean;
  /** Whether there was an error */
  isError: boolean;
  /** Error if any */
  error: ApiException | null;
  /** Refetch the data */
  refetch: () => Promise<void>;
}

/**
 * Hook options
 */
interface UseAnalyticsOptions {
  /** Whether to fetch on mount */
  enabled?: boolean;
  /** Request parameters */
  params?: AnalyticsRequest;
}

/**
 * Custom hook for fetching analytics data
 */
export function useAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsReturn {
  const { enabled = true, params } = options;

  const [data, setData] = useState<AnalyticsOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await analyticsService.getOverview(params);
      setData(response);
    } catch (err) {
      setError(err as ApiException);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}
