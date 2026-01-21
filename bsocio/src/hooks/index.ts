/**
 * ============================================
 * BSOCIO - Custom Hooks Barrel Export
 * ============================================
 */

// Generic Async Utilities
export {
  useAsync,
  useFetch,
  useMutation,
  type AsyncState,
  type AsyncOptions,
  type UseAsyncReturn,
  type UseFetchOptions,
  type UseFetchReturn,
  type UseMutationReturn,
} from './useAsync';

// Authentication Hooks
export { useSignup } from './useSignup';
export { useLogin } from './useLogin';
export { useAuth } from './useAuth';

// FAQ Hooks
export { useFAQs } from './useFAQs';
export { useFAQ } from './useFAQ';

// Legal Hooks
export { useLegal } from './useLegal';
