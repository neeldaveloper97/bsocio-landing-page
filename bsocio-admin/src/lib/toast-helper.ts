/**
 * ============================================
 * BSOCIO ADMIN - Toast Helper
 * ============================================
 * Helper functions for displaying toasts with backend error messages
 */

import { toast } from 'sonner';
import { getErrorMessage } from './api/error-handler';

/**
 * Show error toast with backend message
 */
export function showErrorToast(error: unknown, fallbackTitle = 'Error') {
  const message = getErrorMessage(error);
  toast.error(fallbackTitle, { description: message });
}

/**
 * Show success toast
 */
export function showSuccessToast(title: string, description?: string) {
  toast.success(title, { description });
}

/**
 * Show info toast
 */
export function showInfoToast(title: string, description?: string) {
  toast.info(title, { description });
}

/**
 * Show warning toast
 */
export function showWarningToast(title: string, description?: string) {
  toast.warning(title, { description });
}
