/**
 * ============================================
 * BSOCIO ADMIN - useEvents Hook
 * ============================================
 * Custom hook for managing Events
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { eventsService } from '@/lib/api/services/events.service';
import type { Event, EventFilters, CreateEventRequest, UpdateEventRequest, EventStatistics } from '@/types';
import type { ApiException } from '@/lib/api/error-handler';

/**
 * Hook return interface
 */
interface UseEventsReturn {
  /** Events data */
  data: Event[];
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
 * Hook for fetching events list
 */
export function useEvents(filters?: EventFilters): UseEventsReturn {
  const [data, setData] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await eventsService.getAll(filters);
      setData(result);
    } catch (err) {
      setIsError(true);
      setError(err as ApiException);
    } finally {
      setIsLoading(false);
    }
  }, [filters?.filter, filters?.status, filters?.sortBy, filters?.sortOrder]);

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
 * Hook for fetching single event
 */
export function useEventById(id: string) {
  const [data, setData] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await eventsService.getById(id);
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
 * Hook for creating event
 */
export function useCreateEvent() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (data: CreateEventRequest): Promise<Event> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await eventsService.create(data);
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
 * Hook for updating event
 */
export function useUpdateEvent() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async ({ id, data }: { id: string; data: UpdateEventRequest }): Promise<Event> => {
    setIsPending(true);
    setError(null);
    try {
      const result = await eventsService.update(id, data);
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
 * Hook for deleting event
 */
export function useDeleteEvent() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const mutateAsync = async (id: string): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      await eventsService.delete(id);
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
 * Hook for fetching event statistics
 */
export function useEventStatistics() {
  const [data, setData] = useState<EventStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<ApiException | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await eventsService.getStatistics();
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
