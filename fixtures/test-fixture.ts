import { test as base, APIRequestContext, request } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LeadsPage } from '../pages/LeadsPage';
import { CustomersPage } from '../pages/CustomersPage';
import { VisitsPage } from '../pages/VisitsPage';
import { JobsPage } from '../pages/JobsPage';
import { TechniciansPage } from '../pages/TechniciansPage';
import { TimesheetPage } from '../pages/TimesheetPage';
import { config } from '../utils/config';
import { authApi } from '../api/auth.api';

/**
 * Custom fixture types - every Page Object is injected automatically,
 * so test files never need to write `new LoginPage(page)` themselves.
 */
type Fixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  leadsPage: LeadsPage;
  customersPage: CustomersPage;
  visitsPage: VisitsPage;
  jobsPage: JobsPage;
  techniciansPage: TechniciansPage;
  timesheetPage: TimesheetPage;
  /** Page that is already logged in - use for any test that needs an authenticated session */
  authenticatedPage: LoginPage;
  /** Raw Playwright API request context, pre-configured with baseURL */
  apiContext: APIRequestContext;
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  leadsPage: async ({ page }, use) => {
    await use(new LeadsPage(page));
  },

  customersPage: async ({ page }, use) => {
    await use(new CustomersPage(page));
  },

  visitsPage: async ({ page }, use) => {
    await use(new VisitsPage(page));
  },

  jobsPage: async ({ page }, use) => {
    await use(new JobsPage(page));
  },

  techniciansPage: async ({ page }, use) => {
    await use(new TechniciansPage(page));
  },

  timesheetPage: async ({ page }, use) => {
    await use(new TimesheetPage(page));
  },

  // Performs UI login once per test and hands back a ready-to-use, authenticated page context
  authenticatedPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.loginWithDefaultCreds();
    await login.expectLoginSuccess();
    await use(login);
  },

  apiContext: async ({}, use) => {
    const context = await request.newContext({
      baseURL: config.apiBaseUrl,
      extraHTTPHeaders: { 'Content-Type': 'application/json' },
    });
    await use(context);
    await context.dispose();
  },
});

export { expect } from '@playwright/test';

/**
 * Helper to obtain a bearer token for API tests outside of the fixture
 * (e.g. in beforeAll hooks). Wraps authApi.loginAndStoreToken().
 */
export async function getAuthToken(): Promise<string> {
  const { token } = await authApi.loginAndStoreToken();
  return token;
}
