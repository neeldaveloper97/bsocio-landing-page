/**
 * ============================================
 * BSOCIO ADMIN - Admin Users Service
 * ============================================
 * Handles admin users API calls
 */

import { apiClient } from '../client';
import { parseApiError } from '../error-handler';
import { API_ENDPOINTS } from '@/config';
import { env } from '@/config/env';
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
      // Use page and limit directly
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 10;

      const response = await apiClient.get<{
        data: Array<{
          id: string;
          email: string;
          role: string;
          createdAt: string;
          isPermanentUser?: boolean;
          oauthProvider?: string;
          isActive?: boolean;
        }>;
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>(
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

      // Transform backend response to frontend expected format
      const roleLabels: Record<string, string> = {
        SUPER_ADMIN: 'Super Admin',
        CONTENT_ADMIN: 'Content Manager',
        COMMUNICATIONS_ADMIN: 'Communications Manager',
        ANALYTICS_VIEWER: 'Analytics Viewer',
        USER: 'User',
      };

      const rolePermissions: Record<string, string[]> = {
        SUPER_ADMIN: ['All Access'],
        CONTENT_ADMIN: ['Manage Content', 'View Analytics'],
        COMMUNICATIONS_ADMIN: ['Manage Campaigns', 'Send Emails'],
        ANALYTICS_VIEWER: ['View Analytics'],
        USER: ['View Only'],
      };

      const items: AdminUser[] = response.data.data.map((user) => ({
        id: user.id,
        name: user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1),
        email: user.email,
        role: roleLabels[user.role] || user.role,
        roleKey: user.role as AdminRoleKey,
        permissions: rolePermissions[user.role] || [],
        lastLogin: new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        status: user.isActive !== false ? 'active' : 'inactive',
        createdAt: user.createdAt,
      }));

      return {
        items,
        total: response.data.meta.total,
        page: page,
        limit: limit,
      };
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
      // Use page and limit directly
      const page = params?.page ?? 1;
      const limit = params?.limit ?? 100; // Export more by default

      // Build the full URL with query params
      const baseUrl = env.apiBaseUrl;
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

  /**
   * Toggle user active status (activate/deactivate)
   */
  async toggleUserStatus(id: string, isActive: boolean): Promise<{ id: string; isActive: boolean }> {
    try {
      const response = await apiClient.put<{ id: string; isActive: boolean }>(
        API_ENDPOINTS.ADMIN.USERS.STATUS(id),
        { isActive }
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
