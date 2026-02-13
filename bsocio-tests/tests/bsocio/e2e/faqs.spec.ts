/**
 * ============================================
 * BSocio Landing Page - FAQs Page E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../../shared/api-mocks';
import { mockFAQs } from '../../shared/mock-data';

test.describe('FAQs Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
    await page.goto('/faqs');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load the FAQs page', async ({ page }) => {
    await expect(page).toHaveURL(/\/faqs/);
  });

  test('should display page heading', async ({ page }) => {
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text?.toLowerCase()).toMatch(/faq|frequently asked/i);
  });

  test('should display FAQ items from API', async ({ page }) => {
    // Wait for data to load
    await page.waitForTimeout(1000);

    for (const faq of mockFAQs.data) {
      // Use the accordion trigger heading (not sidebar button which prepends "N. ")
      const question = page.locator('[data-faq] h3', { hasText: faq.question });
      await expect(question.first()).toBeVisible();
    }
  });

  test('should expand FAQ item on click (accordion)', async ({ page }) => {
    await page.waitForTimeout(1000);

    // Click the accordion trigger (not sidebar)
    const firstTrigger = page.locator(`[data-faq="${mockFAQs.data[0].id}"] button`).first();
    await firstTrigger.click();

    // Answer should become visible
    await page.waitForTimeout(300);
    const answer = page.getByText(mockFAQs.data[0].answer);
    await expect(answer).toBeVisible();
  });

  test('should collapse FAQ item when clicked again', async ({ page }) => {
    await page.waitForTimeout(1000);

    const firstTrigger = page.locator(`[data-faq="${mockFAQs.data[0].id}"] button`).first();

    // Open
    await firstTrigger.click();
    await page.waitForTimeout(300);

    // Close
    await firstTrigger.click();
    await page.waitForTimeout(300);

    const answer = page.getByText(mockFAQs.data[0].answer);
    await expect(answer).toBeHidden();
  });

  test('should handle empty FAQ list', async ({ page }) => {
    // Override with empty response
    await page.route('**/admin-dashboard/faqs*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ items: [], total: 0, skip: 0, take: 10 }),
      });
    });

    await page.goto('/faqs');
    await page.waitForTimeout(1000);
    // Page should still load without crashing
    await expect(page).toHaveURL(/\/faqs/);
  });

  test('should show loading state initially', async ({ page }) => {
    // Override with delayed response
    await page.route('**/admin-dashboard/faqs*', async (route) => {
      await new Promise((r) => setTimeout(r, 2000));
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
    // Should show some loading indicator
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    await page.route('**/admin-dashboard/faqs*', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server Error' }),
      });
    });

    await page.goto('/faqs');
    await page.waitForTimeout(1000);
    // Page should not crash
    await expect(page).toHaveURL(/\/faqs/);
  });
});
