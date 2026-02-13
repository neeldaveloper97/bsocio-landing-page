/**
 * ============================================
 * Shared Test Fixtures & Custom Extensions
 * ============================================
 */
import { test as base, expect, type Page, type BrowserContext } from '@playwright/test';

// ── API Mock Helper ──────────────────────────────────

export interface MockApiOptions {
  status?: number;
  body?: unknown;
  headers?: Record<string, string>;
  delay?: number;
}

/**
 * Extended test with API mocking capabilities
 */
export const test = base.extend<{
  mockApi: (urlPattern: string | RegExp, response: MockApiOptions) => Promise<void>;
  mockApiError: (urlPattern: string | RegExp, status?: number, message?: string) => Promise<void>;
  apiBaseUrl: string;
}>({
  apiBaseUrl: [process.env.API_BASE_URL || 'http://localhost:7000', { option: true }],

  mockApi: async ({ page }, use) => {
    const mocks: Array<() => Promise<void>> = [];

    const mockApi = async (urlPattern: string | RegExp, options: MockApiOptions = {}) => {
      const { status = 200, body = {}, headers = {}, delay = 0 } = options;

      await page.route(urlPattern, async (route) => {
        if (delay) await new Promise((r) => setTimeout(r, delay));
        await route.fulfill({
          status,
          contentType: 'application/json',
          headers: { 'Access-Control-Allow-Origin': '*', ...headers },
          body: JSON.stringify(body),
        });
      });
    };

    await use(mockApi);
  },

  mockApiError: async ({ page }, use) => {
    const mockApiError = async (
      urlPattern: string | RegExp,
      status: number = 500,
      message: string = 'Internal Server Error'
    ) => {
      await page.route(urlPattern, async (route) => {
        await route.fulfill({
          status,
          contentType: 'application/json',
          body: JSON.stringify({ message, statusCode: status }),
        });
      });
    };

    await use(mockApiError);
  },
});

export { expect };

// ── Page Helpers ─────────────────────────────────────

/**
 * Wait for page to be fully loaded (network idle + DOM content)
 */
export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForLoadState('domcontentloaded');
}

/**
 * Wait for API response on a specific URL pattern
 */
export async function waitForApiResponse(page: Page, urlPattern: string | RegExp) {
  return page.waitForResponse((response) => {
    const url = response.url();
    if (typeof urlPattern === 'string') return url.includes(urlPattern);
    return urlPattern.test(url);
  });
}

/**
 * Get all visible text content of the page
 */
export async function getPageText(page: Page): Promise<string> {
  return page.evaluate(() => document.body.innerText);
}

/**
 * Check if an element is visible within viewport
 */
export async function isInViewport(page: Page, selector: string): Promise<boolean> {
  return page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= window.innerHeight &&
      rect.right <= window.innerWidth
    );
  }, selector);
}

/**
 * Scroll to an element and verify it's visible
 */
export async function scrollToElement(page: Page, selector: string) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await expect(page.locator(selector)).toBeVisible();
}

/**
 * Take a full-page screenshot and compare with baseline
 */
export async function snapshotFullPage(page: Page, name: string) {
  await expect(page).toHaveScreenshot(`${name}.png`, {
    fullPage: true,
    animations: 'disabled',
    mask: [page.locator('[data-testid="dynamic-content"]')],
  });
}
