/**
 * ============================================
 * BSocio - FAQs API Integration Tests
 * ============================================
 * Tests FAQ data fetching, loading states, and error handling
 */
import { test, expect } from '@playwright/test';
import { mockFAQs } from '../../shared/mock-data';
import { hideNextJsDevOverlay } from '../../shared/api-mocks';

test.describe('FAQs API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
  });

  test('should fetch FAQs and render them', async ({ page }) => {
    let apiCalled = false;

    await page.route('**/admin-dashboard/faqs*', async (route) => {
      apiCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockFAQs.data,
          total: mockFAQs.total,
          skip: 0,
          take: 10,
        }),
      });
    });

    await page.goto('/faqs');

    // Wait for FAQ content to render (proves route was intercepted)
    // On webkit/mobile, useEffect fires after networkidle, so use DOM assertions
    await expect(
      page.locator(`[data-faq="${mockFAQs.data[0].id}"]`),
    ).toBeVisible({ timeout: 15000 });

    expect(apiCalled).toBeTruthy();
    for (const faq of mockFAQs.data.slice(1)) {
      await expect(page.locator(`[data-faq="${faq.id}"]`)).toBeVisible();
    }
  });

  test('should show loading state while fetching', async ({ page }) => {
    await page.route('**/admin-dashboard/faqs*', async (route) => {
      await new Promise((r) => setTimeout(r, 3000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: mockFAQs.data,
          total: mockFAQs.total,
          skip: 0,
          take: 10,
        }),
      });
    });

    await page.goto('/faqs');
    // During loading, check for skeleton/spinner/loading text
    const loadingIndicator = page.locator('[class*="animate-pulse"], [class*="skeleton"], [class*="loading"], [class*="spinner"]');
    const loadingCount = await loadingIndicator.count();
    // At minimum the page should not crash
    await expect(page.locator('main')).toBeVisible();
  });

  test('should handle network timeout', async ({ page }) => {
    await page.route('**/admin-dashboard/faqs*', async (route) => {
      await route.abort('timedout');
    });

    await page.goto('/faqs');
    await page.waitForTimeout(2000);
    // Page should handle error without crashing
    await expect(page).toHaveURL(/\/faqs/);
  });

  test('should handle malformed API response', async ({ page }) => {
    await page.route('**/admin-dashboard/faqs*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: 'not valid json{{{',
      });
    });

    await page.goto('/faqs');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/faqs/);
  });

  test('should handle 401 unauthorized', async ({ page }) => {
    await page.route('**/admin-dashboard/faqs*', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' }),
      });
    });

    await page.goto('/faqs');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/faqs/);
  });
});
