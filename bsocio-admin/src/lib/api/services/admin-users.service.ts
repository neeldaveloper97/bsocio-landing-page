/**
 * ============================================
 * BSOCIO ADMIN - Admin Users Service
 * ============================================
 * Handles admin users API calls
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import type {
  AdminUserRequest,
  AdminUserResponse,
  AdminUserStats,
  AdminUser,
  AdminRoleKey,
} from '@/types';

/**
 * Admin Users Service Class
 */
class AdminUsersService {
  private static instance: AdminUsersService;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AdminUsersService {
    if (!AdminUsersService.instance) {
      AdminUsersService.instance = new AdminUsersService();
    }
    return AdminUsersService.instance;
  }

  /**
   * Get paginated admin users
   */
  async getAdminUsers(params?: AdminUserRequest): Promise<AdminUserResponse> {
    try {
      const response = await apiClient.get<AdminUserResponse>(
        API_ENDPOINTS.ADMIN.USERS.BASE,
        {
          params: {
            skip: params?.skip ?? 0,
            take: params?.take ?? 10,
            ...(params?.role ? { role: params.role } : {}),
            ...(params?.status ? { status: params.status } : {}),
            ...(params?.search ? { search: params.search } : {}),
            ...(params?.sortBy ? { sortBy: params.sortBy } : {}),
            ...(params?.sortOrder ? { sortOrder: params.sortOrder } : {}),
          },
        }
      );

      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Get admin user statistics
   */
  async getStats(): Promise<AdminUserStats> {
    try {
      const response = await apiClient.get<AdminUserStats>(
        API_ENDPOINTS.ADMIN.USERS.STATS
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Get admin user by ID
   */
  async getById(id: string): Promise<AdminUser> {
    try {
      const response = await apiClient.get<AdminUser>(
        API_ENDPOINTS.ADMIN.USERS.BY_ID(id)
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }

  /**
   * Update admin user role
   */
  async updateRole(id: string, role: AdminRoleKey): Promise<AdminUser> {
    try {
      const response = await apiClient.patch<AdminUser>(
        API_ENDPOINTS.ADMIN.USERS.BY_ID(id),
        { role }
      );
      return response.data;
    } catch (error) {
      throw parseApiError(error);
    }
  }
}

// Export singleton instance
export const adminUsersService = AdminUsersService.getInstance();
export { AdminUsersService };
