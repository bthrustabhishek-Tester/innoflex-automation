import { Page, expect } from '@playwright/test';
import { Logger } from './logger';

/**
 * Helpers - Reusable helper functions for common test operations
 */
export class Helpers {
  /**
   * Wait for element to be visible
   */
  static async waitForElement(page: Page, selector: string, timeout: number = 10000): Promise<void> {
	try {
	  await page.waitForSelector(selector, { timeout });
	  Logger.debug(`Element visible: ${selector}`);
	} catch (error) {
	  Logger.error(`Element not visible within ${timeout}ms: ${selector}`, error);
	  throw error;
	}
  }

  /**
   * Click on element
   */
  static async click(page: Page, selector: string): Promise<void> {
	try {
	  await page.click(selector);
	  Logger.info(`Clicked on element: ${selector}`);
	} catch (error) {
	  Logger.error(`Failed to click element: ${selector}`, error);
	  throw error;
	}
  }

  /**
   * Fill text input
   */
  static async fill(page: Page, selector: string, text: string): Promise<void> {
	try {
	  await page.fill(selector, text);
	  Logger.info(`Filled text in element: ${selector}`);
	} catch (error) {
	  Logger.error(`Failed to fill text in element: ${selector}`, error);
	  throw error;
	}
  }

  /**
   * Get text from element
   */
  static async getText(page: Page, selector: string): Promise<string> {
	try {
	  const text = await page.textContent(selector);
	  Logger.debug(`Got text from element: ${selector} -> ${text}`);
	  return text || '';
	} catch (error) {
	  Logger.error(`Failed to get text from element: ${selector}`, error);
	  throw error;
	}
  }

  /**
   * Check if element is visible
   */
  static async isElementVisible(page: Page, selector: string): Promise<boolean> {
	try {
	  const isVisible = await page.isVisible(selector);
	  Logger.debug(`Element visibility for ${selector}: ${isVisible}`);
	  return isVisible;
	} catch (error) {
	  Logger.debug(`Element not found: ${selector}`, error);
	  return false;
	}
  }

  /**
   * Check if element is enabled
   */
  static async isElementEnabled(page: Page, selector: string): Promise<boolean> {
	try {
	  const isEnabled = await page.isEnabled(selector);
	  Logger.debug(`Element enabled status for ${selector}: ${isEnabled}`);
	  return isEnabled;
	} catch (error) {
	  Logger.debug(`Failed to check if element is enabled: ${selector}`, error);
	  return false;
	}
  }

  /**
   * Wait for navigation
   */
  static async waitForNavigation(page: Page, callback: () => Promise<void>, timeout: number = 30000): Promise<void> {
	try {
	  await Promise.all([page.waitForNavigation({ timeout }), callback()]);
	  Logger.info('Page navigation completed');
	} catch (error) {
	  Logger.warn('Navigation timeout or error', error);
	}
  }

  /**
   * Get page title
   */
  static async getPageTitle(page: Page): Promise<string> {
	const title = await page.title();
	Logger.debug(`Page title: ${title}`);
	return title;
  }

  /**
   * Get page URL
   */
  static async getPageURL(page: Page): Promise<string> {
	const url = page.url();
	Logger.debug(`Page URL: ${url}`);
	return url;
  }

  /**
   * Reload page
   */
  static async reloadPage(page: Page): Promise<void> {
	try {
	  await page.reload();
	  Logger.info('Page reloaded');
	} catch (error) {
	  Logger.error('Failed to reload page', error);
	  throw error;
	}
  }

  /**
   * Navigate to URL
   */
  static async navigateTo(page: Page, url: string): Promise<void> {
	try {
	  await page.goto(url, { waitUntil: 'networkidle' });
	  Logger.info(`Navigated to: ${url}`);
	} catch (error) {
	  Logger.error(`Failed to navigate to: ${url}`, error);
	  throw error;
	}
  }

  /**
   * Select option from dropdown
   */
  static async selectDropdown(page: Page, selector: string, value: string): Promise<void> {
	try {
	  await page.selectOption(selector, value);
	  Logger.info(`Selected option in dropdown: ${selector} -> ${value}`);
	} catch (error) {
	  Logger.error(`Failed to select option in dropdown: ${selector}`, error);
	  throw error;
	}
  }

  /**
   * Check checkbox
   */
  static async checkCheckbox(page: Page, selector: string): Promise<void> {
	try {
	  const isChecked = await page.isChecked(selector);
	  if (!isChecked) {
		await page.check(selector);
		Logger.info(`Checkbox checked: ${selector}`);
	  }
	} catch (error) {
	  Logger.error(`Failed to check checkbox: ${selector}`, error);
	  throw error;
	}
  }

  /**
   * Uncheck checkbox
   */
  static async uncheckCheckbox(page: Page, selector: string): Promise<void> {
	try {
	  const isChecked = await page.isChecked(selector);
	  if (isChecked) {
		await page.uncheck(selector);
		Logger.info(`Checkbox unchecked: ${selector}`);
	  }
	} catch (error) {
	  Logger.error(`Failed to uncheck checkbox: ${selector}`, error);
	  throw error;
	}
  }

  /**
   * Take screenshot
   */
  static async takeScreenshot(page: Page, fileName: string): Promise<void> {
	try {
	  const path = `screenshots/${fileName}.png`;
	  await page.screenshot({ path });
	  Logger.info(`Screenshot saved: ${path}`);
	} catch (error) {
	  Logger.error(`Failed to take screenshot: ${fileName}`, error);
	}
  }

  /**
   * Wait for timeout
   */
  static async wait(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retry function with exponential backoff
   */
  static async retry<T>(
	fn: () => Promise<T>,
	maxAttempts: number = 3,
	delay: number = 1000,
  ): Promise<T> {
	let lastError: Error | undefined;

	for (let attempt = 1; attempt <= maxAttempts; attempt++) {
	  try {
		return await fn();
	  } catch (error) {
		lastError = error instanceof Error ? error : new Error(String(error));
		Logger.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
		if (attempt < maxAttempts) {
		  await this.wait(delay);
		  delay *= 2; // Exponential backoff
		}
	  }
	}

	throw lastError;
  }

  /**
   * Get all text content from page
   */
  static async getPageContent(page: Page): Promise<string> {
	const content = await page.content();
	return content;
  }

  /**
   * Accept browser alert
   */
  static async acceptAlert(page: Page): Promise<void> {
	page.on('dialog', async (dialog) => {
	  Logger.info(`Alert dialog: ${dialog.message()}`);
	  await dialog.accept();
	});
  }

  /**
   * Generate random string
   */
  static generateRandomString(length: number = 10): string {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
	  result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
  }

  /**
   * Generate random email
   */
  static generateRandomEmail(): string {
	return `test${this.generateRandomString(8)}@example.com`;
  }

  /**
   * Generate random number
   */
  static generateRandomNumber(min: number = 0, max: number = 1000): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Format date
   */
  static formatDate(date: Date, format: string = 'YYYY-MM-DD'): string {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');
	return format.replace('YYYY', String(year)).replace('MM', month).replace('DD', day);
  }

  /**
   * Get today's date
   */
  static getTodayDate(): string {
	return this.formatDate(new Date());
  }

  /**
   * Get future date
   */
  static getFutureDate(days: number): string {
	const futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + days);
	return this.formatDate(futureDate);
  }
}

export default Helpers;
