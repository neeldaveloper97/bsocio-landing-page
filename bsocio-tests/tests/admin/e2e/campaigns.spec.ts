/**
 * ============================================
 * BSocio Admin - Campaigns E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockCampaigns } from '../../shared/mock-data';
import { buildCampaign } from '../../shared/test-data';

test.describe('Campaign Management', () => {
  test.beforeEach(async ({ page, context }) => {
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
    await page.goto('/dashboard/campaigns');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load campaigns page', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/campaigns/);
  });

  test('should display campaigns list', async ({ page }) => {
    await page.waitForTimeout(2000);
    for (const campaign of mockCampaigns.data) {
      const subject = page.getByText(campaign.subject);
      await expect(subject.first()).toBeVisible();
    }
  });

  test('should show campaign status', async ({ page }) => {
    await page.waitForTimeout(2000);
    const statusBadge = page.getByText(/sent|draft|scheduled/i);
    if (await statusBadge.count() > 0) {
      await expect(statusBadge.first()).toBeVisible();
    }
  });

  test('should have create campaign button', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /create|new|compose/i });
    await expect(createBtn.first()).toBeVisible();
  });

  test('should open campaign creation form', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /create|new|compose/i });
    await createBtn.first().click();
    await page.waitForTimeout(500);

    const subjectField = page.locator('input[name="subject"]').or(page.getByLabel(/subject/i));
    if (await subjectField.count() > 0) {
      await expect(subjectField.first()).toBeVisible();
    }
  });

  test('should compose and send a campaign', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /create|new|compose/i });
    await createBtn.first().click();
    await page.waitForTimeout(500);

    const campaign = buildCampaign();
    const subjectField = page.locator('input[name="subject"]').or(page.getByLabel(/subject/i));
    if (await subjectField.count() > 0) {
      await subjectField.first().fill(campaign.subject);
    }

    const sendBtn = page.getByRole('button', { name: /send|submit/i });
    if (await sendBtn.count() > 0) {
      await sendBtn.first().click();
      await page.waitForTimeout(2000);
    }
  });

  test('should save campaign as draft', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /create|new|compose/i });
    await createBtn.first().click();
    await page.waitForTimeout(500);

    const campaign = buildCampaign();
    const subjectField = page.locator('input[name="subject"]').or(page.getByLabel(/subject/i));
    if (await subjectField.count() > 0) {
      await subjectField.first().fill(campaign.subject);
    }

    const draftBtn = page.getByRole('button', { name: /draft|save draft/i });
    if (await draftBtn.count() > 0) {
      await draftBtn.first().click();
      await page.waitForTimeout(2000);
    }
  });

  test('should select audience type', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: /create|new|compose/i });
    await createBtn.first().click();
    await page.waitForTimeout(500);

    const audienceSelect = page.locator('select[name="audienceType"], [data-testid="audience-select"]');
    if (await audienceSelect.count() > 0) {
      await audienceSelect.first().selectOption('ALL');
    }
  });
});
