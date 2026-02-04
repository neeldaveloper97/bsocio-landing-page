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
      // Convert skip/take to page/limit for backend
      const skip = params?.skip ?? 0;
      const take = params?.take ?? 10;
      const page = Math.floor(skip / take) + 1;
      const limit = take;

      const response = await apiClient.get<AdminUserResponse>(
        API_ENDPOINTS.ADMIN.USERS.BASE,
        {
          params: {
            page,
            limit,
            ...(params?.role ? { role: params.role } : {}),
            ...(params?.search ? { search: params.search } : {}),
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

  /**
   * Export admin users to CSV
   */
  async exportUsers(params?: AdminUserRequest): Promise<Blob> {
    try {
      // Convert skip/take to page/limit for backend
      const skip = params?.skip ?? 0;
      const take = params?.take ?? 10;
      const page = Math.floor(skip / take) + 1;
      const limit = take;

      // Build the full URL with query params
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7000';
      const url = new URL(API_ENDPOINTS.ADMIN.USERS.EXPORT, baseUrl);
      url.searchParams.append('page', String(page));
      url.searchParams.append('limit', String(limit));
      if (params?.role) url.searchParams.append('role', params.role);
      if (params?.search) url.searchParams.append('search', params.search);

      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export users');
      }

      return await response.blob();
    } catch (error) {
      throw parseApiError(error);
    }
  }
}

// Export singleton instance
export const adminUsersService = AdminUsersService.getInstance();
export { AdminUsersService };
