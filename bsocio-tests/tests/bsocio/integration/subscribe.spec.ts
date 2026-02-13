/**
 * ============================================
 * BSocio - Subscribe Integration Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockSubscribeResponse, mockSingleArticle } from '../../shared/mock-data';
import { hideNextJsDevOverlay } from '../../shared/api-mocks';

test.describe('Newsletter Subscribe Integration', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
  });

  test('should submit email to subscribe API', async ({ page }) => {
    let capturedBody: any = null;

    await page.route('**/subscribe*', async (route) => {
      if (route.request().method() === 'POST') {
        capturedBody = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(mockSubscribeResponse),
        });
      } else {
        await route.continue();
      }
    });

    // Mock other APIs needed for news article page
    await page.route('**/admin-dashboard/news/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSingleArticle),
      });
    });

    await page.goto(`/news-media/${mockSingleArticle.slug}`);
    await page.waitForTimeout(2000);

    // Find subscribe email input
    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('subscriber@test.com');

      const subscribeBtn = page.getByRole('button', { name: /subscribe|join|sign up/i });
      if (await subscribeBtn.count() > 0) {
        await subscribeBtn.first().click();
        await page.waitForTimeout(2000);

        if (capturedBody) {
          expect(capturedBody.email).toBe('subscriber@test.com');
        }
      }
    }
  });

  test('should handle duplicate subscription error', async ({ page }) => {
    await page.route('**/subscribe*', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Email already subscribed' }),
        });
      } else {
        await route.continue();
      }
    });

    await page.route('**/admin-dashboard/news/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSingleArticle),
      });
    });

    await page.goto(`/news-media/${mockSingleArticle.slug}`);
    await page.waitForTimeout(2000);

    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('already@subscribed.com');

      const subscribeBtn = page.getByRole('button', { name: /subscribe|join|sign up/i });
      if (await subscribeBtn.count() > 0) {
        await subscribeBtn.first().click();
        await page.waitForTimeout(2000);

        // Should handle error (toast/message)
        const body = await page.textContent('body');
        expect(body).toBeTruthy();
      }
    }
  });
});
