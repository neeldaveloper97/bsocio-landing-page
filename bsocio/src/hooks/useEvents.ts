/**
 * ============================================
 * BSOCIO - useEvents Hook
 * ============================================
 * Hook for fetching published events
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { eventsService } from '@/lib/api/services/events.service';
import type { Event, EventFilters, EventStatistics } from '@/types';

interface UseEventsParams {
  filter?: 'upcoming' | 'past' | 'all';
  status?: 'DRAFT' | 'PUBLISHED';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface UseEventsReturn {
  events: Event[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching events list with optional filters
 */
export function useEvents(params?: UseEventsParams): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await eventsService.getAll(params);
      setEvents(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch events:', err);
    } finally {
      setIsLoading(false);
    }
  }, [params?.filter, params?.status, params?.sortBy, params?.sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    events,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching upcoming events only
 */
export function useUpcomingEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await eventsService.getUpcoming();
      setEvents(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch upcoming events:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    events,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

/**
 * Hook for fetching past events only
 */
export function usePastEvents(): UseEventsReturn {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await eventsService.getPast();
      setEvents(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch past events:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    events,
    isLoading,
    isError,
    error,
    refetch: fetchData,
  };
}

interface UseEventReturn {
  event: Event | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Hook for fetching a single event by ID
 */
export function useEvent(id: string): UseEventReturn {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      setError(null);
      try {
        const result = await eventsService.getById(id);
        setEvent(result);
      } catch (err) {
        setIsError(true);
        setError(err as Error);
        console.error('Failed to fetch event:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return {
    event,
    isLoading,
    isError,
    error,
  };
}

interface UseEventStatisticsReturn {
  statistics: EventStatistics | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook for fetching event statistics
 */
export function useEventStatistics(): UseEventStatisticsReturn {
  const [statistics, setStatistics] = useState<EventStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const result = await eventsService.getStatistics();
      setStatistics(result);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      console.error('Failed to fetch event statistics:', err);
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
