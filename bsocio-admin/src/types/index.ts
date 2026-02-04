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

export type UserRole = 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'COMMUNICATIONS_ADMIN' | 'ANALYTICS_VIEWER' | 'USER';

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
// Admin Activity Types
// ============================================

export type AdminActivityType =
  | 'USER_LOGIN'
  | 'FAQ_CREATED'
  | 'FAQ_UPDATED'
  | 'FAQ_ARCHIVED'
  | 'NEWS_CREATED'
  | 'NEWS_UPDATED'
  | 'NEWS_ARCHIVED'
  | 'LEGAL_CREATED'
  | 'LEGAL_UPDATED'
  | 'SYSTEM';

export interface AdminActivity {
  id: string;
  type: AdminActivityType;
  title: string;
  message?: string;
  adminEmail: string;
  adminName: string;
  createdAt: string;
}

export interface AdminActivityRequest {
  skip?: number;
  take?: number;
  filter?: '24h' | 'week' | 'month';
  type?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminActivityResponse {
  activities: AdminActivity[];
  total: number;
}

// ============================================
// Admin Users Types
// ============================================

export type AdminRoleKey = 'SUPER_ADMIN' | 'CONTENT_ADMIN' | 'COMMUNICATIONS_ADMIN' | 'ANALYTICS_VIEWER';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  roleKey: AdminRoleKey;
  permissions: string[];
  lastLogin: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface AdminUserRequest {
  role?: string;
  status?: 'active' | 'inactive' | 'all';
  search?: string;
  skip?: number;
  take?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminUserResponse {
  items: AdminUser[];
  total: number;
  skip: number;
  take: number;
}

export interface AdminUserStats {
  total: number;
  superAdmins: number;
  contentAdmins: number;
  communicationsAdmins: number;
  analyticsViewers: number;
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

export type LegalDocumentType = 'TERMS_OF_USE' | 'PRIVACY_POLICY';
export type LegalDocumentState = 'DRAFT' | 'PUBLISHED';

export interface LegalDocument {
  id: string;
  type: LegalDocumentType;
  title: string;
  content: string;
  versionNotes?: string;
  effectiveDate: string;
  state: LegalDocumentState;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateLegalDocumentRequest {
  title: string;
  content: string;
  versionNotes?: string;
  effectiveDate: string;
  state: LegalDocumentState;
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

// ============================================
// News & Media Types
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

export interface CreateNewsRequest {
  title: string;
  author: string;
  category: NewsCategory;
  excerpt: string;
  content: string;
  featuredImage: string;
  publicationDate: string;
  tags?: string[];
  status: NewsStatus;
}

export interface UpdateNewsRequest {
  title?: string;
  author?: string;
  category?: NewsCategory;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  publicationDate?: string;
  tags?: string[];
  status?: NewsStatus;
}

export interface NewsFilters {
  status?: NewsStatus;
  category?: NewsCategory;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  skip?: number;
  take?: number;
}

// ============================================
// Image Upload Types
// ============================================

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  status: number;
  data: {
    key: string;
    url: string;
    mimetype: string;
    originalname: string;
  };
}

// ============================================
// Email Campaign Types
// ============================================

export type EmailAudience = 'ALL_USERS' | 'SEGMENTED_USERS';
export type EmailSendType = 'NOW' | 'SCHEDULED';
export type EmailCampaignStatus = 'DRAFT' | 'SCHEDULED' | 'SENT';

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  audience: EmailAudience;
  sendType: EmailSendType;
  scheduledAt: string | null;
  status: EmailCampaignStatus;
  totalSent: number;
  delivered: number;
  openRate: number;
  clickRate: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmailCampaignRequest {
  name: string;
  subject: string;
  content: string;
  audience: EmailAudience;
  sendType: EmailSendType;
  scheduledAt?: string;
}

export interface EmailCampaignFilters {
  status?: EmailCampaignStatus;
}

// ============================================
// Contact Inquiry Types
// ============================================

export type ContactReason = 'MEDIA_PRESS' | 'PARTNERSHIPS' | 'REPORT_SCAM' | 'GENERAL_INQUIRY';
export type ContactStatus = 'NEW' | 'IN_PROGRESS' | 'RESOLVED';

export interface ContactInquiry {
  id: string;
  reason: ContactReason;
  fullName: string;
  email: string;
  phone?: string;
  country: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ContactInquiryFilters {
  status?: ContactStatus;
  reason?: ContactReason;
  skip?: number;
  take?: number;
}

export interface ContactInquiryListResponse {
  items: ContactInquiry[];
  total: number;
  skip: number;
  take: number;
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

export interface CreateEventRequest {
  title: string;
  eventDate: string;
  eventTime?: string;
  venue: string;
  maxAttendees?: number;
  imageUrl?: string;
  description?: string;
  status?: EventStatus;
  visibility?: EventVisibility;
}

export interface UpdateEventRequest {
  title?: string;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  maxAttendees?: number;
  imageUrl?: string;
  description?: string;
  status?: EventStatus;
  visibility?: EventVisibility;
}

export interface EventFilters {
  filter?: 'upcoming' | 'past' | 'all';
  status?: EventStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  skip?: number;
  take?: number;
  search?: string;
}

export interface EventStatistics {
  upcomingEvents: number;
  pastEvents: number;
  totalAttendees: number;
}

// ============================================
// Award Category Types
// ============================================

export type AwardCategoryStatus = 'ACTIVE' | 'INACTIVE';

export interface AwardCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status: AwardCategoryStatus;
  createdAt: string;
  updatedAt: string;
  _count?: {
    nominees: number;
  };
  nominees?: Nominee[];
}

export interface CreateAwardCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  status?: AwardCategoryStatus;
}

export interface UpdateAwardCategoryRequest {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  status?: AwardCategoryStatus;
}

export interface AwardCategoryFilters {
  status?: AwardCategoryStatus;
  skip?: number;
  take?: number;
  search?: string;
}

// ============================================
// Nominee Types
// ============================================

export type NomineeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Nominee {
  id: string;
  name: string;
  title?: string;
  organization?: string;
  categoryId: string;
  imageUrl?: string;
  about?: string;
  keyAchievements: string[];
  impactStory?: string;
  quote?: string;
  status: NomineeStatus;
  isWinner: boolean;
  createdAt: string;
  updatedAt: string;
  category?: AwardCategory;
}

export interface CreateNomineeRequest {
  name: string;
  title?: string;
  organization?: string;
  categoryId: string;
  imageUrl?: string;
  about?: string;
  keyAchievements?: string[];
  impactStory?: string;
  quote?: string;
  status?: NomineeStatus;
  isWinner?: boolean;
}

export interface UpdateNomineeRequest {
  name?: string;
  title?: string;
  organization?: string;
  categoryId?: string;
  imageUrl?: string;
  about?: string;
  keyAchievements?: string[];
  impactStory?: string;
  quote?: string;
  status?: NomineeStatus;
  isWinner?: boolean;
}

export interface NomineeFilters {
  categoryId?: string;
  status?: NomineeStatus;
  isWinner?: boolean;
  skip?: number;
  take?: number;
  search?: string;
}

// ============================================
// Ceremony Types
// ============================================

export type CeremonyStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

export interface Ceremony {
  id: string;
  title: string;
  date: string;
  location: string;
  venue?: string;
  description?: string;
  imageUrl?: string;
  status: CeremonyStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCeremonyRequest {
  title: string;
  date: string;
  location: string;
  venue?: string;
  description?: string;
  imageUrl?: string;
  status?: CeremonyStatus;
}

export interface UpdateCeremonyRequest {
  title?: string;
  date?: string;
  location?: string;
  venue?: string;
  description?: string;
  imageUrl?: string;
  status?: CeremonyStatus;
}

export interface CeremonyFilters {
  status?: CeremonyStatus;
}

// ============================================
// Special Guest Types
// ============================================

export type SpecialGuestStatus = 'ACTIVE' | 'INACTIVE';

export interface SpecialGuest {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  imageUrl?: string;
  status: SpecialGuestStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSpecialGuestRequest {
  name: string;
  title?: string;
  bio?: string;
  imageUrl?: string;
  status?: SpecialGuestStatus;
}

export interface UpdateSpecialGuestRequest {
  name?: string;
  title?: string;
  bio?: string;
  imageUrl?: string;
  status?: SpecialGuestStatus;
}

export interface SpecialGuestFilters {
  status?: SpecialGuestStatus;
  skip?: number;
  take?: number;
  search?: string;
}

// ============================================
// Awards Statistics
// ============================================

export interface AwardsStatistics {
  totalCategories: number;
  totalNominees: number;
  activeAwards: number;
  upcomingCeremonies: number;
}

