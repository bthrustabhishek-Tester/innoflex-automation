import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface VisitData {
  title: string;
  customer: string;
  technician?: string;
  date: string;
  notes?: string;
}

/**
 * VisitsPage - "Visits" module.
 * Field locators follow the same accessible-name pattern; update the
 * `name` strings to match the real labels once verified against the app.
 */
export class VisitsPage extends BasePage {
  readonly titleInput: Locator;
  readonly customerDropdown: Locator;
  readonly technicianDropdown: Locator;
  readonly dateInput: Locator;
  readonly notesInput: Locator;
  readonly cancelVisitButton: Locator;
  readonly statusBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.titleInput = page.getByRole('textbox', { name: 'Title' });
    this.customerDropdown = page.getByRole('textbox', { name: 'Customer' });
    this.technicianDropdown = page.getByRole('textbox', { name: 'Technician' });
    this.dateInput = page.getByRole('textbox', { name: 'Date' });
    this.notesInput = page.getByRole('textbox', { name: 'Notes' });
    this.cancelVisitButton = page.getByRole('button', { name: /cancel visit/i });
    this.statusBadge = page.locator('.status-badge, .chip-status');
  }

  async createVisit(data: VisitData): Promise<void> {
    await this.clickAdd();
    await this.helper.fill(this.titleInput, data.title, 'Title');
    await this.helper.selectFromCustomDropdown(this.customerDropdown, data.customer);
    if (data.technician) {
      await this.helper.selectFromCustomDropdown(this.technicianDropdown, data.technician);
    }
    await this.helper.fill(this.dateInput, data.date, 'Date');
    if (data.notes) await this.helper.fill(this.notesInput, data.notes, 'Notes');
    await this.clickSave();
  }

  async cancelVisit(title: string): Promise<void> {
    await this.rowFor(title).getByRole('button', { name: /view|open/i }).click();
    await this.helper.click(this.cancelVisitButton, 'Cancel Visit button');
    await this.confirmDelete(); // reuse the generic confirm-dialog handler
  }
}
