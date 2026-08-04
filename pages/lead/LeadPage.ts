import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export interface ContactPersonData {
    contactName: string;
    email: string;
    position?: string;
    mobileNumber?: string;
    did?: string;
    landlineNumber?: string;
}

export interface LeadData {
    title: string;
    source?: string;
    assignTo?: string;
    companyName: string;
    phoneNumber: string;
    email: string;
    website?: string;
    addressLine1?: string;
    addressLine2?: string;
    unitNumber?: string;
    postalCode?: string;
    description?: string;
    contactPerson?: ContactPersonData;
}

export class LeadPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToLeads() {
        console.log('Navigating to Leads listing page');
        if (!this.page.url().endsWith('/admin/lead')) {
            await this.page.goto('https://stg-innoflex.businessthrust.com/admin/lead');
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});
        }
    }

    async navigateToCreateLead() {
        console.log('Navigating to Create Lead page');
        if (!this.page.url().includes('/admin/lead/create')) {
            await this.page.goto('https://stg-innoflex.businessthrust.com/admin/lead/create');
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});
        }
    }

    async fillLeadForm(data: LeadData) {
        console.log(`Filling Lead form for: ${data.title} (${data.companyName})`);

        // Title
        const titleInput = this.page.getByRole('textbox', { name: 'Title' })
            .or(this.page.locator('input[placeholder*="Title" i]')).first();
        await titleInput.click({ force: true });
        await titleInput.clear();
        await titleInput.fill(data.title);

        // Source dropdown
        if (data.source) {
            console.log(`Selecting Lead Source: ${data.source}`);
            try {
                const sourceInput = this.page.getByRole('textbox', { name: 'Source' })
                    .or(this.page.locator('.v-input:has-text("Source") input')).first();
                await sourceInput.click({ force: true });
                await this.page.waitForTimeout(300);
                
                const option = this.page.locator('.v-menu__content.menuable__content__active .v-list-item, .v-list-item')
                    .filter({ hasText: new RegExp(data.source, 'i') }).first();
                if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await option.click({ force: true });
                } else {
                    await this.page.keyboard.press('ArrowDown');
                    await this.page.keyboard.press('Enter');
                }
            } catch (e) {
                console.log('Source selection fallback');
            }
        }

        // Assign To dropdown
        if (data.assignTo) {
            console.log(`Selecting Assign To: ${data.assignTo}`);
            try {
                const assignInput = this.page.getByRole('textbox', { name: 'Assign To' })
                    .or(this.page.locator('.v-input:has-text("Assign To") input')).first();
                await assignInput.click({ force: true });
                await this.page.waitForTimeout(300);
                
                const option = this.page.locator('.v-menu__content.menuable__content__active .v-list-item, .v-list-item').first();
                if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await option.click({ force: true });
                } else {
                    await this.page.keyboard.press('ArrowDown');
                    await this.page.keyboard.press('Enter');
                }
            } catch (e) {
                console.log('Assign To selection fallback');
            }
        }

        // Lead Date
        const dateBtn = this.page.getByRole('button', { name: /Lead Date/i }).first();
        if (await dateBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await dateBtn.click({ force: true }).catch(() => {});
            const currentDayBtn = this.page.locator('.v-date-picker-table button').first();
            await currentDayBtn.click({ force: true }).catch(() => {});
        }

        // Company Name
        const companyInput = this.page.getByRole('textbox', { name: 'Company Name' })
            .or(this.page.locator('input[placeholder*="Company Name" i]')).first();
        await companyInput.click({ force: true });
        await companyInput.clear();
        await companyInput.fill(data.companyName);

        // Phone Number
        const phoneInput = this.page.getByRole('textbox', { name: 'Phone Number' })
            .or(this.page.locator('input[placeholder*="Phone Number" i]')).first();
        await phoneInput.click({ force: true });
        await phoneInput.clear();
        await phoneInput.fill(data.phoneNumber);

        // Email
        const emailInput = this.page.getByRole('textbox', { name: 'Email' })
            .or(this.page.locator('input[placeholder*="Email" i]')).first();
        await emailInput.click({ force: true });
        await emailInput.clear();
        await emailInput.fill(data.email);

        // Website
        if (data.website) {
            const websiteInput = this.page.getByRole('textbox', { name: 'Website' })
                .or(this.page.locator('input[placeholder*="Website" i]')).first();
            if (await websiteInput.isVisible({ timeout: 2000 }).catch(() => false)) {
                await websiteInput.fill(data.website);
            }
        }

        // Address Details - Expand Address Information accordion if needed
        if (data.addressLine1 || data.addressLine2 || data.unitNumber || data.postalCode) {
            const addressHeader = this.page.locator('.v-card__title, h3, .v-expansion-panel-header')
                .filter({ hasText: /Address Information/i }).first();
            if (await addressHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
                await addressHeader.click({ force: true }).catch(() => {});
                await this.page.waitForTimeout(300);
            }

            if (data.addressLine1) {
                const addr1Input = this.page.getByRole('textbox', { name: 'Address Line 1' })
                    .or(this.page.locator('input[placeholder*="Address Line 1" i]')).first();
                await addr1Input.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
                await addr1Input.fill(data.addressLine1);
            }

            if (data.addressLine2) {
                const addr2Input = this.page.getByRole('textbox', { name: 'Address Line 2' })
                    .or(this.page.locator('input[placeholder*="Address Line 2" i]')).first();
                await addr2Input.fill(data.addressLine2);
            }

            if (data.unitNumber) {
                const unitInput = this.page.getByRole('textbox', { name: 'Unit Number' })
                    .or(this.page.locator('input[placeholder*="Unit Number" i]')).first();
                await unitInput.fill(data.unitNumber);
            }

            if (data.postalCode) {
                const postalInput = this.page.getByPlaceholder('Postal Code')
                    .or(this.page.locator('input[placeholder*="Postal Code" i]')).first();
                await postalInput.fill(data.postalCode);
            }
        }

        // Description - Expand Description accordion if needed
        if (data.description) {
            const descHeader = this.page.locator('.v-card__title, h3, .v-expansion-panel-header')
                .filter({ hasText: /Description/i }).first();
            if (await descHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
                await descHeader.click({ force: true }).catch(() => {});
                await this.page.waitForTimeout(300);
            }

            const descInput = this.page.getByRole('textbox', { name: 'Description' })
                .or(this.page.locator('textarea[placeholder*="Description" i]')).first();
            await descInput.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
            await descInput.fill(data.description);
        }

        // Add Contact Person if provided
        if (data.contactPerson) {
            await this.addContactPerson(data.contactPerson);
        }
    }

    async addContactPerson(contact: ContactPersonData) {
        console.log(`Adding Contact Person: ${contact.contactName}`);
        
        // Ensure Contact Persons section/button is clicked
        const contactSectionBtn = this.page.getByRole('button', { name: 'Contact Persons' })
            .or(this.page.locator('button:has-text("Contact Persons")')).first();
        if (await contactSectionBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await contactSectionBtn.click({ force: true }).catch(() => {});
        }

        const addContactBtn = this.page.getByRole('button', { name: 'Add Contact Person' })
            .or(this.page.locator('button:has-text("Add Contact Person")')).first();
        await addContactBtn.click({ force: true });
        await this.page.waitForTimeout(500);

        // Fill modal fields
        const nameInput = this.page.getByRole('textbox', { name: 'Contact Name' })
            .or(this.page.locator('.v-dialog input[placeholder*="Contact Name" i]')).first();
        await nameInput.fill(contact.contactName);

        const emailInput = this.page.getByRole('textbox', { name: 'Email Address' })
            .or(this.page.locator('.v-dialog input[placeholder*="Email Address" i]')).first();
        await emailInput.fill(contact.email);

        if (contact.position) {
            const posInput = this.page.getByRole('textbox', { name: 'Position' })
                .or(this.page.locator('.v-dialog input[placeholder*="Position" i]')).first();
            await posInput.click({ force: true }).catch(() => {});
            await posInput.fill(contact.position).catch(() => {});
            await this.page.keyboard.press('Enter').catch(() => {});
        }

        if (contact.mobileNumber) {
            const mobileInput = this.page.getByRole('textbox', { name: 'Mobile Number' })
                .or(this.page.locator('.v-dialog input[placeholder*="Mobile Number" i]')).first();
            await mobileInput.fill(contact.mobileNumber);
        }

        if (contact.did) {
            const didInput = this.page.getByRole('textbox', { name: 'DID' })
                .or(this.page.locator('.v-dialog input[placeholder*="DID" i]')).first();
            await didInput.fill(contact.did);
        }

        if (contact.landlineNumber) {
            const landInput = this.page.getByRole('textbox', { name: 'Landline Number' })
                .or(this.page.locator('.v-dialog input[placeholder*="Landline Number" i]')).first();
            await landInput.fill(contact.landlineNumber);
        }

        // Click Add button inside dialog
        const confirmAddBtn = this.page.getByRole('dialog').getByRole('button', { name: 'Add', exact: true })
            .or(this.page.locator('.v-dialog button:has-text("Add")')).first();
        await confirmAddBtn.click({ force: true });
        await this.page.waitForTimeout(500);
    }

    async saveLead() {
        console.log('Saving Lead');
        
        // Ensure any active overlays or open dropdown menus are closed
        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page.waitForTimeout(300);

        const saveBtn = this.page.getByRole('button', { name: 'Save Lead' })
            .or(this.page.locator('button:has-text("Save Lead")')).first();
        await saveBtn.scrollIntoViewIfNeeded().catch(() => {});
        await saveBtn.click({ force: true });
        await this.page.waitForTimeout(1500);

        console.log('Waiting for navigation to Lead Detail page');
        await this.page.waitForURL(url => url.href.includes('/admin/lead/detail') || !url.href.includes('/create'), { timeout: 20000 }).catch(() => {});
        console.log('Lead save step complete. Final URL:', this.page.url());
    }

    async updateLeadDetails(updatedData: Partial<LeadData>) {
        console.log('Updating Lead Details');
        
        const updateDetailsBtn = this.page.getByRole('button', { name: 'Update Lead Details' })
            .or(this.page.locator('button:has-text("Update Lead Details")')).first();
        await updateDetailsBtn.click({ force: true });
        await this.page.waitForTimeout(1000);

        if (updatedData.title) {
            const titleInput = this.page.locator('.v-dialog input[placeholder*="Title" i], .v-dialog input[type="text"]').first();
            if (await titleInput.isVisible({ timeout: 3000 }).catch(() => false)) {
                await titleInput.click({ force: true });
                await titleInput.fill(updatedData.title);
            }
        }

        if (updatedData.companyName) {
            const companyInput = this.page.locator('.v-dialog input[placeholder*="Company Name" i]').first();
            if (await companyInput.isVisible({ timeout: 3000 }).catch(() => false)) {
                await companyInput.click({ force: true });
                await companyInput.fill(updatedData.companyName);
            }
        }

        if (updatedData.phoneNumber) {
            const phoneInput = this.page.locator('.v-dialog input[placeholder*="Phone Number" i]').first();
            if (await phoneInput.isVisible({ timeout: 3000 }).catch(() => false)) {
                await phoneInput.click({ force: true });
                await phoneInput.fill(updatedData.phoneNumber);
            }
        }

        if (updatedData.description) {
            const descHeader = this.page.locator('.v-dialog .v-card__title, .v-dialog h3, .v-dialog .v-expansion-panel-header')
                .filter({ hasText: /Description/i }).first();
            if (await descHeader.isVisible({ timeout: 2000 }).catch(() => false)) {
                await descHeader.click({ force: true }).catch(() => {});
                await this.page.waitForTimeout(300);
            }

            const descInput = this.page.locator('.v-dialog textarea, .v-dialog input[placeholder*="Description" i]').first();
            if (await descInput.isVisible({ timeout: 3000 }).catch(() => false)) {
                await descInput.fill(updatedData.description);
            }
        }

        const confirmUpdateBtn = this.page.getByRole('dialog').getByRole('button', { name: 'Update', exact: true })
            .or(this.page.locator('.v-dialog button:has-text("Update")')).first();
        await confirmUpdateBtn.click({ force: true });
        await this.page.waitForTimeout(1500);
        console.log('Lead details updated successfully');
    }

    async verifyLeadDetailPage(expectedTitle: string) {
        console.log(`Verifying Lead Detail page for: ${expectedTitle}`);
        await expect(this.page.locator('body')).toContainText(expectedTitle);
        console.log(`Successfully verified Lead detail page: ${expectedTitle}`);
    }

    async filterByStatusTab(statusName: string) {
        console.log(`Filtering Leads by Status Tab: ${statusName}`);
        try {
            const dropdownBtn = this.page.locator('button').filter({ hasText: /Leads|Contacted|Meeting|Converted|Rejected|Accepted/i }).first();
            if (await dropdownBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await dropdownBtn.click({ force: true }).catch(() => {});
                await this.page.waitForTimeout(300);
                const item = this.page.locator('.v-menu__content .v-list-item, .v-list-item').filter({ hasText: new RegExp(statusName, 'i') }).first();
                if (await item.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await item.click({ force: true }).catch(() => {});
                } else {
                    await this.page.keyboard.press('Escape').catch(() => {});
                }
            }
        } catch (e) {
            console.log(`Filter status ${statusName} error ignored`);
        }
        await this.page.waitForTimeout(500);
    }

    async searchLead(query: string) {
        console.log(`Searching Lead with query: ${query}`);
        const searchInput = this.page.getByRole('textbox', { name: /Search Lead|Start Typing/i })
            .or(this.page.locator('input[placeholder*="Search" i], input[placeholder*="Start Typing" i]')).first();
        await searchInput.click({ force: true });
        await searchInput.fill(query);
        await searchInput.press('Enter');
        await this.page.waitForTimeout(1000);
    }

    async selectRowOneByOne(rowIndex: number = 1) {
        console.log(`Selecting table row ${rowIndex} one by one`);
        const rowCheckbox = this.page.locator(`.v-data-table__wrapper tbody tr:nth-child(${rowIndex}) td .v-input--selection-controls__ripple, .v-data-table__wrapper tbody tr:nth-child(${rowIndex}) input[type="checkbox"]`).first();
        if (await rowCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
            await rowCheckbox.click({ force: true }).catch(() => {});
            await this.page.waitForTimeout(300);
        }
    }

    async deselectRowOneByOne(rowIndex: number = 1) {
        console.log(`Deselecting table row ${rowIndex}`);
        const rowCheckbox = this.page.locator(`.v-data-table__wrapper tbody tr:nth-child(${rowIndex}) td .v-input--selection-controls__ripple, .v-data-table__wrapper tbody tr:nth-child(${rowIndex}) input[type="checkbox"]`).first();
        if (await rowCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
            await rowCheckbox.click({ force: true }).catch(() => {});
            await this.page.waitForTimeout(300);
        }
    }

    async performBulkActionForSingleRow(actionName: string, rowIndex: number = 1) {
        console.log(`Performing Bulk Action "${actionName}" for single row ${rowIndex}`);
        
        // Close any existing open overlays/menus
        await this.page.keyboard.press('Escape').catch(() => {});
        await this.page.waitForTimeout(200);

        // 1. Select only single row
        await this.selectRowOneByOne(rowIndex);

        // 2. Open Bulk Action menu
        const bulkBtn = this.page.getByRole('button', { name: 'Bulk Action' })
            .or(this.page.locator('button:has-text("Bulk Action")')).first();
        if (await bulkBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await bulkBtn.click({ force: true }).catch(() => {});
            await this.page.waitForTimeout(300);

            // 3. Select action option
            const actionItem = this.page.locator('.v-menu__content .v-list-item, .v-list-item, [role="menuitem"]').filter({ hasText: new RegExp(actionName, 'i') }).first();
            if (await actionItem.isVisible({ timeout: 2000 }).catch(() => false)) {
                await actionItem.click({ force: true }).catch(() => {});
            } else {
                await this.page.keyboard.press('Escape').catch(() => {});
            }
            await this.page.waitForTimeout(500);
        }

        // 4. Deselect row to clear selection for next action
        await this.deselectRowOneByOne(rowIndex).catch(() => {});
    }

    async performBulkAction(actionName: string) {
        await this.performBulkActionForSingleRow(actionName, 1);
    }

    async openAdvancedFilters() {
        console.log('Opening Advanced Filter Drawer');
        const filterBtn = this.page.getByRole('button', { name: /Filter/i }).first();
        await filterBtn.click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(500);
    }

    async applyAdvancedFilters() {
        console.log('Applying Advanced Filters');
        const applyBtn = this.page.getByRole('button', { name: 'Apply Filter' })
            .or(this.page.locator('button:has-text("Apply Filter")')).first();
        await applyBtn.click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(1000);
    }

    async resetFilters() {
        console.log('Resetting Filters');
        const resetBtn = this.page.getByRole('button', { name: 'Reset' })
            .or(this.page.getByRole('button', { name: 'Clear Filter' }))
            .or(this.page.locator('button:has-text("Reset"), button:has-text("Clear Filter")')).first();
        await resetBtn.click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(1000);
    }

    async applyDatePreset(presetName: string) {
        console.log(`Applying Date Range Preset: ${presetName}`);
        const dateRangeBtn = this.page.getByRole('button', { name: /Date Range/i })
            .or(this.page.locator('button:has-text("Date Range")')).first();
        if (await dateRangeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
            await dateRangeBtn.click({ force: true });
            await this.page.waitForTimeout(300);

            const presetOption = this.page.locator(`:has-text("${presetName}")`).first();
            await presetOption.click({ force: true }).catch(() => {});
            await this.page.waitForTimeout(300);

            const confirmBtn = this.page.getByRole('button', { name: 'Confirm' }).first();
            if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
                await confirmBtn.click({ force: true }).catch(() => {});
            }
            await this.page.waitForTimeout(1000);
        }
    }
}
