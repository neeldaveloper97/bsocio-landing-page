/**
 * ============================================
 * BSOCIO ADMIN - useAwards Hook
 * ============================================
 * Custom hooks for managing Award Categories, Nominees, Ceremonies, and Special Guests
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { awardsService } from '@/lib/api/services/awards.service';
import type {
  AwardCategory,
  CreateAwardCategoryRequest,
  UpdateAwardCategoryRequest,
  AwardCategoryFilters,
  Nominee,
  CreateNomineeRequest,
  UpdateNomineeRequest,
  NomineeFilters,
  Ceremony,
  CreateCeremonyRequest,
  UpdateCeremonyRequest,
  CeremonyFilters,
  SpecialGuest,
  CreateSpecialGuestRequest,
  UpdateSpecialGuestRequest,
  SpecialGuestFilters,
  AwardsStatistics,
  PaginatedResponse,
} from '@/types';
import type { ApiException } from '@/lib/api/error-handler';

// ==================== Award Categories Hooks ====================

/**
 * Hook for fetching award categories list
 */
export function useAwardCategories(filters?: AwardCategoryFilters) {
  const [data, setData] = useState<PaginatedResponse<AwardCategory> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getCategories(filters);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.skip, filters?.take, filters?.search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    categories: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching single award category
 */
export function useAwardCategoryById(id: string) {
  const [data, setData] = useState<AwardCategory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getCategoryById(id);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for creating award category
 */
export function useCreateAwardCategory() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (data: CreateAwardCategoryRequest): Promise<AwardCategory> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await awardsService.createCategory(data);
      return result;
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

/**
 * Hook for updating award category
 */
export function useUpdateAwardCategory() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async ({ id, data }: { id: string; data: UpdateAwardCategoryRequest }): Promise<AwardCategory> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await awardsService.updateCategory(id, data);
      return result;
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

/**
 * Hook for deleting award category
 */
export function useDeleteAwardCategory() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (id: string): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      await awardsService.deleteCategory(id);
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

// ==================== Nominees Hooks ====================

/**
 * Hook for fetching nominees list
 */
export function useNominees(filters?: NomineeFilters) {
  const [data, setData] = useState<PaginatedResponse<Nominee> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getNominees(filters);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.categoryId, filters?.status, filters?.isWinner, filters?.skip, filters?.take, filters?.search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    nominees: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching single nominee
 */
export function useNomineeById(id: string) {
  const [data, setData] = useState<Nominee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getNomineeById(id);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for creating nominee
 */
export function useCreateNominee() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (data: CreateNomineeRequest): Promise<Nominee> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await awardsService.createNominee(data);
      return result;
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

/**
 * Hook for updating nominee
 */
export function useUpdateNominee() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async ({ id, data }: { id: string; data: UpdateNomineeRequest }): Promise<Nominee> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await awardsService.updateNominee(id, data);
      return result;
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

/**
 * Hook for deleting nominee
 */
export function useDeleteNominee() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (id: string): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      await awardsService.deleteNominee(id);
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

// ==================== Ceremonies Hooks ====================

/**
 * Hook for fetching ceremonies list
 */
export function useCeremonies(filters?: CeremonyFilters) {
  const [data, setData] = useState<Ceremony[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getCeremonies(filters);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching single ceremony
 */
export function useCeremonyById(id: string) {
  const [data, setData] = useState<Ceremony | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getCeremonyById(id);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for creating ceremony
 */
export function useCreateCeremony() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (data: CreateCeremonyRequest): Promise<Ceremony> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await awardsService.createCeremony(data);
      return result;
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

/**
 * Hook for updating ceremony
 */
export function useUpdateCeremony() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async ({ id, data }: { id: string; data: UpdateCeremonyRequest }): Promise<Ceremony> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await awardsService.updateCeremony(id, data);
      return result;
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

/**
 * Hook for deleting ceremony
 */
export function useDeleteCeremony() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (id: string): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      await awardsService.deleteCeremony(id);
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

// ==================== Special Guests Hooks ====================

/**
 * Hook for fetching special guests list (paginated)
 */
export function useSpecialGuests(filters?: SpecialGuestFilters) {
  const [data, setData] = useState<PaginatedResponse<SpecialGuest> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getSpecialGuests(filters);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.status, filters?.skip, filters?.take, filters?.search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    guests: data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching single special guest
 */
export function useSpecialGuestById(id: string) {
  const [data, setData] = useState<SpecialGuest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getSpecialGuestById(id);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for creating special guest
 */
export function useCreateSpecialGuest() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (data: CreateSpecialGuestRequest): Promise<SpecialGuest> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await awardsService.createSpecialGuest(data);
      return result;
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

/**
 * Hook for updating special guest
 */
export function useUpdateSpecialGuest() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async ({ id, data }: { id: string; data: UpdateSpecialGuestRequest }): Promise<SpecialGuest> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await awardsService.updateSpecialGuest(id, data);
      return result;
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

/**
 * Hook for deleting special guest
 */
export function useDeleteSpecialGuest() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (id: string): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      await awardsService.deleteSpecialGuest(id);
    } catch (err) {
      setError(err as ApiException);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { mutateAsync, isPending, error };
}

// ==================== Statistics Hook ====================

/**
 * Hook for fetching awards statistics
 */
export function useAwardsStatistics() {
  const [data, setData] = useState<AwardsStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await awardsService.getStatistics();
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}
