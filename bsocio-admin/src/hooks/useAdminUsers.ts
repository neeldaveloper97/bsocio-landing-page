/**
 * ============================================
 * BSOCIO ADMIN - useAdminUsers Hook
 * ============================================
 * React Query hooks for admin users management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminUsersService } from '@/lib/api/services';
import type {
  AdminUserRequest,
  AdminUserResponse,
  AdminUserStats,
  AdminRoleKey,
} from '@/types';

// Query keys
const ADMIN_USERS_KEYS = {
  all: ['admin-users'] as const,
  list: (params?: AdminUserRequest) => ['admin-users', 'list', params] as const,
  stats: () => ['admin-users', 'stats'] as const,
  detail: (id: string) => ['admin-users', 'detail', id] as const,
};

/**
 * Hook for fetching paginated admin users
 */
export function useAdminUsers(params?: AdminUserRequest) {
  return useQuery<AdminUserResponse>({
    queryKey: ADMIN_USERS_KEYS.list(params),
    queryFn: () => adminUsersService.getAdminUsers(params),
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook for fetching admin user statistics
 */
export function useAdminUserStats() {
  return useQuery<AdminUserStats>({
    queryKey: ADMIN_USERS_KEYS.stats(),
    queryFn: () => adminUsersService.getStats(),
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook for updating admin user role
 */
export function useUpdateAdminUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: AdminRoleKey }) =>
      adminUsersService.updateRole(id, role),
    onSuccess: () => {
      // Invalidate all admin user queries
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.all });
    },
  });
}

/**
 * Hook for exporting admin users to CSV
 */
export function useExportAdminUsers() {
  return useMutation({
    mutationFn: (params?: AdminUserRequest) => adminUsersService.exportUsers(params),
    onSuccess: (blob) => {
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `admin-users-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}

/**
 * Hook for toggling admin user active status
 */
export function useToggleAdminUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminUsersService.toggleUserStatus(id, isActive),
    onSuccess: () => {
      // Invalidate all admin user queries
      queryClient.invalidateQueries({ queryKey: ADMIN_USERS_KEYS.all });
    },
  });
}

// Export query keys for external use
export { ADMIN_USERS_KEYS };
