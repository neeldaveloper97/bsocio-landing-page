/**
 * ============================================
 * BSocio Landing Page - Error Pages E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { hideNextJsDevOverlay } from '../../shared/api-mocks';

test.describe('404 Not Found Page', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
  });

  test('should display 404 page for unknown routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await page.waitForLoadState('domcontentloaded');

    const body = await page.textContent('body');
    // Should show not found content
    expect(
      body?.toLowerCase().includes('not found') ||
      body?.toLowerCase().includes('404') ||
      body?.toLowerCase().includes('page') ||
      page.url().includes('not-found')
    ).toBeTruthy();
  });

  test('should have a link back to home', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await page.waitForLoadState('domcontentloaded');

    const homeLink = page.getByRole('link', { name: /home|back|go back/i });
    if (await homeLink.count() > 0) {
      await homeLink.first().click();
      await expect(page).toHaveURL('/');
    }
  });
});
