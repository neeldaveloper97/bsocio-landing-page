/**
 * ============================================
 * BSOCIO ADMIN - useDashboard Hook
 * ============================================
 * Custom hook for fetching dashboard overview data
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { dashboardService, type ApiException } from '@/lib/api';
import type { DashboardOverviewResponse, DashboardOverviewRequest } from '@/types';

/**
 * Hook return interface
 */
interface UseDashboardReturn {
  /** Dashboard overview data */
  data: DashboardOverviewResponse | null;
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
interface UseDashboardOptions {
  /** Whether to fetch on mount */
  enabled?: boolean;
  /** Request parameters */
  params?: DashboardOverviewRequest;
}

/**
 * Custom hook for fetching dashboard overview data
 */
export function useDashboard(options: UseDashboardOptions = {}): UseDashboardReturn {
  const { enabled = true, params } = options;

  const [data, setData] = useState<DashboardOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const response = await dashboardService.getOverview(params);
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
