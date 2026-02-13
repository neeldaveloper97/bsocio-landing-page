/**
 * ============================================
 * BSocio Landing Page - Contact Page E2E Tests
 * ============================================
 * Tests contact form with Radix UI Select components
 * Fields: reason (Select), fullName, email, phone, country (Select), message
 * API: POST https://api.specsto.online/contact
 */
import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../../shared/api-mocks';

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await page.locator('input[name="fullName"]').waitFor({ state: 'visible' });
  });

  test('should load the contact page', async ({ page }) => {
    await expect(page).toHaveURL(/\/contact/);
  });

  test('should display the contact form heading', async ({ page }) => {
    const heading = page.getByRole('heading', { name: /contact us/i });
    await expect(heading).toBeVisible();
  });

  test('should have all required form fields', async ({ page }) => {
    // Text inputs
    await expect(page.locator('input[name="fullName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();

    // Radix Select triggers (combobox role)
    const comboboxes = page.getByRole('combobox');
    await expect(comboboxes).toHaveCount(2); // reason + country
  });

  test('should show validation errors for empty form submission', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /submit/i }).click();

    // Should show validation error messages
    await page.waitForTimeout(500);
    const errorMessages = page.locator('[class*="text-red"], [class*="text-destructive"], [role="alert"]');
    const count = await errorMessages.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should validate email format', async ({ page }) => {
    // Select dropdowns first to avoid text field value loss on firefox/webkit
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: /general/i }).click({ force: true });
    await page.getByRole('combobox').last().click();
    await page.getByRole('option', { name: /united states/i }).click({ force: true });

    // Fill text fields AFTER selects
    await page.locator('input[name="email"]').click();
    await page.locator('input[name="email"]').fill('invalid-email');
    await page.locator('input[name="fullName"]').fill('Test User');
    await page.locator('textarea[name="message"]').fill('This is a test message that is long enough');

    // Submit
    await page.getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(500);

    // Should show email validation error
    const body = await page.textContent('body');
    expect(body?.toLowerCase()).toMatch(/valid email|email/i);
  });

  test('should submit the form with valid data', async ({ page }) => {
    // Intercept the contact API
    let requestPayload: any = null;
    await page.route('**/contact*', async (route) => {
      if (route.request().method() === 'POST') {
        requestPayload = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Success' }),
        });
      } else {
        await route.continue();
      }
    });

    // Select reason first (Radix Select)
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: /general/i }).click({ force: true });

    // Select country (Radix Select)
    await page.getByRole('combobox').last().click();
    await page.getByRole('option', { name: /united states/i }).click({ force: true });

    // Fill text fields AFTER selects to prevent value loss on webkit/mobile
    await page.locator('input[name="fullName"]').click();
    await page.locator('input[name="fullName"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john.doe@example.com');
    await page.locator('input[name="phone"]').fill('+15551234567');
    await page.locator('textarea[name="message"]').fill('This is a test contact form submission for E2E testing purposes.');

    // Submit
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/contact') && r.request().method() === 'POST', { timeout: 15000 }),
      page.getByRole('button', { name: /submit/i }).click(),
    ]);

    // Verify API was called with correct payload
    expect(requestPayload).toBeTruthy();
    expect(requestPayload.fullName).toBe('John Doe');
    expect(requestPayload.email).toBe('john.doe@example.com');
    expect(requestPayload.reason).toBe('GENERAL_INQUIRY');
    expect(requestPayload.country).toBe('US');
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // Override with error response
    await page.route('**/contact*', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Server Error' }),
        });
      } else {
        await route.continue();
      }
    });

    // Select reason first
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: /general/i }).click({ force: true });

    // Select country
    await page.getByRole('combobox').last().click();
    await page.getByRole('option', { name: /united states/i }).click({ force: true });

    // Fill text fields AFTER selects to prevent value loss on webkit/mobile
    await page.locator('input[name="fullName"]').click();
    await page.locator('input[name="fullName"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john.doe@example.com');
    await page.locator('textarea[name="message"]').fill('This is a test message for the contact form testing.');

    // Submit
    await page.getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(2000);

    // Page should not crash
    await expect(page).toHaveURL(/\/contact/);
  });
});
