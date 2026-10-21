import { Page, Locator, expect } from '@playwright/test';
import { Helper } from '../utils/helper';
import { logger } from '../utils/logger';

/**
 * BasePage - common functionality shared by every Page Object.
 * All module-specific pages (LeadsPage, CustomersPage, etc.) extend this.
 */
export class BasePage {
  readonly page: Page;
  readonly helper: Helper;

  // Common layout elements reused across list-style modules (Leads, Customers, Visits, Jobs...)
  readonly pageHeader: Locator;
  readonly addButton: Locator;
  readonly searchField: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly successToast: Locator;
  readonly errorToast: Locator;
  readonly loadingSpinner: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new Helper(page);

    this.pageHeader = page.locator('h1, .page-title, .content-header h1');
    this.addButton = page.getByRole('link', { name: /create|add/i }).first();
    this.searchField = page.getByPlaceholder(/search/i);
    this.saveButton = page.getByRole('button', { name: /save/i });
    this.cancelButton = page.getByRole('button', { name: /cancel/i });
    this.successToast = page.locator('.toast-success, .alert-success, [role="alert"]');
    this.errorToast = page.locator('.toast-error, .alert-danger, [role="alert"].error');
    this.loadingSpinner = page.locator('.loading, .spinner, .overlay-loading');
  }

  /** Row-level Edit button for a given record name in a list/table view */
  editButtonFor(recordName: string): Locator {
    return this.page
      .locator('tr', { hasText: recordName })
      .getByRole('link', { name: /edit/i })
      .or(this.page.locator('tr', { hasText: recordName }).getByRole('button', { name: /edit/i }));
  }

  /** Row-level Delete button for a given record name in a list/table view */
  deleteButtonFor(recordName: string): Locator {
    return this.page
      .locator('tr', { hasText: recordName })
      .getByRole('link', { name: /delete/i })
      .or(this.page.locator('tr', { hasText: recordName }).getByRole('button', { name: /delete/i }));
  }

  /** Row locator for a given record name - useful for assertions */
  rowFor(recordName: string): Locator {
    return this.page.locator('tr', { hasText: recordName });
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');
    if (await this.loadingSpinner.isVisible().catch(() => false)) {
      await this.loadingSpinner.waitFor({ state: 'hidden', timeout: 15000 }).catch(() => undefined);
    }
  }

  async search(term: string): Promise<void> {
    await this.helper.fill(this.searchField, term, 'Search field');
    await this.page.keyboard.press('Enter');
    await this.waitForPageLoad();
  }

  async clickAdd(): Promise<void> {
    await this.helper.click(this.addButton, 'Add/Create button');
  }

  async clickSave(): Promise<void> {
    await this.helper.click(this.saveButton, 'Save button');
  }

  async clickCancel(): Promise<void> {
    await this.helper.click(this.cancelButton, 'Cancel button');
  }

  async confirmDelete(): Promise<void> {
    const confirmBtn = this.page.getByRole('button', { name: /confirm|yes|ok|delete/i }).last();
    await confirmBtn.waitFor({ state: 'visible' });
    await confirmBtn.click();
  }

  async expectSuccessToast(message?: string): Promise<void> {
    await expect(this.successToast.first()).toBeVisible({ timeout: 10000 });
    if (message) {
      await expect(this.successToast.first()).toContainText(message);
    }
    logger.info('Success toast verified');
  }

  async expectRecordVisible(recordName: string): Promise<void> {
    await expect(this.rowFor(recordName)).toBeVisible();
  }

  async expectRecordNotVisible(recordName: string): Promise<void> {
    await expect(this.rowFor(recordName)).toHaveCount(0);
  }
}
