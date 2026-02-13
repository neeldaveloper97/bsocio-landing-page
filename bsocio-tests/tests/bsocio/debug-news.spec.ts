import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../shared/api-mocks';
import { mockNewsArticles } from '../shared/mock-data';

test('debug news page rendering', async ({ page }) => {
  // Track API calls
  const apiCalls: string[] = [];
  page.on('request', (req) => {
    if (req.url().includes('admin-dashboard/news')) {
      apiCalls.push(`REQUEST: ${req.method()} ${req.url()}`);
    }
  });
  page.on('response', (res) => {
    if (res.url().includes('admin-dashboard/news')) {
      apiCalls.push(`RESPONSE: ${res.status()} ${res.url()}`);
    }
  });

  // Log console errors
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log(`PAGE ERROR: ${msg.text()}`);
    }
  });

  await mockBsocioPublicApis(page);
  await page.goto('/news-media');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  console.log('=== API CALLS ===');
  for (const call of apiCalls) console.log(call);

  console.log('=== PAGE CONTENT ===');
  const mainText = await page.locator('main').textContent();
  console.log(mainText?.substring(0, 2000));

  console.log('=== ARTICLE TITLES ===');
  for (const article of mockNewsArticles.data) {
    const count = await page.getByText(article.title).count();
    console.log(`"${article.title}": count=${count}`);
  }

  console.log('=== ALL H3 ===');
  const h3s = await page.locator('h3').allTextContents();
  console.log(h3s);

  console.log('=== DATA-CATEGORY attrs ===');
  const cards = await page.locator('[data-category]').count();
  console.log(`Cards with data-category: ${cards}`);
});
