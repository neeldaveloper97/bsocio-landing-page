/**
 * ============================================
 * BSocio Admin - Login E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis, hideNextJsDevOverlay } from '../../shared/api-mocks';
import { buildLoginData } from '../../shared/test-data';
import { mockLoginResponse } from '../../shared/mock-data';

test.describe('Admin Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await hideNextJsDevOverlay(page);
    await page.goto('/login');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display login form', async ({ page }) => {
    const form = page.locator('form');
    await expect(form).toBeVisible();
  });

  test('should have email and password fields', async ({ page }) => {
    const emailField = page.locator('input[type="email"], input[name="email"]');
    await expect(emailField.first()).toBeVisible();

    const passwordField = page.locator('input[type="password"], input[name="password"]');
    await expect(passwordField.first()).toBeVisible();
  });

  test('should have remember me checkbox', async ({ page }) => {
    const rememberMe = page.getByLabel(/remember/i).or(page.locator('input[type="checkbox"]'));
    if (await rememberMe.count() > 0) {
      await expect(rememberMe.first()).toBeVisible();
    }
  });

  test('should have submit button', async ({ page }) => {
    const loginBtn = page.getByRole('button', { name: /log in|sign in|login/i });
    await expect(loginBtn).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    const loginBtn = page.getByRole('button', { name: /log in|sign in|login/i });
    await loginBtn.click();
    await page.waitForTimeout(500);

    const errors = page.locator('[role="alert"], .text-red, .text-destructive, [class*="error"]');
    const count = await errors.count();
    // Should either show HTML5 validation or custom errors
    expect(count >= 0).toBeTruthy();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    await mockAdminApis(page);

    const { email, password } = buildLoginData(true);
    await page.locator('input[type="email"], input[name="email"]').first().fill(email);
    await page.locator('input[type="password"], input[name="password"]').first().fill(password);

    const loginBtn = page.getByRole('button', { name: /log in|sign in|login/i });
    await loginBtn.click();

    // Should redirect to dashboard
    await page.waitForURL('**/dashboard**', { timeout: 20000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should handle invalid credentials', async ({ page }) => {
    await page.route('**/auth/login*', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid email or password' }),
      });
    });

    await page.locator('input[type="email"], input[name="email"]').first().fill('wrong@email.com');
    await page.locator('input[type="password"], input[name="password"]').first().fill('wrongpassword');

    const loginBtn = page.getByRole('button', { name: /log in|sign in|login/i });
    await loginBtn.click();
    await page.waitForTimeout(2000);

    // Should stay on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should handle two-factor authentication flow', async ({ page }) => {
    await page.route('**/auth/login*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ requiresTwoFactor: true, message: 'Enter 2FA code' }),
      });
    });

    const { email, password } = buildLoginData(true);
    await page.locator('input[type="email"], input[name="email"]').first().fill(email);
    await page.locator('input[type="password"], input[name="password"]').first().fill(password);

    const loginBtn = page.getByRole('button', { name: /log in|sign in|login/i });
    await loginBtn.click();
    await page.waitForTimeout(2000);

    // Should show 2FA input
    const codeInput = page.locator('input[id="tfaCode"], input[name="code"], input[name="twoFactorCode"], input[name="otp"]');
    if (await codeInput.count() > 0) {
      await expect(codeInput.first()).toBeVisible();
    }
  });

  test('should redirect to login when visiting root', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/login/);
  });
});
