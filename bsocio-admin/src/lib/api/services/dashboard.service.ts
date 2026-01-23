/**
 * ============================================
 * BSOCIO ADMIN - Dashboard Service
 * ============================================
 * Handles dashboard overview API calls
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  DashboardOverviewRequest,
  DashboardOverviewResponse,
} from '@/types';

/**
 * Dashboard Service Class
 */
class DashboardService {
  private static instance: DashboardService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): DashboardService {
    if (!DashboardService.instance) {
      DashboardService.instance = new DashboardService();
    }
    return DashboardService.instance;
  }

  /**
   * Get dashboard overview data
   */
  async getOverview(params?: DashboardOverviewRequest): Promise<DashboardOverviewResponse> {
    try {
      // Get timezone offset (negative for UTC offset)
      const tzOffsetMinutes = params?.tzOffsetMinutes ?? new Date().getTimezoneOffset();
      const activityTake = params?.activityTake ?? 10;

      const response = await apiClient.get<DashboardOverviewResponse>(
        API_ENDPOINTS.DASHBOARD.OVERVIEW,
        {
          params: {
            tzOffsetMinutes,
            activityTake,
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
export const dashboardService = DashboardService.getInstance();
export { DashboardService };
