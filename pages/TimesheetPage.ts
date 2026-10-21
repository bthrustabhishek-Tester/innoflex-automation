import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface TimesheetEntryData {
  technician: string;
  job?: string;
  date: string;
  hoursWorked: string;
  notes?: string;
}

/**
 * TimesheetPage - "Timesheet" module.
 * Field locators follow the same accessible-name pattern; update once verified.
 */
export class TimesheetPage extends BasePage {
  readonly technicianDropdown: Locator;
  readonly jobDropdown: Locator;
  readonly dateInput: Locator;
  readonly hoursWorkedInput: Locator;
  readonly notesInput: Locator;
  readonly approveButton: Locator;
  readonly rejectButton: Locator;

  constructor(page: Page) {
    super(page);
    this.technicianDropdown = page.getByRole('textbox', { name: 'Technician' });
    this.jobDropdown = page.getByRole('textbox', { name: 'Job' });
    this.dateInput = page.getByRole('textbox', { name: 'Date' });
    this.hoursWorkedInput = page.getByRole('textbox', { name: 'Hours Worked' });
    this.notesInput = page.getByRole('textbox', { name: 'Notes' });
    this.approveButton = page.getByRole('button', { name: /approve/i });
    this.rejectButton = page.getByRole('button', { name: /reject/i });
  }

  async createEntry(data: TimesheetEntryData): Promise<void> {
    await this.clickAdd();
    await this.helper.selectFromCustomDropdown(this.technicianDropdown, data.technician);
    if (data.job) {
      await this.helper.selectFromCustomDropdown(this.jobDropdown, data.job);
    }
    await this.helper.fill(this.dateInput, data.date, 'Date');
    await this.helper.fill(this.hoursWorkedInput, data.hoursWorked, 'Hours Worked');
    if (data.notes) await this.helper.fill(this.notesInput, data.notes, 'Notes');
    await this.clickSave();
  }

  async approveEntry(technician: string): Promise<void> {
    await this.rowFor(technician).getByRole('button', { name: /approve/i }).click();
  }

  async rejectEntry(technician: string): Promise<void> {
    await this.rowFor(technician).getByRole('button', { name: /reject/i }).click();
  }
}
