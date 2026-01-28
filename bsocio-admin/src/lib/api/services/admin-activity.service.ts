/**
 * ============================================
 * BSOCIO ADMIN - Admin Activity Service
 * ============================================
 * Handles admin activity API calls
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  AdminActivityRequest,
  AdminActivityResponse,
} from '@/types';

/**
 * Admin Activity Service Class
 */
class AdminActivityService {
  private static instance: AdminActivityService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AdminActivityService {
    if (!AdminActivityService.instance) {
      AdminActivityService.instance = new AdminActivityService();
    }
    return AdminActivityService.instance;
  }

  /**
   * Get paginated admin activities
   */
  async getActivities(params?: AdminActivityRequest): Promise<AdminActivityResponse> {
    try {
      const skip = params?.skip ?? 0;
      const take = params?.take ?? 10;
      const filter = params?.filter;
      const sortBy = params?.sortBy;
      const sortOrder = params?.sortOrder;

      const response = await apiClient.get<AdminActivityResponse>(
        API_ENDPOINTS.ADMIN.ACTIVITY,
        {
          params: {
            skip,
            take,
            ...(filter ? { filter } : {}),
            ...(sortBy ? { sortBy } : {}),
            ...(sortOrder ? { sortOrder } : {}),
          },
        }
      );

      // Backend returns data directly, not wrapped
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }
}

/**
 * Export singleton instance
 */
export const adminActivityService = AdminActivityService.getInstance();
export { AdminActivityService };
