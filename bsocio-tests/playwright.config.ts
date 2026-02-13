import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const BSOCIO_BASE_URL = process.env.BSOCIO_BASE_URL || 'http://localhost:3000';
const ADMIN_BASE_URL = process.env.ADMIN_BASE_URL || 'http://localhost:3001';
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:7000';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    ...(process.env.CI ? [['github', {}] as const] : []),
  ],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: Number(process.env.ACTION_TIMEOUT) || 15000,
    navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 30000,
  },

  projects: [
    // ── BSocio Landing Page ──────────────────────────────
    {
      name: 'bsocio-chromium',
      testDir: './tests/bsocio',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: BSOCIO_BASE_URL,
      },
    },
    {
      name: 'bsocio-firefox',
      testDir: './tests/bsocio',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: BSOCIO_BASE_URL,
      },
    },
    {
      name: 'bsocio-webkit',
      testDir: './tests/bsocio',
      use: {
        ...devices['Desktop Safari'],
        baseURL: BSOCIO_BASE_URL,
      },
    },
    {
      name: 'bsocio-mobile',
      testDir: './tests/bsocio',
      use: {
        ...devices['iPhone 14'],
        baseURL: BSOCIO_BASE_URL,
      },
    },

    // ── BSocio Admin Panel ───────────────────────────────
    {
      name: 'admin-chromium',
      testDir: './tests/admin',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: ADMIN_BASE_URL,
      },
    },
    {
      name: 'admin-firefox',
      testDir: './tests/admin',
      use: {
        ...devices['Desktop Firefox'],
        baseURL: ADMIN_BASE_URL,
      },
    },
    {
      name: 'admin-webkit',
      testDir: './tests/admin',
      use: {
        ...devices['Desktop Safari'],
        baseURL: ADMIN_BASE_URL,
      },
    },
  ],

  /* Start dev servers before running tests */
  webServer: [
    {
      command: 'cd ../bsocio && npm run dev',
      url: BSOCIO_BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `cd ../bsocio-admin && npm run dev -- --port 3001`,
      url: ADMIN_BASE_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
