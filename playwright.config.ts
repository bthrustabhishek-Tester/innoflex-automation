import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import * as dotenv from 'dotenv';
dotenv.config();

export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

const ENV = process.env.ENV || 'stg';
const BASE_URL_MAP: Record<string, string | undefined> = {
  dev: process.env.DEV_URL,
  stg: process.env.STG_URL || 'https://stg-innoflex.businessthrust.com',
  uat: process.env.UAT_URL,
  prod: process.env.PROD_URL,
};

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : Number(process.env.RETRIES) || 0,
  workers: process.env.CI ? 2 : Number(process.env.WORKERS) || 2,

  // Multiple reporters: HTML + Allure + list (console) + JUnit
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'never' }],
    ['allure-playwright', { outputFolder: 'reports/allure-results', detail: true, suiteTitle: true }],
    ['junit', { outputFile: 'reports/junit-results.xml' }],
    ['json', { outputFile: 'reports/test-results.json' }],
  ],

  use: {
    baseURL: BASE_URL_MAP[ENV] || 'https://stg-innoflex.businessthrust.com',
    headless: (process.env.HEADLESS || 'true').toLowerCase() !== 'false',
    actionTimeout: Number(process.env.DEFAULT_TIMEOUT) || 30_000,
    navigationTimeout: Number(process.env.NAVIGATION_TIMEOUT) || 45_000,

    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',

    ignoreHTTPSErrors: true,
  },

  projects: [
    // 0. Global Auth Setup
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },

    // Master Single Window Suite
    {
      name: 'single-window',
      testMatch: /.*MasterSequentialRunner\.spec\.ts/,
      timeout: 180000,
      use: { ...devices['Desktop Chrome'] },
    },

    // End-to-End Workflow Project
    {
      name: 'e2e',
      testMatch: /.*EndToEndWorkflow\.spec\.ts/,
      timeout: 180000,
      use: { ...devices['Desktop Chrome'] },
    },

    // Multi-browser projects
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge', storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'], storageState: STORAGE_STATE },
      dependencies: ['setup'],
    },

    // API tests (No browser/storage state required)
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: process.env.API_BASE_URL_STG || 'https://stg-innoflex.businessthrust.com/api',
      },
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
