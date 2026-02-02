/**
 * ============================================
 * BSOCIO ADMIN - Events Service
 * ============================================
 * Handles Event CRUD operations
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  EventFilters,
  EventStatistics,
} from '@/types';

/**
 * Events Service Class
 */
class EventsService {
  private static instance: EventsService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): EventsService {
    if (!EventsService.instance) {
      EventsService.instance = new EventsService();
    }
    return EventsService.instance;
  }

  /**
   * Get all events with optional filters
   */
  async getAll(filters?: EventFilters): Promise<Event[]> {
    try {
      const response = await apiClient.get<Event[]>(
        API_ENDPOINTS.EVENTS.BASE,
        {
          params: filters as Record<string, string | number | boolean | undefined>,
        }
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Get event by ID
   */
  async getById(id: string): Promise<Event> {
    try {
      const response = await apiClient.get<Event>(
        API_ENDPOINTS.EVENTS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Create new event
   */
  async create(data: CreateEventRequest): Promise<Event> {
    try {
      const response = await apiClient.post<Event>(
        API_ENDPOINTS.EVENTS.BASE,
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Update event
   */
  async update(id: string, data: UpdateEventRequest): Promise<Event> {
    try {
      const response = await apiClient.patch<Event>(
        API_ENDPOINTS.EVENTS.BY_ID(id),
        data
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Delete event
   */
  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.EVENTS.BY_ID(id));
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Get event statistics
   */
  async getStatistics(): Promise<EventStatistics> {
    try {
      const response = await apiClient.get<EventStatistics>(
        API_ENDPOINTS.EVENTS.STATISTICS
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }
}

// Export singleton instance
export const eventsService = EventsService.getInstance();
export { EventsService };
