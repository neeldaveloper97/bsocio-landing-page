/**
 * ============================================
 * BSOCIO - Events Service
 * ============================================
 * Service for fetching published events
 */

import { apiClient } from '../client';
import { API_ENDPOINTS } from '@/config';
import type { Event, EventFilters, EventStatistics } from '@/types';

/**
 * Events Service
 */
export const eventsService = {
  /**
   * Get all published events with optional filters
   */
  async getAll(filters?: EventFilters): Promise<Event[]> {
    const queryParams: Record<string, string> = {};
    
    if (filters?.filter) queryParams.filter = filters.filter;
    if (filters?.status) queryParams.status = filters.status;
    if (filters?.sortBy) queryParams.sortBy = filters.sortBy;
    if (filters?.sortOrder) queryParams.sortOrder = filters.sortOrder;

    const response = await apiClient.get<Event[]>(API_ENDPOINTS.EVENTS.LIST, queryParams);
    
    // The API returns an array of events directly
    return response.data;
  },

  /**
   * Get upcoming events only (published)
   */
  async getUpcoming(): Promise<Event[]> {
    return this.getAll({ filter: 'upcoming', status: 'PUBLISHED', sortOrder: 'asc' });
  },

  /**
   * Get past events only (published)
   */
  async getPast(): Promise<Event[]> {
    return this.getAll({ filter: 'past', status: 'PUBLISHED', sortOrder: 'desc' });
  },

  /**
   * Get event by ID
   */
  async getById(id: string): Promise<Event> {
    const response = await apiClient.get<Event>(API_ENDPOINTS.EVENTS.BY_ID(id));
    return response.data;
  },

  /**
   * Get event statistics
   */
  async getStatistics(): Promise<EventStatistics> {
    const response = await apiClient.get<EventStatistics>(API_ENDPOINTS.EVENTS.STATISTICS);
    return response.data;
  },
};