/**
 * ============================================
 * API Mock Data for BSocio Tests
 * ============================================
 * Centralized mock responses for all API endpoints
 */

// ── FAQs ─────────────────────────────────────────────

export const mockFAQs = {
  data: [
    {
      id: 'faq-1',
      question: 'What is BSocio?',
      answer: 'BSocio is a community platform for social good.',
      category: 'GENERAL' as const,
      state: 'PUBLISHED' as const,
      status: 'ACTIVE' as const,
      visibility: 'PUBLIC' as const,
      sortOrder: 1,
      views: 10,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: 'faq-2',
      question: 'How do I sign up?',
      answer: 'Click the Sign Up button and fill in your details.',
      category: 'GENERAL' as const,
      state: 'PUBLISHED' as const,
      status: 'ACTIVE' as const,
      visibility: 'PUBLIC' as const,
      sortOrder: 2,
      views: 5,
      createdAt: '2025-01-02T00:00:00.000Z',
      updatedAt: '2025-01-02T00:00:00.000Z',
    },
    {
      id: 'faq-3',
      question: 'Is BSocio free to use?',
      answer: 'Yes, BSocio is completely free for individuals.',
      category: 'GENERAL' as const,
      state: 'PUBLISHED' as const,
      status: 'ACTIVE' as const,
      visibility: 'PUBLIC' as const,
      sortOrder: 3,
      views: 8,
      createdAt: '2025-01-03T00:00:00.000Z',
      updatedAt: '2025-01-03T00:00:00.000Z',
    },
  ],
  total: 3,
  page: 1,
  pageSize: 10,
};

// ── Legal Content ────────────────────────────────────

export const mockPrivacyPolicy = {
  id: 'legal-1',
  type: 'PRIVACY_POLICY',
  title: 'Privacy Policy',
  content: '# Privacy Policy\n\nThis is the privacy policy content.\n\n## Data Collection\n\nWe collect minimal data.',
  versionNotes: 'Initial version',
  effectiveDate: '2025-01-01T00:00:00.000Z',
  state: 'PUBLISHED',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-15T00:00:00.000Z',
};

export const mockTermsOfUse = {
  id: 'legal-2',
  type: 'TERMS_OF_USE',
  title: 'Terms of Use',
  content: '# Terms of Use\n\nBy using BSocio, you agree to these terms.\n\n## User Conduct\n\nBe respectful.',
  versionNotes: 'Initial version',
  effectiveDate: '2025-01-01T00:00:00.000Z',
  state: 'PUBLISHED',
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-15T00:00:00.000Z',
};

// ── News & Media ─────────────────────────────────────

export const mockNewsArticles = {
  data: [
    {
      id: 'news-1',
      title: 'BSocio Launches New Initiative',
      slug: 'bsocio-launches-new-initiative',
      excerpt: 'BSocio announces a groundbreaking community initiative.',
      content: '<p>Full article content here with details about the initiative.</p>',
      category: 'ANNOUNCEMENT',
      featuredImage: 'https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/test/placeholder.png',
      author: 'BSocio Team',
      status: 'PUBLISHED',
      publicationDate: '2025-12-01T00:00:00.000Z',
      tags: ['initiative', 'community'],
      views: 150,
      createdAt: '2025-12-01T00:00:00.000Z',
      updatedAt: '2025-12-01T00:00:00.000Z',
    },
    {
      id: 'news-2',
      title: 'Community Impact Report 2025',
      slug: 'community-impact-report-2025',
      excerpt: 'Annual impact report highlights key achievements.',
      content: '<p>Detailed report on our community impact.</p>',
      category: 'IMPACT_STORY',
      featuredImage: 'https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/test/placeholder.png',
      author: 'BSocio Research',
      status: 'PUBLISHED',
      publicationDate: '2025-11-15T00:00:00.000Z',
      tags: ['impact', 'report'],
      views: 280,
      createdAt: '2025-11-15T00:00:00.000Z',
      updatedAt: '2025-11-15T00:00:00.000Z',
    },
    {
      id: 'news-3',
      title: 'Upcoming Festival Announcement',
      slug: 'upcoming-festival-announcement',
      excerpt: 'Mark your calendars for the biggest BSocio festival.',
      content: '<p>Festival details and lineup information.</p>',
      category: 'ANNOUNCEMENT',
      featuredImage: 'https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/test/placeholder.png',
      author: 'Events Team',
      status: 'PUBLISHED',
      publicationDate: '2025-10-20T00:00:00.000Z',
      tags: ['festival', 'events'],
      views: 420,
      createdAt: '2025-10-20T00:00:00.000Z',
      updatedAt: '2025-10-20T00:00:00.000Z',
    },
  ],
  total: 3,
  page: 1,
  pageSize: 10,
};

export const mockSingleArticle = mockNewsArticles.data[0];

export const mockRelatedArticles = {
  data: mockNewsArticles.data.slice(1),
};

// ── Events ───────────────────────────────────────────

export const mockEvents = {
  data: [
    {
      id: 'event-1',
      title: 'BSocio Annual Gala',
      description: 'Join us for our annual celebration event.',
      venue: 'Convention Center, Lagos',
      eventDate: '2026-03-15T18:00:00.000Z',
      eventTime: '18:00',
      maxAttendees: 500,
      currentAttendees: 120,
      imageUrl: 'https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/test/placeholder.png',
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      state: 'UPCOMING' as const,
      createdAt: '2025-12-01T00:00:00.000Z',
      updatedAt: '2025-12-01T00:00:00.000Z',
    },
    {
      id: 'event-2',
      title: 'Community Workshop',
      description: 'Interactive workshop on community building.',
      venue: 'BSocio HQ, Abuja',
      eventDate: '2026-02-20T10:00:00.000Z',
      eventTime: '10:00',
      maxAttendees: 100,
      currentAttendees: 45,
      imageUrl: 'https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/test/placeholder.png',
      status: 'PUBLISHED' as const,
      visibility: 'PUBLIC' as const,
      state: 'UPCOMING' as const,
      createdAt: '2025-11-20T00:00:00.000Z',
      updatedAt: '2025-11-20T00:00:00.000Z',
    },
  ],
  total: 2,
  page: 1,
  pageSize: 10,
};

export const mockEventStatistics = {
  totalEvents: 15,
  upcomingEvents: 5,
  pastEvents: 10,
  totalAttendees: 2500,
};

// ── Awards ───────────────────────────────────────────

export const mockAwardCategories = {
  data: [
    {
      id: 'cat-1',
      name: 'Community Leader',
      description: 'Recognizing outstanding community leadership.',
      icon: '🏆',
      color: '#FFD700',
      status: 'ACTIVE' as const,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: 'cat-2',
      name: 'Social Innovator',
      description: 'Celebrating social innovation.',
      icon: '💡',
      color: '#4CAF50',
      status: 'ACTIVE' as const,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  ],
  total: 2,
};

export const mockNominees = {
  data: [
    {
      id: 'nom-1',
      name: 'John Doe',
      title: 'Community Activist',
      organization: 'Social Good Foundation',
      about: 'An exemplary community leader.',
      keyAchievements: ['Led community development', 'Founded youth program'],
      impactStory: 'John has transformed the lives of hundreds of people.',
      quote: 'Together we can make a difference.',
      imageUrl: 'https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/test/placeholder.png',
      categoryId: 'cat-1',
      category: { id: 'cat-1', name: 'Community Leader', status: 'ACTIVE', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
      status: 'APPROVED' as const,
      isWinner: false,
      createdAt: '2025-06-01T00:00:00.000Z',
      updatedAt: '2025-06-01T00:00:00.000Z',
    },
    {
      id: 'nom-2',
      name: 'Jane Smith',
      title: 'Social Entrepreneur',
      organization: 'Innovation Hub',
      about: 'A pioneer in social innovation.',
      keyAchievements: ['Created social app', 'Raised $1M for charity'],
      impactStory: 'Jane built a platform that connects volunteers worldwide.',
      quote: 'Innovation is the key to change.',
      imageUrl: 'https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/test/placeholder.png',
      categoryId: 'cat-2',
      category: { id: 'cat-2', name: 'Social Innovator', status: 'ACTIVE', createdAt: '2025-01-01T00:00:00.000Z', updatedAt: '2025-01-01T00:00:00.000Z' },
      status: 'APPROVED' as const,
      isWinner: true,
      createdAt: '2025-06-15T00:00:00.000Z',
      updatedAt: '2025-06-15T00:00:00.000Z',
    },
  ],
  total: 2,
};

export const mockSpecialGuests = {
  data: [
    {
      id: 'guest-1',
      name: 'Prof. Adesina',
      title: 'Keynote Speaker',
      bio: 'Renowned professor and community advocate.',
      imageUrl: 'https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/test/placeholder.png',
      status: 'ACTIVE' as const,
      createdAt: '2025-07-01T00:00:00.000Z',
      updatedAt: '2025-07-01T00:00:00.000Z',
    },
  ],
  total: 1,
};

export const mockAwardStatistics = {
  totalCategories: 5,
  totalNominees: 25,
  activeAwards: 15,
  upcomingCeremonies: 3,
};

// ── Auth ─────────────────────────────────────────────

export const mockUser = {
  id: 'user-1',
  email: 'testuser@bsocio.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'USER',
  isEmailVerified: true,
  createdAt: '2025-01-01T00:00:00.000Z',
};

export const mockAdminUser = {
  id: 'admin-1',
  email: 'admin@bsocio.com',
  firstName: 'Admin',
  lastName: 'User',
  role: 'SUPER_ADMIN',
  isEmailVerified: true,
  createdAt: '2025-01-01T00:00:00.000Z',
};

export const mockLoginResponse = {
  accessToken: 'mock-access-token-jwt',
  refreshToken: 'mock-refresh-token-jwt',
  user: mockAdminUser,
};

export const mockSignupResponse = {
  message: 'Account created successfully. Please check your email to verify your account.',
  user: mockUser,
};

// ── Subscribe ────────────────────────────────────────

export const mockSubscribeResponse = {
  message: 'Successfully subscribed to the newsletter.',
};

// ── Contact ──────────────────────────────────────────

export const mockContactResponse = {
  message: 'Your message has been sent successfully.',
};

export const mockContacts = {
  data: [
    {
      id: 'contact-1',
      fullName: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+2348012345678',
      country: 'Nigeria',
      message: 'I would like to discuss a potential partnership.',
      reason: 'PARTNERSHIPS' as const,
      status: 'NEW' as const,
      createdAt: '2025-12-01T00:00:00.000Z',
      updatedAt: '2025-12-01T00:00:00.000Z',
    },
    {
      id: 'contact-2',
      fullName: 'Bob Williams',
      email: 'bob@example.com',
      phone: '+2348098765432',
      country: 'Ghana',
      message: 'Can you tell me more about BSocio?',
      reason: 'GENERAL_INQUIRY' as const,
      status: 'IN_PROGRESS' as const,
      createdAt: '2025-11-28T00:00:00.000Z',
      updatedAt: '2025-11-28T00:00:00.000Z',
    },
  ],
  total: 2,
  page: 1,
  pageSize: 10,
};

// ── Dashboard (Admin) ────────────────────────────────

export const mockDashboardOverview = {
  totalUsers: 1250,
  newUsersToday: 15,
  totalEvents: 25,
  upcomingEvents: 8,
  totalNews: 42,
  publishedNews: 38,
  totalContacts: 67,
  unreadContacts: 12,
  recentActivity: [
    {
      id: 'act-1',
      action: 'Created news article',
      user: 'Admin User',
      timestamp: '2026-02-09T10:30:00.000Z',
    },
    {
      id: 'act-2',
      action: 'Updated FAQ',
      user: 'Content Admin',
      timestamp: '2026-02-09T09:15:00.000Z',
    },
  ],
};

// ── Analytics (Admin) ────────────────────────────────

export const mockAnalytics = {
  signupMetrics: {
    total: 1250,
    thisMonth: 85,
    lastMonth: 92,
    growthRate: -7.6,
  },
  monthlyTrend: [
    { month: 'Jan', count: 75 },
    { month: 'Feb', count: 82 },
    { month: 'Mar', count: 91 },
    { month: 'Apr', count: 88 },
    { month: 'May', count: 95 },
    { month: 'Jun', count: 102 },
  ],
  birthdayCalendar: [
    { date: '2026-02-10', name: 'John Doe', email: 'john@bsocio.com' },
  ],
};

// ── Campaigns (Admin) ────────────────────────────────

export const mockCampaigns = {
  data: [
    {
      id: 'camp-1',
      subject: 'February Newsletter',
      content: '<p>Monthly newsletter content</p>',
      status: 'SENT',
      audienceType: 'ALL',
      sentAt: '2026-02-01T10:00:00.000Z',
      recipientCount: 850,
      createdAt: '2026-01-30T00:00:00.000Z',
    },
    {
      id: 'camp-2',
      subject: 'Event Reminder',
      content: '<p>Don\'t forget about the upcoming gala!</p>',
      status: 'DRAFT',
      audienceType: 'SUBSCRIBERS',
      sentAt: null,
      recipientCount: 0,
      createdAt: '2026-02-05T00:00:00.000Z',
    },
  ],
  total: 2,
  page: 1,
  pageSize: 10,
};

// ── Admin Users ──────────────────────────────────────

export const mockAdminUsers = {
  data: [
    {
      id: 'admin-1',
      email: 'admin@bsocio.com',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
      lastLoginAt: '2026-02-09T08:00:00.000Z',
      createdAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: 'admin-2',
      email: 'content@bsocio.com',
      firstName: 'Content',
      lastName: 'Manager',
      role: 'CONTENT_ADMIN',
      isActive: true,
      lastLoginAt: '2026-02-08T14:00:00.000Z',
      createdAt: '2025-03-15T00:00:00.000Z',
    },
  ],
  total: 2,
  page: 1,
  pageSize: 10,
};

export const mockAdminActivity = {
  data: [
    {
      id: 'act-1',
      type: 'USER_LOGIN' as const,
      title: 'Admin logged in',
      adminEmail: 'admin@bsocio.com',
      adminName: 'Super Admin',
      createdAt: '2026-02-09T08:00:00.000Z',
    },
    {
      id: 'act-2',
      type: 'NEWS_CREATED' as const,
      title: 'Created news article: BSocio Launch',
      adminEmail: 'content@bsocio.com',
      adminName: 'Content Manager',
      createdAt: '2026-02-09T09:30:00.000Z',
    },
  ],
  total: 2,
  page: 1,
  pageSize: 10,
};
