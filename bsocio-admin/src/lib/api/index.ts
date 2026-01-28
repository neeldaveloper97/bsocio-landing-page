/**
 * ============================================
 * BSOCIO ADMIN - API Layer Barrel Export
 * ============================================
 * Centralized exports for API utilities
 */

// API Client
export { apiClient } from './client';

// Token Storage
export { tokenStorage, STORAGE_KEYS } from './storage';

// Services
export {
  authService,
  AuthService,
  dashboardService,
  DashboardService,
  analyticsService,
  AnalyticsService,
  faqService,
  FAQService,
  legalService,
  LegalService,
  adminActivityService,
  AdminActivityService,
} from './services';

// Error Handling
export {
  ApiException,
  parseApiError,
  getErrorMessage,
  ERROR_CODES,
  ERROR_MESSAGES,
  type ErrorCode,
} from './error-handler';
