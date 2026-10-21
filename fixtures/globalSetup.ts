import { chromium, FullConfig } from '@playwright/test';
import { ConfigManager } from '../utils/configManager';
import { Logger } from '../utils/logger';

/**
 * Global Setup - runs before all tests
 * Performs authentication and saves session for reuse
 */
async function globalSetup(config: FullConfig) {
  Logger.init();
  Logger.info('=== Global Setup Started ===');
  Logger.info(`Environment: ${ConfigManager.ENV}`);
  Logger.info(`Base URL: ${ConfigManager.getBaseURL()}`);

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
	// Navigate to login page
	await page.goto(ConfigManager.getBaseURL());
	Logger.info(`Navigated to: ${ConfigManager.getBaseURL()}`);

	// Perform login
	await page.locator('#input-17').fill(ConfigManager.getUsername());
	await page.locator('#input-20').fill(ConfigManager.getPassword());
	await page.getByRole('button', { name: 'Sign In' }).click();

	// Wait for navigation
	await page.waitForURL('**/dashboard**', { timeout: 30000 }).catch(() => {
	  Logger.warn('Dashboard URL not reached');
	});

	// Save authentication state
	await page.context().storageState({ path: 'playwright/.auth/user.json' });
	Logger.info('Authentication state saved');

  } catch (error) {
	Logger.error('Global setup failed', error);
	throw error;
  } finally {
	await browser.close();
	Logger.info('=== Global Setup Completed ===');
  }
}

export default globalSetup;
