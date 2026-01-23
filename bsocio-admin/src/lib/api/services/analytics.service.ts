/**
 * ============================================
 * BSOCIO ADMIN - Analytics Service
 * ============================================
 * Handles analytics API calls
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  AnalyticsRequest,
  AnalyticsOverviewResponse,
} from '@/types';

/**
 * Analytics Service Class
 */
class AnalyticsService {
  private static instance: AnalyticsService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Get analytics overview data
   */
  async getOverview(params?: AnalyticsRequest): Promise<AnalyticsOverviewResponse> {
    try {
      const now = new Date();
      const year = params?.year ?? now.getFullYear();
      const month = params?.month ?? now.getMonth() + 1; // 1-indexed

      const response = await apiClient.get<AnalyticsOverviewResponse>(
        API_ENDPOINTS.ANALYTICS.OVERVIEW,
        {
          params: {
            year,
            month,
          },
        }
      );

      // Backend returns data directly, not wrapped in { data: ... }
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }
}

/**
 * Export singleton instance
 */
export const analyticsService = AnalyticsService.getInstance();
export { AnalyticsService };
