/**
 * ============================================
 * BSOCIO ADMIN - API Configuration
 * ============================================
 * Centralized API endpoint configuration for admin dashboard
 */

import { env } from './env';

/**
 * API Client Configuration
 */
export const API_CONFIG = {
  baseURL: env.apiBaseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
} as const;

/**
 * API Endpoints for Admin Dashboard
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Admin Dashboard
  DASHBOARD: {
    OVERVIEW: '/admin-dashboard/overview',
  },

  // Admin Activity
  ADMIN: {
    ACTIVITY: '/admin-dashboard/activity',
    ACTIVITY_STATS: '/admin-dashboard/activity/stats',
    USERS: {
      BASE: '/admin/users',
      STATS: '/admin/users/stats',
      EXPORT: '/admin/users/export',
      BY_ID: (id: string) => `/admin/users/${id}`,
      STATUS: (id: string) => `/admin/users/${id}/status`,
    },
  },

  // Analytics
  ANALYTICS: {
    OVERVIEW: '/admin-dashboard/analytics/overview',
  },

  // FAQs Management
  FAQS: {
    BASE: '/admin-dashboard/faqs',
    BY_ID: (id: string) => `/admin-dashboard/faqs/${id}`,
    REORDER: '/admin-dashboard/faqs/reorder',
  },

  // Legal Documents
  LEGAL: {
    BY_TYPE: (type: 'TERMS_OF_USE' | 'PRIVACY_POLICY') => `/admin-dashboard/legal/${type}`,
  },

  // News & Media Management
  NEWS: {
    BASE: '/admin-dashboard/news',
    BY_ID: (id: string) => `/admin-dashboard/news/${id}`,
    ARCHIVE: (id: string) => `/admin-dashboard/news/${id}/archive`,
  },

  // Images (S3)
  IMAGES: {
    UPLOAD: '/images',
    DELETE: '/images',
    SIGNED_URL: '/images/signed-url',
    RAW: '/images/raw',
  },

  // Users Management
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },

  // Email Campaigns
  CAMPAIGNS: {
    BASE: '/admin-dashboard/campaigns',
    BY_ID: (id: string) => `/admin-dashboard/campaigns/${id}`,
    SEND: '/admin-dashboard/campaigns/send',
    DRAFT: '/admin-dashboard/campaigns/draft',
  },

  // Contact Inquiries
  CONTACT: {
    BASE: '/contact',
    BY_ID: (id: string) => `/contact/${id}`,
  },

  // Events Management
  EVENTS: {
    BASE: '/admin-dashboard/events',
    BY_ID: (id: string) => `/admin-dashboard/events/${id}`,
    STATISTICS: '/admin-dashboard/events/statistics',
  },

  // Awards Management
  AWARDS: {
    CATEGORIES: {
      BASE: '/admin-dashboard/awards/categories',
      BY_ID: (id: string) => `/admin-dashboard/awards/categories/${id}`,
    },
    NOMINEES: {
      BASE: '/admin-dashboard/awards/nominees',
      BY_ID: (id: string) => `/admin-dashboard/awards/nominees/${id}`,
    },
    CEREMONIES: {
      BASE: '/admin-dashboard/awards/ceremonies',
      BY_ID: (id: string) => `/admin-dashboard/awards/ceremonies/${id}`,
    },
    GUESTS: {
      BASE: '/admin-dashboard/awards/guests',
      BY_ID: (id: string) => `/admin-dashboard/awards/guests/${id}`,
    },
    STATISTICS: '/admin-dashboard/awards/statistics',
  },
} as const;
