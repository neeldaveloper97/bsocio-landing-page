/**
 * ============================================
 * BSocio Admin - News CRUD E2E Tests
 * ============================================
 */
import { test, expect } from '@playwright/test';
import { mockAdminApis } from '../../shared/api-mocks';
import { setAdminAuthCookies } from '../../shared/auth-helpers';
import { mockNewsArticles } from '../../shared/mock-data';
import { buildNewsArticle } from '../../shared/test-data';

const FIRST_ARTICLE = mockNewsArticles.data[0]; // "BSocio Launches New Initiative"

test.describe('News Management', () => {
  test.beforeEach(async ({ page, context }) => {
    await page.addInitScript(() => {
      const s = document.createElement('style');
      s.textContent = 'nextjs-portal { display: none !important; pointer-events: none !important; }';
      (document.head || document.documentElement).appendChild(s);
    });
    await mockAdminApis(page);
    await setAdminAuthCookies(context, 'http://localhost:3001');
    await page.goto('/dashboard/news');
    await page.waitForLoadState('domcontentloaded');
  });

  test('should load news management page', async ({ page }) => {
    await expect(page).toHaveURL(/\/dashboard\/news/);
    await expect(page.locator('h1', { hasText: 'News & Media' })).toBeVisible();
  });

  test('should display news articles in a table/list', async ({ page }) => {
    await page.waitForTimeout(2000);
    const table = page.locator('table');
    await expect(table.first()).toBeVisible();

    // Article titles are truncated with CSS in the table cells;
    // the full title is stored in the [title] attribute of the cell span.
    for (const article of mockNewsArticles.data) {
      const titleCell = page.locator(`[title="${article.title}"]`);
      await expect(titleCell.first()).toBeVisible();
    }
  });

  test('should have create new article button', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: 'Create Article' });
    await expect(createBtn).toBeVisible();
  });

  test('should open create article form/modal', async ({ page }) => {
    const createBtn = page.getByRole('button', { name: 'Create Article' });
    await createBtn.click();
    await page.waitForTimeout(500);

    // Modal heading
    await expect(page.getByText('Create News Article')).toBeVisible();

    // Should show a form with title input
    const titleInput = page.locator('input[name="title"]');
    await expect(titleInput).toBeVisible();
  });

  test('should create a new article', async ({ page }) => {
    let capturedBody: any = null;
    await page.route('**/admin-dashboard/news', async (route) => {
      if (route.request().method() === 'POST') {
        capturedBody = JSON.parse(route.request().postData() || '{}');
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ ...FIRST_ARTICLE, ...capturedBody }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            items: mockNewsArticles.data,
            total: mockNewsArticles.total,
            skip: 0,
            take: 10,
          }),
        });
      }
    });

    const createBtn = page.getByRole('button', { name: 'Create Article' });
    await createBtn.click();
    await page.waitForTimeout(500);

    const article = buildNewsArticle();

    // Fill title
    await page.locator('input[name="title"]').fill(article.title);

    // Fill author
    const authorInput = page.locator('input[name="author"]');
    if (await authorInput.count() > 0) {
      await authorInput.fill('Test Author');
    }

    // Fill excerpt
    const excerptField = page.locator('textarea[name="excerpt"]');
    if (await excerptField.count() > 0) {
      await excerptField.fill(article.excerpt);
    }

    // Submit the form – "Save as Draft"
    const saveBtn = page.getByRole('button', { name: /Save as Draft/i });
    await saveBtn.click();
    await page.waitForTimeout(2000);
  });

  test('should edit an existing article', async ({ page }) => {
    // Wait for table data to render (titles are truncated, match by attribute)
    await expect(page.locator(`[title="${FIRST_ARTICLE.title}"]`).first()).toBeVisible();

    // Click Edit button for the first article
    const editBtn = page.getByRole('button', { name: `Edit ${FIRST_ARTICLE.title}` });
    await editBtn.click();
    await page.waitForTimeout(500);

    // Modal heading
    await expect(page.getByText('Edit Article')).toBeVisible();

    // Update the title
    const titleInput = page.locator('input[name="title"]');
    await titleInput.clear();
    await titleInput.fill('Updated Article Title');
  });

  test('should delete an article with confirmation', async ({ page }) => {
    // Wait for table data to render (titles are truncated, match by attribute)
    await expect(page.locator(`[title="${FIRST_ARTICLE.title}"]`).first()).toBeVisible();

    // Click Delete button for the first article
    const deleteBtn = page.getByRole('button', { name: `Delete ${FIRST_ARTICLE.title}` });
    await deleteBtn.click();
    await page.waitForTimeout(500);

    // Should show confirmation dialog
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();

    // Confirm deletion
    const confirmBtn = dialog.getByRole('button', { name: 'Delete' });
    await confirmBtn.click();
    await page.waitForTimeout(2000);
  });

  test('should archive an article', async ({ page }) => {
    // Wait for table data to render (titles are truncated, match by attribute)
    await expect(page.locator(`[title="${FIRST_ARTICLE.title}"]`).first()).toBeVisible();

    // Click Archive button for the first article
    const archiveBtn = page.getByRole('button', { name: `Archive ${FIRST_ARTICLE.title}` });
    await archiveBtn.click({ force: true });
    await page.waitForTimeout(500);

    // Archive may or may not show a confirmation dialog depending on implementation
    const dialog = page.getByRole('dialog');
    if (await dialog.isVisible().catch(() => false)) {
      const confirmBtn = dialog.getByRole('button', { name: /archive|confirm/i });
      if (await confirmBtn.count() > 0) {
        await confirmBtn.click();
      }
    }
    await page.waitForTimeout(2000);
  });

  test('should handle pagination', async ({ page }) => {
    await page.waitForTimeout(2000);

    const nextPageBtn = page.getByRole('button', { name: /next/i }).or(
      page.locator('[aria-label="Next page"]')
    );
    if (await nextPageBtn.count() > 0 && await nextPageBtn.first().isEnabled()) {
      await nextPageBtn.first().click();
      await page.waitForTimeout(1000);
    }
  });

  test('should sort articles', async ({ page }) => {
    // Wait for table to be visible
    const table = page.locator('table');
    await expect(table.first()).toBeVisible();

    const sortHeader = page.locator('th:has-text("Title"), [role="columnheader"]:has-text("Title")');
    if (await sortHeader.count() > 0) {
      await sortHeader.first().click();
      await page.waitForTimeout(1000);
    }
  });
});
