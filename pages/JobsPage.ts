import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface JobData {
  title: string;
  customer: string;
  assignedTechnician?: string;
  scheduledDate: string;
  priority?: 'Low' | 'Medium' | 'High';
  description?: string;
}

/**
 * JobsPage - "Jobs" module.
 * Field locators follow the same accessible-name pattern; update once verified.
 */
export class JobsPage extends BasePage {
  readonly titleInput: Locator;
  readonly customerDropdown: Locator;
  readonly technicianDropdown: Locator;
  readonly scheduledDateInput: Locator;
  readonly priorityDropdown: Locator;
  readonly descriptionInput: Locator;

  constructor(page: Page) {
    super(page);
    this.titleInput = page.getByRole('textbox', { name: 'Job Title' });
    this.customerDropdown = page.getByRole('textbox', { name: 'Customer' });
    this.technicianDropdown = page.getByRole('textbox', { name: 'Assigned Technician' });
    this.scheduledDateInput = page.getByRole('textbox', { name: 'Scheduled Date' });
    this.priorityDropdown = page.getByRole('textbox', { name: 'Priority' });
    this.descriptionInput = page.getByRole('textbox', { name: 'Description' });
  }

  async createJob(data: JobData): Promise<void> {
    await this.clickAdd();
    await this.helper.fill(this.titleInput, data.title, 'Job Title');
    await this.helper.selectFromCustomDropdown(this.customerDropdown, data.customer);
    if (data.assignedTechnician) {
      await this.helper.selectFromCustomDropdown(this.technicianDropdown, data.assignedTechnician);
    }
    await this.helper.fill(this.scheduledDateInput, data.scheduledDate, 'Scheduled Date');
    if (data.priority) {
      await this.helper.selectFromCustomDropdown(this.priorityDropdown, data.priority);
    }
    if (data.description) {
      await this.helper.fill(this.descriptionInput, data.description, 'Description');
    }
    await this.clickSave();
  }

  async editJob(existingTitle: string, updated: Partial<JobData>): Promise<void> {
    await this.editButtonFor(existingTitle).click();
    if (updated.title) await this.helper.fill(this.titleInput, updated.title, 'Job Title');
    if (updated.scheduledDate) await this.helper.fill(this.scheduledDateInput, updated.scheduledDate, 'Scheduled Date');
    await this.clickSave();
  }

  async deleteJob(title: string): Promise<void> {
    await this.deleteButtonFor(title).click();
    await this.confirmDelete();
  }
}
