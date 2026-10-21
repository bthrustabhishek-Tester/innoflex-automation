import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface LeadData {
  title: string;
  companyName: string;
  contactName: string;
  emailAddress: string;
  source?: string;
  assignTo?: string;
}

/**
 * LeadsPage - "Leads" module (All Leads list + Create/Edit Lead form)
 */
export class LeadsPage extends BasePage {
  // Create Lead form fields (exact locators as supplied)
  readonly titleInput: Locator;
  readonly companyName: Locator;
  readonly contactName: Locator;
  readonly emailAddress: Locator;
  readonly sourceDropdown: Locator;
  readonly assignToDropdown: Locator;

  constructor(page: Page) {
    super(page);

    this.titleInput = page.getByRole('textbox', { name: 'Title' });
    this.companyName = page.getByRole('textbox', { name: 'Company Name' });
    this.contactName = page.getByRole('textbox', { name: 'Contact Name' });
    this.emailAddress = page.getByRole('textbox', { name: 'Email Address' });
    this.sourceDropdown = page.getByRole('textbox', { name: 'Source' });
    this.assignToDropdown = page.getByText('Assign To');
  }

  async fillLeadForm(data: LeadData): Promise<void> {
    await this.helper.fill(this.titleInput, data.title, 'Title');
    await this.helper.fill(this.companyName, data.companyName, 'Company Name');
    await this.helper.fill(this.contactName, data.contactName, 'Contact Name');
    await this.helper.fill(this.emailAddress, data.emailAddress, 'Email Address');

    if (data.source) {
      await this.helper.selectFromCustomDropdown(this.sourceDropdown, data.source);
    }
    if (data.assignTo) {
      await this.helper.click(this.assignToDropdown, 'Assign To');
      await this.page.getByRole('option', { name: data.assignTo }).first().click();
    }
  }

  async createLead(data: LeadData): Promise<void> {
    await this.fillLeadForm(data);
    await this.clickSave();
  }

  async editLead(existingTitle: string, updated: Partial<LeadData>): Promise<void> {
    await this.editButtonFor(existingTitle).click();
    if (updated.title) await this.helper.fill(this.titleInput, updated.title, 'Title');
    if (updated.companyName) await this.helper.fill(this.companyName, updated.companyName, 'Company Name');
    if (updated.contactName) await this.helper.fill(this.contactName, updated.contactName, 'Contact Name');
    if (updated.emailAddress) await this.helper.fill(this.emailAddress, updated.emailAddress, 'Email Address');
    await this.clickSave();
  }

  async deleteLead(title: string): Promise<void> {
    await this.deleteButtonFor(title).click();
    await this.confirmDelete();
  }

  async searchLead(term: string): Promise<void> {
    await this.search(term);
  }
}
