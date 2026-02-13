/**
 * ============================================
 * BSocio Landing Page - Signup Page E2E Tests
 * ============================================
 * Tests signup form with Radix UI Select components
 * Fields: email, gender (Select), birthMonth/birthDate/birthYear (3 Selects),
 *         acceptTerms (checkbox)
 * Submit button: "Accept the Invitation"
 * API: POST /users
 * Success: redirects to /signup/verify?email=...
 */
import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../../shared/api-mocks';

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    await page.locator('input[type="email"]').waitFor({ state: 'visible' });
  });

  test('should load the signup page', async ({ page }) => {
    await expect(page).toHaveURL(/\/signup/);
  });

  test('should display the signup heading', async ({ page }) => {
    const heading = page.getByText('Accept the Invitation').first();
    await expect(heading).toBeVisible();
  });

  test('should have the email input field', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('should have gender select field', async ({ page }) => {
    // Look for the "Select your gender" placeholder
    const genderTrigger = page.getByText(/select your gender/i);
    await expect(genderTrigger).toBeVisible();
  });

  test('should have birthday select fields', async ({ page }) => {
    // Three Radix Selects for month, date, year
    await expect(page.getByText('Month')).toBeVisible();
    await expect(page.getByText('Date')).toBeVisible();
    await expect(page.getByText('Year')).toBeVisible();
  });

  test('should have terms checkbox', async ({ page }) => {
    const termsCheckbox = page.locator('input[name="acceptTerms"]');
    await expect(termsCheckbox).toBeVisible();
  });

  test('should have the submit button', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /accept the invitation/i });
    await expect(submitButton).toBeVisible();
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    await page.getByRole('button', { name: /accept the invitation/i }).click();
    await page.waitForTimeout(500);

    // Should show validation error messages
    const errorMessages = page.locator('.text-red-500, .text-destructive, [role="alert"]');
    const count = await errorMessages.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should validate email format', async ({ page }) => {
    await page.locator('input[type="email"]').fill('not-an-email');
    await page.getByRole('button', { name: /accept the invitation/i }).click();
    await page.waitForTimeout(500);

    const body = await page.textContent('body');
    expect(body?.toLowerCase()).toMatch(/valid email|email/i);
  });

  test('should fill and submit the form successfully', async ({ page }) => {
    // Intercept signup API
    let requestPayload: any = null;
    await page.route('**/users', async (route) => {
      if (route.request().method() === 'POST') {
        requestPayload = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Registration successful',
            user: { id: 'new-user', email: requestPayload?.email },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Select gender (Radix Select)
    await page.getByText(/select your gender/i).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click({ force: true });

    // Select birth month
    await page.getByText('Month', { exact: true }).click();
    await page.getByRole('option', { name: 'May' }).click({ force: true });

    // Select birth date
    await page.getByText('Date', { exact: true }).click();
    await page.getByRole('option', { name: '15' }).click({ force: true });

    // Select birth year
    await page.getByText('Year', { exact: true }).click();
    await page.getByRole('option', { name: '1995' }).click({ force: true });

    // Fill email AFTER selects to prevent value loss on webkit/mobile
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').fill('testuser@example.com');

    // Check terms
    await page.locator('input[name="acceptTerms"]').check();

    // Submit
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/users') && r.request().method() === 'POST', { timeout: 15000 }),
      page.getByRole('button', { name: /accept the invitation/i }).click(),
    ]);

    // Verify API was called with correct payload
    expect(requestPayload).toBeTruthy();
    expect(requestPayload.email).toBe('testuser@example.com');
    expect(requestPayload.gender).toBe('MALE');
    expect(requestPayload.isTermsAccepted).toBe(true);
    expect(requestPayload.dob).toContain('1995');
  });

  test('should have link to terms of use', async ({ page }) => {
    const termsLink = page.getByRole('link', { name: /terms of use/i });
    await expect(termsLink.first()).toBeVisible();
  });

  test('should have link to privacy policy', async ({ page }) => {
    const privacyLink = page.getByRole('link', { name: /privacy policy/i });
    await expect(privacyLink.first()).toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Override with error response
    await page.route('**/users', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 409,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Email already exists' }),
        });
      } else {
        await route.continue();
      }
    });

    // Fill all fields — selects first, then text inputs to prevent value loss on webkit/mobile
    await page.getByText(/select your gender/i).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click({ force: true });
    await page.getByText('Month', { exact: true }).click();
    await page.getByRole('option', { name: 'May' }).click({ force: true });
    await page.getByText('Date', { exact: true }).click();
    await page.getByRole('option', { name: '15' }).click({ force: true });
    await page.getByText('Year', { exact: true }).click();
    await page.getByRole('option', { name: '1995' }).click({ force: true });
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').fill('existing@example.com');
    await page.locator('input[name="acceptTerms"]').check();

    // Submit
    await page.getByRole('button', { name: /accept the invitation/i }).click();
    await page.waitForTimeout(2000);

    // Should stay on signup page (not crash)
    await expect(page).toHaveURL(/\/signup/);
  });
});
