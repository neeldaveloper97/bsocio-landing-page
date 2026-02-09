/**
 * ============================================
 * BSOCIO - useAwards Hook
 * ============================================
 * Hooks for fetching award categories, nominees, ceremonies, and special guests
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { awardsService } from '@/lib/api/services/awards.service';
import type {
  AwardCategory,
  Nominee,
  Ceremony,
  SpecialGuest,
  AwardsStatistics,
} from '@/types';

// ==================== Award Categories Hooks ====================

interface UseAwardCategoriesReturn {
  categories: AwardCategory[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching award categories
 */
export function useAwardCategories(status?: string): UseAwardCategoriesReturn {
  const [categories, setCategories] = useState<AwardCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getCategories(status);
      setCategories(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch award categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    categories,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching single award category by ID
 */
export function useAwardCategoryById(id: string) {
  const [category, setCategory] = useState<AwardCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getCategoryById(id);
      setCategory(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch award category:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    category,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

// ==================== Nominees Hooks ====================

interface UseNomineesReturn {
  nominees: Nominee[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

interface UseNomineesParams {
  categoryId?: string;
  status?: string;
  isWinner?: boolean;
}

/**
 * Hook for fetching nominees
 */
export function useNominees(params?: UseNomineesParams): UseNomineesReturn {
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getNominees(params);
      setNominees(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch nominees:', err);
    } finally {
      setIsLoading(false);
    }
  }, [params?.categoryId, params?.status, params?.isWinner]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    nominees,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching approved nominees only
 */
export function useApprovedNominees(categoryId?: string): UseNomineesReturn {
  return useNominees({ status: 'APPROVED', categoryId });
}

/**
 * Hook for fetching winners only
 */
export function useWinners(): UseNomineesReturn {
  return useNominees({ isWinner: true });
}

/**
 * Hook for fetching single nominee by ID
 */
export function useNomineeById(id: string) {
  const [nominee, setNominee] = useState<Nominee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getNomineeById(id);
      setNominee(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch nominee:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    nominee,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

// ==================== Ceremonies Hooks ====================

interface UseCeremoniesReturn {
  ceremonies: Ceremony[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching ceremonies
 */
export function useCeremonies(status?: string): UseCeremoniesReturn {
  const [ceremonies, setCeremonies] = useState<Ceremony[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getCeremonies(status);
      setCeremonies(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch ceremonies:', err);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ceremonies,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching upcoming ceremonies only
 */
export function useUpcomingCeremonies(): UseCeremoniesReturn {
  return useCeremonies('UPCOMING');
}

/**
 * Hook for fetching single ceremony by ID
 */
export function useCeremonyById(id: string) {
  const [ceremony, setCeremony] = useState<Ceremony | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getCeremonyById(id);
      setCeremony(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch ceremony:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    ceremony,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

// ==================== Special Guests Hooks ====================

interface UseSpecialGuestsReturn {
  guests: SpecialGuest[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching special guests
 * Pass enabled=false to skip fetching (lazy-loading support)
 */
export function useSpecialGuests(status?: string, enabled: boolean = true): UseSpecialGuestsReturn {
  const [guests, setGuests] = useState<SpecialGuest[]>([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getSpecialGuests(status);
      setGuests(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch special guests:', err);
    } finally {
      setIsLoading(false);
    }
  }, [status, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    guests,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching active special guests only
 * Pass enabled=false to skip fetching (lazy-loading support)
 */
export function useActiveGuests(enabled: boolean = true): UseSpecialGuestsReturn {
  return useSpecialGuests('ACTIVE', enabled);
}

/**
 * Hook for fetching single special guest by ID
 */
export function useSpecialGuestById(id: string) {
  const [guest, setGuest] = useState<SpecialGuest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getSpecialGuestById(id);
      setGuest(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch special guest:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    guest,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

// ==================== Statistics Hook ====================

interface UseAwardsStatisticsReturn {
  statistics: AwardsStatistics | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching awards statistics
 */
export function useAwardsStatistics(): UseAwardsStatisticsReturn {
  const [statistics, setStatistics] = useState<AwardsStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getStatistics();
      setStatistics(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch awards statistics:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    statistics,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}
