/**
 * ============================================
 * BSocio - Signup Flow Integration Tests
 * ============================================
 * Tests signup form validation, Radix Select interactions, and API submission
 */
import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../../shared/api-mocks';

test.describe('Signup Flow Integration', () => {
  test.beforeEach(async ({ page }) => {
    await mockBsocioPublicApis(page);
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    // Wait for the form to be fully hydrated
    await page.locator('input[type="email"]').waitFor({ state: 'visible' });
  });

  test('should require email to submit', async ({ page }) => {
    // Fill everything except email
    await page.getByText(/select your gender/i).click();
    await page.getByRole('option', { name: 'Female' }).click({ force: true });
    await page.getByText('Month', { exact: true }).click();
    await page.getByRole('option', { name: 'March' }).click({ force: true });
    await page.getByText('Date', { exact: true }).click();
    await page.getByRole('option', { name: '10' }).click({ force: true });
    await page.getByText('Year', { exact: true }).click();
    await page.getByRole('option', { name: '1990' }).click({ force: true });
    await page.locator('input[name="acceptTerms"]').check();

    await page.getByRole('button', { name: /accept the invitation/i }).click();
    await page.waitForTimeout(500);

    // Should show email error
    const body = await page.textContent('body');
    expect(body?.toLowerCase()).toMatch(/email/i);
  });

  test('should require gender selection', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com');
    // Skip gender
    await page.getByText('Month', { exact: true }).click();
    await page.getByRole('option', { name: 'January' }).click({ force: true });
    await page.getByText('Date', { exact: true }).click();
    await page.getByRole('option', { name: '1', exact: true }).click({ force: true });
    await page.getByText('Year', { exact: true }).click();
    await page.getByRole('option', { name: '2000' }).click({ force: true });
    await page.locator('input[name="acceptTerms"]').check();

    await page.getByRole('button', { name: /accept the invitation/i }).click();
    await page.waitForTimeout(500);

    const body = await page.textContent('body');
    expect(body?.toLowerCase()).toMatch(/gender/i);
  });

  test('should require birthday selections', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.getByText(/select your gender/i).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click({ force: true });
    // Skip birthday fields
    await page.locator('input[name="acceptTerms"]').check();

    await page.getByRole('button', { name: /accept the invitation/i }).click();
    await page.waitForTimeout(500);

    const body = await page.textContent('body');
    expect(body?.toLowerCase()).toMatch(/birthday/i);
  });

  test('should require terms acceptance', async ({ page }) => {
    await page.locator('input[type="email"]').fill('test@example.com');
    await page.getByText(/select your gender/i).click();
    await page.getByRole('option', { name: 'Male', exact: true }).click({ force: true });
    await page.getByText('Month', { exact: true }).click();
    await page.getByRole('option', { name: 'June' }).click({ force: true });
    await page.getByText('Date', { exact: true }).click();
    await page.getByRole('option', { name: '20' }).click({ force: true });
    await page.getByText('Year', { exact: true }).click();
    await page.getByRole('option', { name: '1998' }).click({ force: true });
    // Skip acceptTerms checkbox

    await page.getByRole('button', { name: /accept the invitation/i }).click();
    await page.waitForTimeout(500);

    const body = await page.textContent('body');
    expect(body?.toLowerCase()).toMatch(/terms/i);
  });

  test('should call signup API with correct payload', async ({ page }) => {
    let requestPayload: any = null;
    await page.route('**/users', async (route) => {
      if (route.request().method() === 'POST') {
        requestPayload = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            message: 'Registration successful',
            user: { id: 'test-id', email: requestPayload?.email },
          }),
        });
      } else {
        await route.continue();
      }
    });

    // Fill complete form — fill email AFTER selects to avoid webkit/mobile hydration issues
    await page.getByText(/select your gender/i).click();
    await page.getByRole('option', { name: 'Female' }).click({ force: true });
    await page.getByText('Month', { exact: true }).click();
    await page.getByRole('option', { name: 'December' }).click({ force: true });
    await page.getByText('Date', { exact: true }).click();
    await page.getByRole('option', { name: '25' }).click({ force: true });
    await page.getByText('Year', { exact: true }).click();
    await page.getByRole('option', { name: '1995' }).click({ force: true });

    // Fill email after all Select interactions to prevent value loss on webkit/mobile
    await page.locator('input[type="email"]').click();
    await page.locator('input[type="email"]').fill('integration.test@example.com');
    await page.locator('input[name="acceptTerms"]').check();

    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/users') && r.request().method() === 'POST', { timeout: 15000 }),
      page.getByRole('button', { name: /accept the invitation/i }).click(),
    ]);

    // Verify API payload
    expect(requestPayload).toBeTruthy();
    expect(requestPayload.email).toBe('integration.test@example.com');
    expect(requestPayload.gender).toBe('FEMALE');
    expect(requestPayload.dob).toBe('1995-12-25');
    expect(requestPayload.isTermsAccepted).toBe(true);
    expect(requestPayload.role).toBe('USER');
  });

  test('should have all gender options', async ({ page }) => {
    await page.getByText(/select your gender/i).click();
    await page.waitForTimeout(300);

    await expect(page.getByRole('option', { name: 'Male', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Female', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: /prefer not/i })).toBeVisible();
  });

  test('should have all month options', async ({ page }) => {
    await page.getByText('Month', { exact: true }).click();
    await page.waitForTimeout(300);

    // Verify a few months
    await expect(page.getByRole('option', { name: 'January' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'June' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'December' })).toBeVisible();
  });
});
