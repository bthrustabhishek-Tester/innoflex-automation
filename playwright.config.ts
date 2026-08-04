import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export const STORAGE_STATE = path.join(__dirname, 'playwright/.auth/user.json');

export default defineConfig({
  testDir: './tests',
  /* Default timeout for each test in milliseconds */
  timeout: 60000,
  /* Run tests sequentially in single worker to use 1 window */
  fullyParallel: false,
  workers: 1,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Configure multiple reporters (HTML, Terminal List, JSON, JUnit XML, Custom Summary Reporter) */
  reporter: [
    ['./utils/CustomReporter.ts'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }],
  ],
  /* Shared settings for all projects */
  use: {
    /* Base URL */
    baseURL: 'https://stg-innoflex.businessthrust.com',
    /* Capture screenshots, trace, and video on failure */
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  /* Configure projects for major browsers in strict execution sequence */
  projects: [
    // 0. Global Auth Setup
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // Master Single Window Suite (Opens 1 browser window for ALL tests)
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
    // 1. Login Tests (Run first)
    {
      name: 'login',
      testMatch: /tests[\\\/]login[\\\/].*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    // 2. Lead Tests (Run second)
    {
      name: 'lead',
      testMatch: /tests[\\\/]lead[\\\/].*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['login'],
    },
    // 3. Customer Tests (Run third)
    {
      name: 'customer',
      testMatch: /tests[\\\/]customer[\\\/].*\.spec\.ts/,
      use: { 
        ...devices['Desktop Chrome'],
        storageState: STORAGE_STATE,
      },
      dependencies: ['lead'],
    },
  ],
});
