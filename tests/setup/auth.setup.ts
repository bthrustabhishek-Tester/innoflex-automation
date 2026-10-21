import { test as setup } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { config } from '../../utils/config';

/**
 * Global auth setup - runs once before all other test projects (see playwright.config.ts
 * "setup" project + dependencies). Logs in via the UI once and saves the browser
 * storage state (cookies/localStorage) to disk so every subsequent test starts
 * already authenticated, without repeating the login flow.
 */
const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(config.username, config.password);
  await loginPage.expectLoginSuccess();
  await page.context().storageState({ path: authFile });
});
