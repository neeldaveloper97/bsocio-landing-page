/**
 * ============================================
 * BSOCIO ADMIN - useAdminActivity Hook
 * ============================================
 * Hook for managing paginated admin activities
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminActivityService } from '@/lib/api';
import type { AdminActivity } from '@/types';

type TimeFilter = '24h' | 'week' | 'month' | undefined;
type SortField = 'createdAt';
type SortOrder = 'asc' | 'desc';

interface UseAdminActivityState {
  activities: AdminActivity[];
  total: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: Error | null;
  filter: TimeFilter;
  sortBy: SortField;
  sortOrder: SortOrder;
}

interface UseAdminActivityActions {
  nextPage: () => void;
  prevPage: () => void;
  goToPage: (page: number) => void;
  setFilter: (filter: TimeFilter) => void;
  setSort: (field: SortField, order: SortOrder) => void;
  refresh: () => void;
}

type UseAdminActivityReturn = UseAdminActivityState & UseAdminActivityActions;

const ITEMS_PER_PAGE = 10;

/**
 * Hook for managing admin activities with pagination and filtering
 */
export function useAdminActivity(): UseAdminActivityReturn {
  const [currentPage, setCurrentPage] = useState(1);
  const [activities, setActivities] = useState<AdminActivity[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filter, setFilterState] = useState<TimeFilter>(undefined);
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Calculate pagination values
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  // Load activities when page or filter changes
  useEffect(() => {
    const loadActivities = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await adminActivityService.getActivities({
          skip,
          take: ITEMS_PER_PAGE,
          filter,
          sortBy,
          sortOrder,
        });
        
        setActivities(response.activities);
        setTotal(response.total);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load activities'));
      } finally {
        setIsLoading(false);
      }
    };

    loadActivities();
  }, [currentPage, skip, filter, sortBy, sortOrder]);

  // Navigation actions
  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const setFilter = useCallback((newFilter: TimeFilter) => {
    setFilterState(newFilter);
    setCurrentPage(1); // Reset to first page when filter changes
  }, []);

  const setSort = useCallback((field: SortField, order: SortOrder) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset to first page when sort changes
  }, []);

  const refresh = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    activities,
    total,
    currentPage,
    totalPages,
    isLoading,
    error,
    filter,
    sortBy,
    sortOrder,
    nextPage,
    prevPage,
    goToPage,
    setFilter,
    setSort,
    refresh,
  };
}
