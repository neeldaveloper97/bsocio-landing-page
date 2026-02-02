/**
 * ============================================
 * BSOCIO - API Types & Interfaces
 * ============================================
 * Type definitions for API requests and responses
 */

// ============================================
// Common Types
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  statusCode: number;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
  timestamp?: string;
  path?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// ============================================
// User & Auth Types
// ============================================

export type UserRole = 'USER' | 'ADMIN' | 'MODERATOR';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  dob: string;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  profile?: UserProfile;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

// ============================================
// Auth Request/Response Types
// ============================================

export type Gender = 'MALE' | 'FEMALE' | 'NON_BINARY' | 'PREFER_NOT_TO_SAY';

export interface SignupRequest {
  email: string;
  password?: string;
  role: UserRole;
  dob: string; // Format: YYYY-MM-DD
  isTermsAccepted: boolean;
  gender?: Gender;
}

export interface SignupResponse {
  user: User;
  message: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

// ============================================
// Form Validation Types
// ============================================

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  dob: Date | null;
  isTermsAccepted: boolean;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// ============================================
// FAQ Types
// ============================================

export type FAQCategory = 'GENERAL' | 'TECHNICAL' | 'BILLING' | 'OTHER';
export type FAQState = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type FAQStatus = 'ACTIVE' | 'INACTIVE';
export type FAQVisibility = 'PUBLIC' | 'PRIVATE';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  state: FAQState;
  status: FAQStatus;
  visibility: FAQVisibility;
  sortOrder: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface FAQResponse {
  items: FAQ[];
  total: number;
  skip: number;
  take: number;
}

// ============================================
// Legal Types
// ============================================

export type LegalType = 'PRIVACY_POLICY' | 'TERMS_OF_USE';

export interface LegalContent {
  id: string;
  type: LegalType;
  title: string;
  content: string;
  versionNotes: string;
  effectiveDate: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// News Types
// ============================================

export type NewsCategory = 
  | 'PRESS_RELEASE'
  | 'MEDIA_COVERAGE'
  | 'ANNOUNCEMENT'
  | 'IMPACT_STORY'
  | 'PARTNERSHIP';

export type NewsStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface NewsArticle {
  id: string;
  title: string;
  author: string;
  category: NewsCategory;
  excerpt: string;
  content: string;
  featuredImage: string;
  publicationDate: string;
  tags: string[];
  status: NewsStatus;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// Event Types
// ============================================

export type EventStatus = 'DRAFT' | 'PUBLISHED';
export type EventVisibility = 'PUBLIC' | 'PRIVATE';
export type EventState = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface Event {
  id: string;
  title: string;
  eventDate: string;
  eventTime?: string;
  venue: string;
  maxAttendees?: number;
  currentAttendees: number;
  imageUrl?: string;
  description?: string;
  status: EventStatus;
  visibility: EventVisibility;
  state: EventState;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  filter?: 'upcoming' | 'past' | 'all';
  status?: EventStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface EventStatistics {
  upcomingEvents: number;
  pastEvents: number;
  totalAttendees: number;
}
