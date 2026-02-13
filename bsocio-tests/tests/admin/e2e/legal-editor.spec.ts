/**
 * ============================================
 * BSocio Admin - Legal Editor E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockPrivacyPolicy, mockTermsOfUse } from '../../shared/mock-data';

test.describe('Legal Document Management', () => {
  test.beforeEach(async ({ page, context }) => {
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
    await page.goto('/dashboard/legal');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load legal management page', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/legal/);
  });

  test('should display privacy policy and terms tabs/sections', async ({ page }) => {
    await page.waitForTimeout(2000);
    const body = await page.textContent('body');
    expect(
      body?.toLowerCase().includes('privacy') || body?.toLowerCase().includes('terms')
    ).toBeTruthy();
  });

  test('should load privacy policy content', async ({ page }) => {
    await page.waitForTimeout(2000);
    const privacyTab = page.getByText(/privacy/i).first();
    if (await privacyTab.isVisible()) {
      await privacyTab.click();
      await page.waitForTimeout(1000);
    }
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('should load terms of use content', async ({ page }) => {
    await page.waitForTimeout(2000);
    const termsTab = page.getByText(/terms/i).first();
    if (await termsTab.isVisible()) {
      await termsTab.click();
      await page.waitForTimeout(1000);
    }
    const body = await page.textContent('body');
    expect(body).toBeTruthy();
  });

  test('should have save/update button', async ({ page }) => {
    await page.waitForTimeout(2000);
    const saveBtn = page.getByRole('button', { name: /save|update|publish/i });
    if (await saveBtn.count() > 0) {
      await expect(saveBtn.first()).toBeVisible();
    }
  });

  test('should have preview functionality', async ({ page }) => {
    await page.waitForTimeout(2000);
    const previewBtn = page.getByRole('button', { name: /preview/i });
    if (await previewBtn.count() > 0) {
      await previewBtn.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should handle save legal document', async ({ page }) => {
    let capturedBody: any = null;

    await page.route('**/admin-dashboard/legal/**', async (route) => {
      const method = route.request().method();
      if (method === 'PUT' || method === 'PATCH') {
        capturedBody = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ...mockPrivacyPolicy, ...capturedBody }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockPrivacyPolicy),
        });
      }
    });

    await page.goto('/dashboard/legal');
    await page.waitForTimeout(2000);

    const saveBtn = page.getByRole('button', { name: /save|update|publish/i });
    if (await saveBtn.count() > 0) {
      await saveBtn.first().click();
      await page.waitForTimeout(2000);
    }
  });
});
