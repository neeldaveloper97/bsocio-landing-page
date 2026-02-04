/**
 * ============================================
 * BSOCIO ADMIN - Hooks Barrel Export
 * ============================================
 * 
 * PERFORMANCE NOTE:
 * - Original hooks use useEffect + fetch (causes waterfalls)
 * - Optimized hooks use React Query (parallel, cached, deduped)
 * - Use optimized/* hooks for new development
 * ============================================
 */

// Core hooks
export { useAuth } from './useAuth';
export { useLogin } from './useLogin';

// Legacy hooks (for backward compatibility)
export { useDashboard } from './useDashboard';
export { useAnalytics } from './useAnalytics';
export { useFAQs } from './useFAQs';
export { useLegal } from './useLegal';
export { useAdminActivity } from './useAdminActivity';

// ============================================
// OPTIMIZED HOOKS (React Query based)
// Use these for better performance!
// ============================================
export {
  useDashboardOptimized,
  useAdminActivityOptimized,
  useFAQsOptimized,
  useLegalOptimized,
  useAnalyticsOptimized,
  useDashboardParallel,
  prefetchDashboardData,
  prefetchAdminActivity,
} from './optimized';
export {
  useNews,
  useNewsById,
  useCreateNews,
  useUpdateNews,
  useArchiveNews,
  useDeleteNews,
  useUploadImage,
  useDeleteImage,
} from './useNews';
export {
  useCampaigns,
  useCampaignById,
  useSendCampaign,
  useSaveCampaignDraft,
} from './useCampaigns';
export {
  useContacts,
  useContactById,
} from './useContacts';
export {
  useEvents,
  useEventById,
  useCreateEvent,
  useUpdateEvent,
  useDeleteEvent,
  useEventStatistics,
} from './useEvents';
export {
  useAwardCategories,
  useAwardCategoryById,
  useCreateAwardCategory,
  useUpdateAwardCategory,
  useDeleteAwardCategory,
  useNominees,
  useNomineeById,
  useCreateNominee,
  useUpdateNominee,
  useDeleteNominee,
  useCeremonies,
  useCeremonyById,
  useCreateCeremony,
  useUpdateCeremony,
  useDeleteCeremony,
  useSpecialGuests,
  useSpecialGuestById,
  useCreateSpecialGuest,
  useUpdateSpecialGuest,
  useDeleteSpecialGuest,
  useAwardsStatistics,
} from './useAwards';
export {
  useAdminUsers,
  useAdminUserStats,
  useUpdateAdminUserRole,
  ADMIN_USERS_KEYS,
} from './useAdminUsers';
