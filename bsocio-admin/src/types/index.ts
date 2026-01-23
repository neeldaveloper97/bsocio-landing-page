/**
 * ============================================
 * BSOCIO ADMIN - Type Definitions
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
  items: T[];
  total: number;
  skip: number;
  take: number;
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

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * User data returned in login response (simplified)
 */
export interface LoginUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  success: boolean;
  user: LoginUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user?: LoginUser;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// ============================================
// Dashboard Overview Types
// ============================================

export interface DashboardOverviewRequest {
  tzOffsetMinutes?: number;
  activityTake?: number;
}

export interface RecentActivity {
  id: string;
  userId: string;
  email: string;
  actionType: string;
  createdAt: string;
}

export interface BirthdayUser {
  id: string;
  email: string;
  dob: string;
  profile?: UserProfile;
}

export interface DashboardMetrics {
  totalSignUps: number;
  newSignUpsToday: number;
  monthlySignUps: number;
  usersWithBirthdaysThisMonth: number;
}

export interface DashboardActivity {
  type: string;
  title: string;
  message?: string;
  createdAt: string;
}

export interface DashboardOverviewResponse {
  metrics: DashboardMetrics;
  recentActivity: DashboardActivity[];
}

// ============================================
// Analytics Types
// ============================================

export interface AnalyticsRequest {
  year?: number;
  month?: number;
}

export interface SignupTrendItem {
  date: string;
  count: number;
}

export interface MonthlySignupItem {
  month: string;
  value: number;
}

export interface BirthdayCalendarItem {
  dayName: string;
  count: number;
}

export interface AnalyticsOverviewResponse {
  signups: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    lastMonth: number;
    growthPercent: number;
    monthlyTotal: number;
    monthlyPeriod: string;
  };
  signupTrend: SignupTrendItem[];
  monthlySignups: MonthlySignupItem[];
  birthdays: {
    totalThisMonth: number;
    calendar: BirthdayCalendarItem[];
  };
}

// ============================================
// FAQ Types
// ============================================

export type FAQCategory = 'GENERAL' | 'REWARDS' | 'GETTING_STARTED' | 'IMPACT';
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
  createdAt: string;
  updatedAt: string;
}

export interface CreateFAQRequest {
  question: string;
  answer: string;
  category: FAQCategory;
  state: FAQState;
  status: FAQStatus;
  visibility: FAQVisibility;
  sortOrder: number;
}

export interface UpdateFAQRequest {
  question?: string;
  answer?: string;
  category?: FAQCategory;
  state?: FAQState;
  status?: FAQStatus;
  visibility?: FAQVisibility;
  sortOrder?: number;
}

export interface FAQFilters {
  page?: number;
  limit?: number;
  category?: FAQCategory;
  state?: FAQState;
  status?: FAQStatus;
  visibility?: FAQVisibility;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ReorderFAQRequest {
  reorderedIds: string[];
}

// ============================================
// Legal Document Types
// ============================================

export type LegalDocumentType = 'TERMS' | 'PRIVACY';

export interface LegalDocument {
  id: string;
  type: LegalDocumentType;
  title: string;
  content: string;
  version: string;
  effectiveDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLegalDocumentRequest {
  title?: string;
  content?: string;
  version?: string;
  effectiveDate?: string;
  isActive?: boolean;
}

// ============================================
// Users Management Types
// ============================================

export interface UserFilters {
  page?: number;
  limit?: number;
  role?: UserRole;
  isActive?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateUserRequest {
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
}
