import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { DashboardPage } from '../pages/dashboardPage';
import { LeadsPage } from '../pages/leadsPage';
import { CustomersPage } from '../pages/customersPage';
import { VisitsPage } from '../pages/visitsPage';
import { JobsPage } from '../pages/jobsPage';
import { TechniciansPage } from '../pages/techniciansPage';
import { TimesheetPage } from '../pages/timesheetPage';
import { AuthAPI } from '../api/authAPI';
import { LeadsAPI } from '../api/leadsAPI';
import { CustomersAPI } from '../api/customersAPI';
import { VisitsAPI } from '../api/visitsAPI';
import { ConfigManager } from '../utils/configManager';
import { Logger } from '../utils/logger';

/**
 * Define fixture types for better TypeScript support
 */
type InnofexTestFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  leadsPage: LeadsPage;
  customersPage: CustomersPage;
  visitsPage: VisitsPage;
  jobsPage: JobsPage;
  techniciansPage: TechniciansPage;
  timesheetPage: TimesheetPage;
  authAPI: AuthAPI;
  leadsAPI: LeadsAPI;
  customersAPI: CustomersAPI;
  visitsAPI: VisitsAPI;
  authenticatedPage: Page;
};

/**
 * Custom test fixture extending base test with page objects and API clients
 */
export const test = base.extend<InnofexTestFixtures>({
  // Page Object Fixtures
  loginPage: async ({ page }, use) => {
	const loginPage = new LoginPage(page);
	Logger.info('LoginPage fixture initialized');
	await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
	const dashboardPage = new DashboardPage(page);
	Logger.info('DashboardPage fixture initialized');
	await use(dashboardPage);
  },

  leadsPage: async ({ page }, use) => {
	const leadsPage = new LeadsPage(page);
	Logger.info('LeadsPage fixture initialized');
	await use(leadsPage);
  },

  customersPage: async ({ page }, use) => {
	const customersPage = new CustomersPage(page);
	Logger.info('CustomersPage fixture initialized');
	await use(customersPage);
  },

  visitsPage: async ({ page }, use) => {
	const visitsPage = new VisitsPage(page);
	Logger.info('VisitsPage fixture initialized');
	await use(visitsPage);
  },

  jobsPage: async ({ page }, use) => {
	const jobsPage = new JobsPage(page);
	Logger.info('JobsPage fixture initialized');
	await use(jobsPage);
  },

  techniciansPage: async ({ page }, use) => {
	const techniciansPage = new TechniciansPage(page);
	Logger.info('TechniciansPage fixture initialized');
	await use(techniciansPage);
  },

  timesheetPage: async ({ page }, use) => {
	const timesheetPage = new TimesheetPage(page);
	Logger.info('TimesheetPage fixture initialized');
	await use(timesheetPage);
  },

  // API Fixtures
  authAPI: async ({}, use) => {
	const authAPI = new AuthAPI();
	Logger.info('AuthAPI fixture initialized');
	await use(authAPI);
  },

  leadsAPI: async ({}, use) => {
	const leadsAPI = new LeadsAPI();
	Logger.info('LeadsAPI fixture initialized');
	await use(leadsAPI);
  },

  customersAPI: async ({}, use) => {
	const customersAPI = new CustomersAPI();
	Logger.info('CustomersAPI fixture initialized');
	await use(customersAPI);
  },

  visitsAPI: async ({}, use) => {
	const visitsAPI = new VisitsAPI();
	Logger.info('VisitsAPI fixture initialized');
	await use(visitsAPI);
  },

  // Authenticated Page Fixture (performs login before test)
  authenticatedPage: async ({ page }, use) => {
	const loginPage = new LoginPage(page);
	Logger.info('Setting up authenticated session');

	try {
	  await loginPage.navigateToLogin();
	  await loginPage.login(ConfigManager.getUsername(), ConfigManager.getPassword());
	  Logger.info('User logged in successfully');
	  await page.waitForLoadState('networkidle').catch(() => undefined);
	} catch (error) {
	  Logger.error('Failed to authenticate', error);
	  throw error;
	}

	await use(page);

	// Cleanup - logout
	try {
	  await page.goto(ConfigManager.getBaseURL() + '/logout').catch(() => undefined);
	  Logger.info('User logged out');
	} catch (error) {
	  Logger.warn('Logout failed during cleanup', error);
	}
  },
});

export { expect } from '@playwright/test';
