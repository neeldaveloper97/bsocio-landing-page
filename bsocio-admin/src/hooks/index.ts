/**
 * ============================================
 * BSOCIO ADMIN - Hooks Barrel Export
 * ============================================
 */

export { useAuth } from './useAuth';
export { useLogin } from './useLogin';
export { useDashboard } from './useDashboard';
export { useAnalytics } from './useAnalytics';
export { useFAQs } from './useFAQs';
export { useLegal } from './useLegal';
export { useAdminActivity } from './useAdminActivity';
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
