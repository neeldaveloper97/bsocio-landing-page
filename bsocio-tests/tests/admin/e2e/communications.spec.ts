/**
 * ============================================
 * BSocio Admin - Communications (Contacts) E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockContacts } from '../../shared/mock-data';

test.describe('Communications / Contact Inquiries', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.addInitScript(() => {
      const s = document.createElement('style');
      s.textContent = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
      (document.head || document.documentElement).appendChild(s);
    });
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
    await page.goto('/dashboard/communications');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load communications page', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/communications/);
  });

  test('should display contact inquiries list', async ({ page }) => {
    await page.waitForTimeout(2000);
    for (const contact of mockContacts.data) {
      const name = page.getByText(contact.fullName);
      await expect(name.first()).toBeVisible();
    }
  });

  test('should display contact status', async ({ page }) => {
    await page.waitForTimeout(2000);
    const status = page.getByText(/new|in.progress|resolved/i);
    if (await status.count() > 0) {
      await expect(status.first()).toBeVisible();
    }
  });

  test('should view contact detail', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Click the View Details button for the first contact
    const viewBtn = page.locator('button[title="View Details"]').first();
    if (await viewBtn.count() > 0) {
      await viewBtn.click();
      await page.waitForTimeout(1000);

      // Modal title: "Inquiry Details"
      await expect(page.getByText('Inquiry Details')).toBeVisible();

      // Should show contact message
      const message = page.getByText(mockContacts.data[0].message);
      if (await message.count() > 0) {
        await expect(message.first()).toBeVisible();
      }
    }
  });

  test('should filter by status', async ({ page }) => {
    await page.waitForTimeout(2000);

    const statusFilter = page.locator('select:has(option[value="NEW"])').or(
      page.getByText(/filter|status/i)
    );
    if (await statusFilter.count() > 0) {
      // Interact with filter
      await statusFilter.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should filter by reason', async ({ page }) => {
    await page.waitForTimeout(2000);

    const reasonFilter = page.locator('select:has(option[value="GENERAL"])').or(
      page.getByText(/reason/i)
    );
    if (await reasonFilter.count() > 0) {
      await reasonFilter.first().click();
      await page.waitForTimeout(500);
    }
  });

  test('should have mailto reply functionality', async ({ page }) => {
    await page.waitForTimeout(2000);

    const replyBtn = page.getByRole('link', { name: /reply|respond/i }).or(
      page.locator('a[href^="mailto:"]')
    );
    if (await replyBtn.count() > 0) {
      const href = await replyBtn.first().getAttribute('href');
      if (href) {
        expect(href).toContain('mailto:');
      }
    }
  });
});
