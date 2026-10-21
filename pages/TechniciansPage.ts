import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface TechnicianData {
  name: string;
  email: string;
  phone: string;
  skill?: string;
}

/**
 * TechniciansPage - "Technicians" module.
 * Field locators follow the same accessible-name pattern; update once verified.
 */
export class TechniciansPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly skillDropdown: Locator;
  readonly statusToggle: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.getByRole('textbox', { name: 'Technician Name' });
    this.emailInput = page.getByRole('textbox', { name: 'Email' });
    this.phoneInput = page.getByRole('textbox', { name: 'Phone' });
    this.skillDropdown = page.getByRole('textbox', { name: 'Skill' });
    this.statusToggle = page.locator('.status-toggle, [role="switch"]');
  }

  async createTechnician(data: TechnicianData): Promise<void> {
    await this.clickAdd();
    await this.helper.fill(this.nameInput, data.name, 'Technician Name');
    await this.helper.fill(this.emailInput, data.email, 'Email');
    await this.helper.fill(this.phoneInput, data.phone, 'Phone');
    if (data.skill) {
      await this.helper.selectFromCustomDropdown(this.skillDropdown, data.skill);
    }
    await this.clickSave();
  }

  async deleteTechnician(name: string): Promise<void> {
    await this.deleteButtonFor(name).click();
    await this.confirmDelete();
  }
}
