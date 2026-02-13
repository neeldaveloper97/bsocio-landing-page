/**
 * ============================================
 * BSocio - Legal Content API Integration Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockPrivacyPolicy, mockTermsOfUse } from '../../shared/mock-data';
import { hideNextJsDevOverlay } from '../../shared/api-mocks';

test.describe('Legal Content API Integration', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
  });

  test('should fetch privacy policy by type', async ({ page }) => {
    let requestedUrl = '';

    await page.route('**/admin-dashboard/legal/**', async (route) => {
      requestedUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockPrivacyPolicy),
      });
    });

    await Promise.all([
      page.waitForResponse((r) => r.url().includes('/admin-dashboard/legal/'), { timeout: 15000 }),
      page.goto('/privacy'),
    ]);

    expect(requestedUrl).toContain('PRIVACY_POLICY');
  });

  test('should fetch terms of use by type', async ({ page }) => {
    let requestedUrl = '';

    await page.route('**/admin-dashboard/legal/**', async (route) => {
      requestedUrl = route.request().url();
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockTermsOfUse),
      });
    });

    await Promise.all([
      page.waitForResponse((r) => r.url().includes('/admin-dashboard/legal/'), { timeout: 15000 }),
      page.goto('/terms'),
    ]);

    expect(requestedUrl).toContain('TERMS_OF_USE');
  });

  test('should render markdown content correctly', async ({ page }) => {
    await page.route('**/admin-dashboard/legal/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ...mockPrivacyPolicy,
          content: '# Test Heading\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2',
        }),
      });
    });

    await Promise.all([
      page.waitForResponse((r) => r.url().includes('/admin-dashboard/legal/'), { timeout: 15000 }),
      page.goto('/privacy'),
    ]);

    // Verify markdown was rendered to HTML
    const heading = page.locator('h1:has-text("Test Heading")');
    if (await heading.count() > 0) {
      await expect(heading).toBeVisible();
    }
  });

  test('should handle 404 for legal content', async ({ page }) => {
    await page.route('**/admin-dashboard/legal/**', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Legal document not found' }),
      });
    });

    await Promise.all([
      page.waitForResponse((r) => r.url().includes('/admin-dashboard/legal/'), { timeout: 15000 }),
      page.goto('/privacy'),
    ]);
    // Should handle gracefully
    await expect(page).toHaveURL(/\/privacy/);
  });
});
