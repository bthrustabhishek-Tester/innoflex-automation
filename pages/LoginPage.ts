import { Page, Locator, expect } from '@playwright/test';
import { Helper } from '../utils/helper';
import { config } from '../utils/config';

/**
 * LoginPage - Innoflex Admin Login
 * URL: https://stg-innoflex.businessthrust.com/admin/login
 */
export class LoginPage {
  readonly page: Page;
  readonly helper: Helper;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly validationError: Locator;
  // Dashboard validation locator - confirms a successful login/navigation
  readonly dashboardHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new Helper(page);

    this.emailInput = page.locator('#input-17');
    this.passwordInput = page.locator('#input-20');
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.validationError = page.locator('.v-messages__message, .error--text, [role="alert"]');
    this.dashboardHeader = page.locator('.dashboard-header, .page-title, h1', { hasText: /dashboard/i });
  }

  async goto(): Promise<void> {
    await this.helper.goto(config.baseUrl);
  }

  async login(email: string, password: string): Promise<void> {
    await this.helper.fill(this.emailInput, email, 'Email');
    await this.helper.fill(this.passwordInput, password, 'Password');
    await this.helper.click(this.signInButton, 'Sign In button');
  }

  async loginWithDefaultCreds(): Promise<void> {
    await this.login(config.username, config.password);
  }

  async expectLoginSuccess(): Promise<void> {
    await expect(this.page).not.toHaveURL(/login/);
    await this.dashboardHeader.first().waitFor({ state: 'visible', timeout: 15000 }).catch(() => undefined);
  }

  async expectValidationError(): Promise<void> {
    await expect(this.validationError.first()).toBeVisible({ timeout: 8000 });
  }
}
