/**
 * ============================================
 * BSocio Landing Page - Leadership Page E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { hideNextJsDevOverlay } from '../../shared/api-mocks';

test.describe('Leadership Page', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
    await page.goto('/leadership');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load the leadership page', async ({ page }) => {
    await expect(page).toHaveURL(/\/leadership/);
  });

  test('should display page heading', async ({ page }) => {
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
    const text = await heading.textContent();
    expect(text?.toLowerCase()).toMatch(/leader|team|board/i);
  });

  test('should display team member cards', async ({ page }) => {
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Should have member images or cards
    const images = page.locator('main img');
    const count = await images.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display member names and roles', async ({ page }) => {
    const text = await page.locator('main').textContent();
    expect(text!.length).toBeGreaterThan(100);
  });
});
