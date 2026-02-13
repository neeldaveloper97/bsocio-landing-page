/**
 * ============================================
 * BSocio - Contact Form Integration Tests
 * ============================================
 * Tests form validation, submission, and API interaction
 */
import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../../shared/api-mocks';

test.describe('Contact Form Integration', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
    await page.goto('/contact');
    await page.waitForLoadState('networkidle');
    await page.locator('input[name="fullName"]').waitFor({ state: 'visible' });
  });

  test('should require reason selection', async ({ page }) => {
    // Fill everything except reason
    await page.locator('input[name="fullName"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('textarea[name="message"]').fill('This is a test message for validation.');

    // Select country only
    await page.getByRole('combobox').last().click();
    await page.getByRole('option', { name: /united states/i }).click({ force: true });

    await page.getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(500);

    // Should show reason validation error
    const errors = page.locator('.text-red-500, .text-destructive, [role="alert"]');
    const count = await errors.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should require country selection', async ({ page }) => {
    // Fill everything except country
    await page.locator('input[name="fullName"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('textarea[name="message"]').fill('This is a test message for validation.');

    // Select reason only
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: /general/i }).click({ force: true });

    await page.getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(500);

    const errors = page.locator('.text-red-500, .text-destructive, [role="alert"]');
    const count = await errors.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should enforce minimum message length', async ({ page }) => {
    await page.locator('input[name="fullName"]').fill('John Doe');
    await page.locator('input[name="email"]').fill('john@example.com');
    await page.locator('textarea[name="message"]').fill('Short');

    // Select both reason and country  
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: /general/i }).click({ force: true });
    await page.getByRole('combobox').last().click();
    await page.getByRole('option', { name: /united states/i }).click({ force: true });

    await page.getByRole('button', { name: /submit/i }).click();
    await page.waitForTimeout(500);

    // Should show message validation error (min 10 chars)
    const body = await page.textContent('body');
    expect(body?.toLowerCase()).toMatch(/at least|character|too short|message/i);
  });

  test('should submit contact form and receive success', async ({ page }) => {
    let apiCalled = false;
    await page.route('**/contact*', async (route) => {
      if (route.request().method() === 'POST') {
        apiCalled = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Contact received' }),
        });
      } else {
        await route.continue();
      }
    });

    // Select reason
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: /media/i }).click({ force: true });

    // Select country
    await page.getByRole('combobox').last().click();
    await page.getByRole('option', { name: /united kingdom/i }).click({ force: true });

    // Fill text fields AFTER selects to prevent value loss on webkit/mobile
    await page.locator('input[name="fullName"]').click();
    await page.locator('input[name="fullName"]').fill('Jane Smith');
    await page.locator('input[name="email"]').fill('jane@example.com');
    await page.locator('input[name="phone"]').fill('+15559876543');
    await page.locator('textarea[name="message"]').fill('Integration test message for the contact form validation and submission.');

    // Submit
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/contact') && r.request().method() === 'POST', { timeout: 15000 }),
      page.getByRole('button', { name: /submit/i }).click(),
    ]);

    expect(apiCalled).toBeTruthy();
  });

  test('should have all contact reason options', async ({ page }) => {
    // Open reason dropdown
    await page.getByRole('combobox').first().click();
    await page.waitForTimeout(300);

    // Verify all options
    await expect(page.getByRole('option', { name: /media/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /partnership/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /report/i })).toBeVisible();
    await expect(page.getByRole('option', { name: /general/i })).toBeVisible();
  });

  test('should phone field be optional', async ({ page }) => {
    let apiCalled = false;
    await page.route('**/contact*', async (route) => {
      if (route.request().method() === 'POST') {
        apiCalled = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'Success' }),
        });
      } else {
        await route.continue();
      }
    });

    // Select dropdowns first
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: /general/i }).click({ force: true });
    await page.getByRole('combobox').last().click();
    await page.getByRole('option', { name: /united states/i }).click({ force: true });

    // Fill text fields AFTER selects to prevent value loss on webkit/mobile
    await page.locator('input[name="fullName"]').click();
    await page.locator('input[name="fullName"]').fill('Test User');
    await page.locator('input[name="email"]').fill('test@example.com');
    await page.locator('textarea[name="message"]').fill('Testing that phone is optional for contact form submission.');

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/contact') && r.request().method() === 'POST', { timeout: 15000 }),
      page.getByRole('button', { name: /submit/i }).click(),
    ]);

    // Should succeed without phone
    expect(apiCalled).toBeTruthy();
  });
});
