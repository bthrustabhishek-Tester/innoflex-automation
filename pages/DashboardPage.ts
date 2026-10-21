import { Page, Locator } from '@playwright/test';
import { Helper } from '../utils/helper';

/**
 * DashboardPage - Landing page after successful login.
 * Exposes the main left-nav menu links used to navigate to every module.
 */
export class DashboardPage {
  readonly page: Page;
  readonly helper: Helper;

  readonly dashboardHeader: Locator;

  // Left navigation - top level menus
  readonly leadsMenu: Locator;
  readonly customersMenu: Locator;
  readonly visitsMenu: Locator;
  readonly jobsMenu: Locator;
  readonly techniciansMenu: Locator;
  readonly timesheetMenu: Locator;

  // Leads sub-menu (per provided locators)
  readonly allLeadsLink: Locator;
  readonly createLeadLink: Locator;

  readonly userAvatar: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new Helper(page);

    this.dashboardHeader = page.locator('.dashboard-header, .page-title, h1', { hasText: /dashboard/i });

    this.leadsMenu = page.getByRole('link', { name: 'Leads' });
    this.customersMenu = page.getByRole('link', { name: 'Customers' });
    this.visitsMenu = page.getByRole('link', { name: 'Visits' });
    this.jobsMenu = page.getByRole('link', { name: 'Jobs' });
    this.techniciansMenu = page.getByRole('link', { name: 'Technicians' });
    this.timesheetMenu = page.getByRole('link', { name: 'Timesheet' });

    this.allLeadsLink = page.getByRole('link', { name: 'All Leads' });
    this.createLeadLink = page.getByRole('link', { name: 'Create' });

    this.userAvatar = page.locator('.user-avatar, .profile-menu, .v-avatar').first();
    this.logoutButton = page.getByRole('link', { name: /logout|sign out/i });
  }

  async goToLeads(): Promise<void> {
    await this.helper.click(this.leadsMenu, 'Leads menu');
  }

  async goToAllLeads(): Promise<void> {
    await this.goToLeads();
    await this.helper.click(this.allLeadsLink, 'All Leads submenu');
  }

  async goToCreateLead(): Promise<void> {
    await this.goToLeads();
    await this.helper.click(this.createLeadLink, 'Create Lead submenu');
  }

  async goToCustomers(): Promise<void> {
    await this.helper.click(this.customersMenu, 'Customers menu');
  }

  async goToVisits(): Promise<void> {
    await this.helper.click(this.visitsMenu, 'Visits menu');
  }

  async goToJobs(): Promise<void> {
    await this.helper.click(this.jobsMenu, 'Jobs menu');
  }

  async goToTechnicians(): Promise<void> {
    await this.helper.click(this.techniciansMenu, 'Technicians menu');
  }

  async goToTimesheet(): Promise<void> {
    await this.helper.click(this.timesheetMenu, 'Timesheet menu');
  }

  async logout(): Promise<void> {
    await this.helper.click(this.userAvatar, 'User avatar');
    await this.helper.click(this.logoutButton, 'Logout');
  }
}
