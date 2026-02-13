/**
 * ============================================
 * API Route Mocking Helpers
 * ============================================
 * Intercept and mock API routes for both apps
 */
import { type Page, type Route } from '@playwright/test';
import * as mockData from './mock-data';

const API_BASE = process.env.API_BASE_URL || 'http://localhost:7000';

// ── Helper to build full URL pattern ─────────────────

function apiUrl(path: string): string {
  return `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;
}

function apiPattern(path: string): RegExp {
  const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`${API_BASE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/?${escaped}`);
}

// ── Hide Next.js Dev Overlay ─────────────────────────
// The <nextjs-portal> dev overlay intercepts pointer events on
// Radix Select dropdowns in mobile/webkit browsers, causing
// click timeouts. This injects CSS before page load to disable it.

export async function hideNextJsDevOverlay(page: Page) {
  await page.addInitScript(() => {
    const hide = () => {
      const style = document.createElement('style');
      style.setAttribute('data-pw-overlay-fix', '');
      style.textContent = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
      (document.head || document.documentElement).appendChild(style);
    };
    if (document.head) hide();
    else document.addEventListener('DOMContentLoaded', hide);
  });
}

// ── BSocio Landing Page Mocks ────────────────────────

export async function mockBsocioPublicApis(page: Page) {
  await hideNextJsDevOverlay(page);
  // FAQs — API returns { items, total, skip, take }
  await page.route(`**/admin-dashboard/faqs*`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: mockData.mockFAQs.data,
        total: mockData.mockFAQs.total,
        skip: 0,
        take: 10,
      }),
    });
  });

  // Legal - Privacy Policy
  await page.route('**/admin-dashboard/legal/PRIVACY_POLICY*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockPrivacyPolicy),
    });
  });

  // Legal - Terms of Use
  await page.route('**/admin-dashboard/legal/TERMS_OF_USE*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockTermsOfUse),
    });
  });

  // News — API returns { items, total, skip, take }
  await page.route('**/admin-dashboard/news**', async (route) => {
    const url = route.request().url();
    if (url.match(/\/news\/[a-zA-Z0-9-]+(\?|$)/)) {
      // Single article by ID/slug
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockSingleArticle),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockData.mockNewsArticles.data,
          total: mockData.mockNewsArticles.total,
          skip: 0,
          take: 10,
        }),
      });
    }
  });

  // Events
  await page.route('**/admin-dashboard/events/statistics*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockEventStatistics),
    });
  });

  // Events — list returns { items, total, skip, take }
  await page.route('**/admin-dashboard/events**', async (route) => {
    const url = route.request().url();
    // Let the dedicated statistics handler handle statistics URLs
    if (url.includes('/events/statistics')) {
      await route.fallback();
      return;
    }
    if (url.match(/\/events\/[a-zA-Z0-9-]+(\?|$)/)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockEvents.data[0]),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockData.mockEvents.data,
          total: mockData.mockEvents.total,
          skip: 0,
          take: 10,
        }),
      });
    }
  });

  // Awards — all list endpoints return { items, total, skip, take }
  await page.route('**/admin-dashboard/awards/categories*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        items: mockData.mockAwardCategories.data,
        total: mockData.mockAwardCategories.total,
        skip: 0,
        take: 10,
      }),
    });
  });

  await page.route('**/admin-dashboard/awards/nominees**', async (route) => {
    const url = route.request().url();
    if (url.match(/\/nominees\/[a-zA-Z0-9-]+(\?|$)/)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockNominees.data[0]),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockData.mockNominees.data,
          total: mockData.mockNominees.total,
          skip: 0,
          take: 10,
        }),
      });
    }
  });

  await page.route('**/admin-dashboard/awards/guests**', async (route) => {
    const url = route.request().url();
    if (url.match(/\/guests\/[a-zA-Z0-9-]+(\?|$)/)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockSpecialGuests.data[0]),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockData.mockSpecialGuests.data,
          total: mockData.mockSpecialGuests.total,
          skip: 0,
          take: 10,
        }),
      });
    }
  });

  await page.route('**/admin-dashboard/awards/statistics*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockAwardStatistics),
    });
  });

  // Subscribe
  await page.route('**/subscribe*', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockSubscribeResponse),
      });
    } else {
      await route.continue();
    }
  });

  // Contact
  await page.route('**/contact*', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockContactResponse),
      });
    } else {
      await route.continue();
    }
  });

  // Auth - Signup
  await page.route('**/users', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockSignupResponse),
      });
    } else {
      await route.continue();
    }
  });

  // Auth - Login
  await page.route('**/auth/login*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockLoginResponse),
    });
  });
}

// ── BSocio Admin Mocks ───────────────────────────────

export async function mockAdminApis(page: Page) {
  await hideNextJsDevOverlay(page);

  // Auth
  await page.route('**/auth/login*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockLoginResponse),
    });
  });

  await page.route('**/auth/me*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockAdminUser),
    });
  });

  await page.route('**/auth/refresh*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        accessToken: 'refreshed-mock-access-token',
        refreshToken: 'refreshed-mock-refresh-token',
      }),
    });
  });

  // Dashboard
  await page.route('**/admin-dashboard/overview*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockDashboardOverview),
    });
  });

  // Analytics
  await page.route('**/admin-dashboard/analytics/overview*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockAnalytics),
    });
  });

  // Activity
  await page.route('**/admin-dashboard/activity/stats*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ totalLogs: 150, uniqueAdmins: 5 }),
    });
  });

  // Activity — hook expects { activities, total }
  await page.route('**/admin-dashboard/activity*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        activities: mockData.mockAdminActivity.data,
        total: mockData.mockAdminActivity.total,
      }),
    });
  });

  // News — admin list returns { items, total, skip, take }
  await page.route('**/admin-dashboard/news**', async (route) => {
    const url = route.request().url();
    const method = route.request().method();
    if (method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockNewsArticles.data[0]),
      });
    } else if (method === 'PUT' || method === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockNewsArticles.data[0]),
      });
    } else if (method === 'DELETE') {
      await route.fulfill({ status: 204, body: '' });
    } else if (url.match(/\/news\/[a-zA-Z0-9-]+/)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockNewsArticles.data[0]),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockData.mockNewsArticles.data,
          total: mockData.mockNewsArticles.total,
          skip: 0,
          take: 10,
        }),
      });
    }
  });

  // Events
  await page.route('**/admin-dashboard/events/statistics*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockEventStatistics),
    });
  });

  // Events — admin list returns { items, total, skip, take }
  await page.route('**/admin-dashboard/events*', async (route) => {
    const method = route.request().method();
    const url = route.request().url();
    if (method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockEvents.data[0]),
      });
    } else if (method === 'PUT' || method === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockEvents.data[0]),
      });
    } else if (method === 'DELETE') {
      await route.fulfill({ status: 204, body: '' });
    } else if (url.match(/\/events\/[a-zA-Z0-9-]+/) && !url.includes('statistics')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockEvents.data[0]),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockData.mockEvents.data,
          total: mockData.mockEvents.total,
          skip: 0,
          take: 10,
        }),
      });
    }
  });

  // FAQs
  await page.route('**/admin-dashboard/faqs/reorder*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Reordered successfully' }),
    });
  });

  // FAQs — admin list returns { items, total, skip, take }
  await page.route('**/admin-dashboard/faqs*', async (route) => {
    const method = route.request().method();
    const url = route.request().url();
    if (method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockFAQs.data[0]),
      });
    } else if (method === 'PUT' || method === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockFAQs.data[0]),
      });
    } else if (method === 'DELETE') {
      await route.fulfill({ status: 204, body: '' });
    } else if (url.match(/\/faqs\/[a-zA-Z0-9-]+$/)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockFAQs.data[0]),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockData.mockFAQs.data,
          total: mockData.mockFAQs.total,
          skip: 0,
          take: 10,
        }),
      });
    }
  });

  // Legal
  await page.route('**/admin-dashboard/legal/*', async (route) => {
    const url = route.request().url();
    const method = route.request().method();
    if (method === 'PUT' || method === 'PATCH') {
      const body = url.includes('PRIVACY')
        ? mockData.mockPrivacyPolicy
        : mockData.mockTermsOfUse;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    } else {
      const body = url.includes('PRIVACY')
        ? mockData.mockPrivacyPolicy
        : mockData.mockTermsOfUse;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    }
  });

  // Awards - Categories, Nominees, Guests — admin list returns { items, total, skip, take }
  await page.route('**/admin-dashboard/awards/statistics*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockAwardStatistics),
    });
  });

  await page.route('**/admin-dashboard/awards/categories*', async (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockAwardCategories.data[0]),
      });
    } else if (method === 'PUT' || method === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockAwardCategories.data[0]),
      });
    } else if (method === 'DELETE') {
      await route.fulfill({ status: 204, body: '' });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockData.mockAwardCategories.data,
          total: mockData.mockAwardCategories.total,
          skip: 0,
          take: 10,
        }),
      });
    }
  });

  await page.route('**/admin-dashboard/awards/nominees*', async (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockNominees.data[0]),
      });
    } else if (method === 'PUT' || method === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockNominees.data[0]),
      });
    } else if (method === 'DELETE') {
      await route.fulfill({ status: 204, body: '' });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockData.mockNominees.data,
          total: mockData.mockNominees.total,
          skip: 0,
          take: 10,
        }),
      });
    }
  });

  await page.route('**/admin-dashboard/awards/guests*', async (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockSpecialGuests.data[0]),
      });
    } else if (method === 'PUT' || method === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockSpecialGuests.data[0]),
      });
    } else if (method === 'DELETE') {
      await route.fulfill({ status: 204, body: '' });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockData.mockSpecialGuests.data,
          total: mockData.mockSpecialGuests.total,
          skip: 0,
          take: 10,
        }),
      });
    }
  });

  // Campaigns — hook expects EmailCampaign[] (plain array)
  await page.route('**/admin-dashboard/campaigns/send*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Campaign sent successfully', recipientCount: 850 }),
    });
  });

  await page.route('**/admin-dashboard/campaigns/draft*', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockCampaigns.data[1]),
    });
  });

  await page.route('**/admin-dashboard/campaigns*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockData.mockCampaigns.data),
    });
  });

  // Contacts — hook expects { items, total, skip, take }
  await page.route('**/contact*', async (route) => {
    const url = route.request().url();
    if (url.match(/\/contact\/[a-zA-Z0-9-]+$/)) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockContacts.data[0]),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockData.mockContacts.data,
          total: mockData.mockContacts.total,
          skip: 0,
          take: 10,
        }),
      });
    }
  });

  // Admin Users — returns { items, total, skip, take }
  await page.route('**/admin/users/stats*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ totalAdmins: 5, activeAdmins: 4, inactiveAdmins: 1 }),
    });
  });

  await page.route('**/admin/users/export*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'text/csv',
      body: 'email,firstName,lastName,role\nadmin@bsocio.com,Super,Admin,SUPER_ADMIN',
    });
  });

  await page.route('**/admin/users*', async (route) => {
    const method = route.request().method();
    if (method === 'PUT' || method === 'PATCH') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockData.mockAdminUsers.data[0]),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: mockData.mockAdminUsers.data,
          meta: {
            total: mockData.mockAdminUsers.total,
            page: 1,
            limit: 10,
            totalPages: 1,
          },
        }),
      });
    }
  });

  // Images
  await page.route('**/images*', async (route) => {
    const method = route.request().method();
    if (method === 'POST') {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ url: 'https://via.placeholder.com/800x400' }),
      });
    } else if (method === 'DELETE') {
      await route.fulfill({ status: 204, body: '' });
    } else {
      await route.continue();
    }
  });
}
