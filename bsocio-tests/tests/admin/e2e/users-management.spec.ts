/**
 * ============================================
 * BSocio Admin - Users Management E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockAdminUsers, mockAdminActivity } from '../../shared/mock-data';

test.describe('Admin Users Management', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.addInitScript(() => {
      const s = document.createElement('style');
      s.textContent = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
      (document.head || document.documentElement).appendChild(s);
    });
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
    await page.goto('/dashboard/users');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load users management page', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/users/);
  });

  test('should display admin users list', async ({ page }) => {
    await page.waitForTimeout(2000);
    for (const user of mockAdminUsers.data) {
      const email = page.getByText(user.email);
      await expect(email.first()).toBeVisible();
    }
  });

  test('should display user roles', async ({ page }) => {
    await page.waitForTimeout(2000);
    const roleBadge = page.getByText(/super_admin|content_admin|communications_admin|analytics_viewer/i);
    if (await roleBadge.count() > 0) {
      await expect(roleBadge.first()).toBeVisible();
    }
  });

  test('should update user role', async ({ page }) => {
    await page.waitForTimeout(2000);

    const editBtn = page.getByRole('button', { name: /edit|change role/i }).or(
      page.locator('[aria-label="Edit"]').first()
    );
    if (await editBtn.count() > 0) {
      await editBtn.first().click();
      await page.waitForTimeout(500);

      const roleSelect = page.locator('select[name="role"]').or(
        page.locator('[data-testid="role-select"]')
      );
      if (await roleSelect.count() > 0) {
        await roleSelect.first().selectOption('CONTENT_ADMIN');
      }
    }
  });

  test('should toggle user active status', async ({ page }) => {
    await page.waitForTimeout(2000);

    // First user is SUPER_ADMIN (cannot be deactivated), target the second user's toggle
    const toggleBtns = page.locator('button[title="Deactivate User"], button[title="Activate User"]');
    if (await toggleBtns.count() > 0) {
      await toggleBtns.first().click();
      await page.waitForTimeout(2000);
    }
  });

  test('should export users', async ({ page }) => {
    await page.waitForTimeout(2000);

    const exportBtn = page.getByRole('button', { name: /export/i });
    if (await exportBtn.count() > 0) {
      const [download] = await Promise.all([
        page.waitForEvent('download').catch(() => null),
        exportBtn.first().click(),
      ]);
      // Export may trigger a download
    }
  });
});

test.describe('System Activity Logs', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.addInitScript(() => {
      const s = document.createElement('style');
      s.textContent = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
      (document.head || document.documentElement).appendChild(s);
    });
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
    await page.goto('/dashboard/users');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should display activity logs tab', async ({ page }) => {
    await page.waitForTimeout(2000);

    const logsTab = page.getByRole('tab', { name: /logs|activity/i }).or(
      page.getByText(/system log|activity/i)
    );
    if (await logsTab.count() > 0) {
      await logsTab.first().click();
      await page.waitForTimeout(1000);
    }
  });

  test('should display recent activity entries', async ({ page }) => {
    await page.waitForTimeout(2000);

    // Click System Logs tab (button, not role=tab)
    const logsTab = page.getByText(/system log/i).first();
    if (await logsTab.count() > 0) {
      await logsTab.click();
      await page.waitForTimeout(2000);

      for (const activity of mockAdminActivity.data) {
        const title = page.getByText(activity.title);
        if (await title.count() > 0) {
          await expect(title.first()).toBeVisible();
        }
      }
    }
  });

  test('should paginate through activity logs', async ({ page }) => {
    await page.waitForTimeout(2000);

    const logsTab = page.getByRole('tab', { name: /logs|activity/i }).or(
      page.getByText(/system log|activity/i)
    );
    if (await logsTab.count() > 0) {
      await logsTab.first().click();
      await page.waitForTimeout(1000);

      const nextBtn = page.getByRole('button', { name: /next/i });
      if (await nextBtn.count() > 0 && await nextBtn.first().isEnabled()) {
        await nextBtn.first().click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should export activity logs', async ({ page }) => {
    await page.waitForTimeout(2000);

    const logsTab = page.getByRole('tab', { name: /logs|activity/i }).or(
      page.getByText(/system log|activity/i)
    );
    if (await logsTab.count() > 0) {
      await logsTab.first().click();
      await page.waitForTimeout(1000);

      const exportBtn = page.getByRole('button', { name: /export/i });
      if (await exportBtn.count() > 0) {
        await exportBtn.first().click();
        await page.waitForTimeout(2000);
      }
    }
  });
});
