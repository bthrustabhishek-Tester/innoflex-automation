import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface CustomerData {
  name: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
}

/**
 * CustomersPage - "Customers" module.
 * NOTE: Exact field locators were not supplied for this module.
 * Fields below follow the same accessible-name pattern used in Leads
 * (getByRole('textbox', {name: ...})) - update the `name` strings to
 * match the real labels once you inspect the live Customers form.
 */
export class CustomersPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly companyInput: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.getByRole('textbox', { name: 'Customer Name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone' });
    this.addressInput = page.getByRole('textbox', { name: 'Address' });
    this.companyInput = page.getByRole('textbox', { name: 'Company' });
  }

  async createCustomer(data: CustomerData): Promise<void> {
    await this.clickAdd();
    await this.helper.fill(this.nameInput, data.name, 'Customer Name');
    await this.helper.fill(this.emailInput, data.email, 'Email');
    await this.helper.fill(this.phoneInput, data.phone, 'Phone');
    if (data.address) await this.helper.fill(this.addressInput, data.address, 'Address');
    if (data.company) await this.helper.fill(this.companyInput, data.company, 'Company');
    await this.clickSave();
  }

  async editCustomer(existingName: string, updated: Partial<CustomerData>): Promise<void> {
    await this.editButtonFor(existingName).click();
    if (updated.name) await this.helper.fill(this.nameInput, updated.name, 'Customer Name');
    if (updated.email) await this.helper.fill(this.emailInput, updated.email, 'Email');
    if (updated.phone) await this.helper.fill(this.phoneInput, updated.phone, 'Phone');
    await this.clickSave();
  }

  async deleteCustomer(name: string): Promise<void> {
    await this.deleteButtonFor(name).click();
    await this.confirmDelete();
  }
}
