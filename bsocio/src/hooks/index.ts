/**
 * ============================================
 * BSOCIO - Custom Hooks Barrel Export
 * ============================================
 */

// Authentication Hooks
export { useSignup } from './useSignup';
export { useLogin } from './useLogin';
export { useAuth } from './useAuth';
export { useGoogleIdTokenAuth, useGoogleUserDataAuth, useGoogleAuthMutation } from './useGoogleAuth';

// FAQ Hooks
export { useFAQs } from './useFAQs';
export { useFAQ } from './useFAQ';

// Legal Hooks
export { useLegal } from './useLegal';

// News Hooks
export { useNews, useNewsArticle, useRelatedArticles } from './useNews';

// Events Hooks
export { useEvents, useUpcomingEvents, usePastEvents, useEvent, useEventStatistics } from './useEvents';

// Awards Hooks
export {
  useAwardCategories,
  useAwardCategoryById,
  useNominees,
  useApprovedNominees,
  useWinners,
  useNomineeById,
  useCeremonies,
  useUpcomingCeremonies,
  useCeremonyById,
  useSpecialGuests,
  useActiveGuests,
  useSpecialGuestById,
  useAwardsStatistics,
} from './useAwards';

// Subscribe Hooks
export { useSubscribe } from './useSubscribe';
