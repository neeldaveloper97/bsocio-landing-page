/**
 * ============================================
 * BSOCIO - API Layer Barrel Export
 * ============================================
 * Centralized exports for API utilities
 */

// API Client
export { apiClient } from './client';

// Services
export { authService, AuthService, faqService, FAQService, legalService, LegalService } from './services';

// Error Handling
export {
  ApiException,
  parseApiError,
  getErrorMessage,
  ERROR_CODES,
  ERROR_MESSAGES,
  type ErrorCode,
} from './error-handler';
