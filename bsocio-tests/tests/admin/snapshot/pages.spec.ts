/**
 * ============================================
 * BSocio Admin - Page Snapshot Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';

test.describe('Admin Page Snapshots', () => {
  test.beforeEach(async ({ page, context }) => {
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
  });

  test('Login page snapshot', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('admin-login.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Dashboard page snapshot', async ({ page }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('admin-dashboard.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('News management snapshot', async ({ page }) => {
    await page.goto('/dashboard/news');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('admin-news.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Events management snapshot', async ({ page }) => {
    await page.goto('/dashboard/events');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('admin-events.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('FAQs management snapshot', async ({ page }) => {
    await page.goto('/dashboard/faqs');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('admin-faqs.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Legal editor snapshot', async ({ page }) => {
    await page.goto('/dashboard/legal');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('admin-legal.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Awards management snapshot', async ({ page }) => {
    await page.goto('/dashboard/awards');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('admin-awards.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Nominees management snapshot', async ({ page }) => {
    await page.goto('/dashboard/nominees');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('admin-nominees.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Campaigns page snapshot', async ({ page }) => {
    await page.goto('/dashboard/campaigns');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('admin-campaigns.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Communications page snapshot', async ({ page }) => {
    await page.goto('/dashboard/communications');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('admin-communications.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Users management snapshot', async ({ page }) => {
    await page.goto('/dashboard/users');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('admin-users.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Analytics page snapshot', async ({ page }) => {
    await page.goto('/dashboard/analytics');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('admin-analytics.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });
});
