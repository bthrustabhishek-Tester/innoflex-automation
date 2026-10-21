import { Page, Locator, expect } from '@playwright/test';
import { logger } from './logger';

/**
 * Generic, reusable helper functions used across Page Objects and tests.
 * Keeping wait/retry/assert logic here avoids duplication in every Page class.
 */
export class Helper {
  constructor(private page: Page) {}

  /** Navigate to a URL and wait for the DOM to load */
  async goto(url: string): Promise<void> {
    logger.step(`Navigating to: ${url}`);
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  /** Click with an explicit wait for visibility + enabled state */
  async click(locator: Locator, description = 'element'): Promise<void> {
    logger.step(`Clicking: ${description}`);
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  /** Fill a text field after clearing it */
  async fill(locator: Locator, value: string, description = 'field'): Promise<void> {
    logger.step(`Filling "${description}" with: ${value}`);
    await locator.waitFor({ state: 'visible' });
    await locator.fill('');
    await locator.fill(value);
  }

  /** Select an option from a native <select> dropdown by visible label */
  async selectByLabel(locator: Locator, label: string): Promise<void> {
    logger.step(`Selecting option "${label}"`);
    await locator.selectOption({ label });
  }

  /** Select from a custom (non-native) dropdown: click to open, then click matching option */
  async selectFromCustomDropdown(dropdown: Locator, optionText: string): Promise<void> {
    await dropdown.click();
    const option = this.page.getByRole('option', { name: optionText }).first();
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  /** Assert element text equals / contains expected value */
  async assertText(locator: Locator, expected: string, exact = false): Promise<void> {
    if (exact) {
      await expect(locator).toHaveText(expected);
    } else {
      await expect(locator).toContainText(expected);
    }
  }

  /** Assert element is visible within default timeout */
  async assertVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  /** Wait for a toast / success message to appear and contain given text */
  async waitForToast(text: string): Promise<void> {
    const toast = this.page.getByText(text, { exact: false }).first();
    await expect(toast).toBeVisible({ timeout: 10000 });
  }

  /** Take a named screenshot (also auto-captured on failure via config) */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}-${Date.now()}.png`, fullPage: true });
  }

  /** Retry an async action N times with a delay - useful for flaky network/UI states */
  async retry<T>(action: () => Promise<T>, retries = 3, delayMs = 1000): Promise<T> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await action();
      } catch (err) {
        lastError = err;
        logger.warn(`Retry ${attempt}/${retries} failed: ${(err as Error).message}`);
        await this.page.waitForTimeout(delayMs);
      }
    }
    throw lastError;
  }

  /** Generate a unique string, e.g. for unique lead titles/emails in tests */
  static uniqueString(prefix = 'QA'): string {
    return `${prefix}_${Date.now()}`;
  }

  /** Generate a unique email address for test data */
  static uniqueEmail(prefix = 'qa.lead'): string {
    return `${prefix}+${Date.now()}@test-automation.com`;
  }
}
