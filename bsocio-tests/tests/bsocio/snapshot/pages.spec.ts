/**
 * ============================================
 * BSocio - Page Snapshot Tests
 * ============================================
 * Visual regression testing for all pages
 */
import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../../shared/api-mocks';

// Disable animations for consistent snapshots
test.use({
  // Lower timeout for snapshot tests
  actionTimeout: 10000,
});

test.describe('Page Snapshots', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
  });

  test('Home page snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('About page snapshot', async ({ page }) => {
    await page.goto('/about');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('about.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('How It Works page snapshot', async ({ page }) => {
    await page.goto('/how-it-works');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('how-it-works.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Leadership page snapshot', async ({ page }) => {
    await page.goto('/leadership');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot('leadership.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Our Structure page snapshot', async ({ page }) => {
    await page.goto('/our-structure');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('our-structure.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('FAQs page snapshot', async ({ page }) => {
    await page.goto('/faqs');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot('faqs.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Contact page snapshot', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('contact.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Signup page snapshot', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot('signup.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('News & Media page snapshot', async ({ page }) => {
    await page.goto('/news-media');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot('news-media.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Festivals page snapshot', async ({ page }) => {
    await page.goto('/festivals');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await expect(page).toHaveScreenshot('festivals.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Privacy page snapshot', async ({ page }) => {
    await page.goto('/privacy');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot('privacy.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Terms page snapshot', async ({ page }) => {
    await page.goto('/terms');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot('terms.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('404 page snapshot', async ({ page }) => {
    await page.goto('/non-existent-page');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('404.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });
});

test.describe('Mobile Snapshots', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
  });

  test('Home page mobile snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('home-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Contact page mobile snapshot', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('contact-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('Signup page mobile snapshot', async ({ page }) => {
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    await expect(page).toHaveScreenshot('signup-mobile.png', {
      fullPage: true,
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });
});
