import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const ENV = process.env.ENV || 'stg';
const BASE_URL_MAP: Record<string, string | undefined> = {
  dev: process.env.DEV_URL,
  stg: process.env.STG_URL,
  uat: process.env.UAT_URL,
  prod: process.env.PROD_URL,
};

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : Number(process.env.RETRIES) || 0,
  workers: process.env.CI ? 2 : Number(process.env.WORKERS) || 4,

  // Multiple reporters: HTML (built-in) + Allure + list (console) + JUnit (CI-friendly)
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'reports/allure-results', detail: true, suiteTitle: true }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
  ],

  use: {
    baseURL: BASE_URL_MAP[ENV],
    headless: (process.env.HEADLESS || 'true').toLowerCase() !== 'false',
    actionTimeout: Number(process.env.DEFAULT_TIMEOUT) || 30_000,
    navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 45_000,

    // Debugging artifacts
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    ignoreHTTPSErrors: true,
  },

  projects: [
    // Runs once before every other project - performs UI login and saves storage state
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge', storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },

    // API tests don't need a browser/storage state
    {
      name: 'api',
      testDir: './tests/api',
      use: {},
    },

    // Destructive & Resiliency API tests
    {
      name: 'destructive',
      testDir: './tests/destructive',
      use: {
        baseURL: process.env.BASE_URL || 'https://stg-innoflex.businessthrust.com',
      },
    },
  ],
});
