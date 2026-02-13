import { test, expect } from '@playwright/test';
import { mockBsocioPublicApis } from '../shared/api-mocks';

test('debug FAQs mock', async ({ page }) => {
  // Track intercepted requests
  const interceptedUrls: string[] = [];
  const nonInterceptedUrls: string[] = [];

  page.on('request', (req) => {
    if (req.url().includes('faq') || req.url().includes('admin-dashboard')) {
      interceptedUrls.push(`${req.method()} ${req.url()}`);
    }
  });

  page.on('response', (res) => {
    if (res.url().includes('faq') || res.url().includes('admin-dashboard')) {
      nonInterceptedUrls.push(`${res.status()} ${res.url()}`);
    }
  });

  await mockBsocioPublicApis(page);
  await page.goto('/faqs');
  await page.waitForTimeout(5000);

  console.log('=== Intercepted requests ===');
  interceptedUrls.forEach((u) => console.log(u));
  console.log('=== Responses ===');
  nonInterceptedUrls.forEach((u) => console.log(u));

  // Check page content
  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('=== Page body text (first 500 chars) ===');
  console.log(bodyText.slice(0, 500));

  // Check if any FAQ text exists
  const hasFaqText = bodyText.includes('What is BSocio?');
  console.log(`FAQ text found: ${hasFaqText}`);
});
