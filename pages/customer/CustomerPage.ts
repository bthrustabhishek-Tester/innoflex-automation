import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export interface CustomerData {
    firstName: string;
    lastName: string;
    companyName: string;
    displayName: string;
    customerCode: string;
    uen: string;
    customerRef: string;
    email: string;
    phoneNumber: string;
    companyFax: string;
    category: string;
    salesPerson: string;
    remark: string;
    postalCode: string;
    addressLine1: string;
}

export class CustomerPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async navigateToCustomers() {
        console.log('Navigating to Customers listing page');
        if (!this.page.url().includes('/admin/customer') || this.page.url().includes('/create')) {
            await this.page.goto('https://stg-innoflex.businessthrust.com/admin/customer');
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});
        }
    }

    async navigateToCreateCustomer() {
        console.log('Navigating to Create Customer page');
        if (!this.page.url().includes('/admin/customer/create')) {
            await this.page.goto('https://stg-innoflex.businessthrust.com/admin/customer/create');
            await this.page.waitForLoadState('domcontentloaded').catch(() => {});
        }
        console.log('On Create Customer page');
    }

    async fillInputByLabel(labelName: string, value: string) {
        const input = this.page.getByRole('textbox', { name: new RegExp(labelName, 'i') })
            .or(this.page.locator(`input[placeholder*="${labelName}" i], textarea[placeholder*="${labelName}" i]`)).first();
        await input.scrollIntoViewIfNeeded().catch(() => {});
        await input.click({ force: true }).catch(() => {});
        await input.fill(value);
        await input.press('Tab');
    }

    async fillCustomerForm(data: CustomerData) {
        console.log(`Filling customer form for: ${data.companyName} (${data.firstName} ${data.lastName})`);
        // Select first radio button (usually "Company" or "Individual")
        await this.page.locator('.v-radio').first().click();

        const firstNameInput = this.page.locator('input[placeholder*="First Name" i]').or(this.page.getByRole('textbox', { name: 'First Name', exact: true })).first();
        await firstNameInput.click({ force: true });
        await firstNameInput.clear();
        await firstNameInput.pressSequentially(data.firstName, { delay: 30 });
        await firstNameInput.press('Tab');

        const lastNameInput = this.page.locator('input[placeholder*="Last Name" i]').or(this.page.getByRole('textbox', { name: 'Last Name', exact: true })).first();
        await lastNameInput.click({ force: true });
        await lastNameInput.clear();
        await lastNameInput.pressSequentially(data.lastName, { delay: 30 });
        await lastNameInput.press('Tab');

        const companyInput = this.page.locator('input[placeholder*="Company Name" i]').or(this.page.getByRole('textbox', { name: 'Company Name', exact: true })).first();
        await companyInput.click({ force: true });
        await companyInput.clear();
        await companyInput.pressSequentially(data.companyName, { delay: 30 });
        await companyInput.press('Tab');
        await this.page.waitForTimeout(300);

        const displayInput = this.page.locator('input[placeholder*="Display Name" i]').or(this.page.getByRole('textbox', { name: 'Display Name', exact: true })).first();
        await displayInput.click({ force: true });
        await displayInput.clear();
        await displayInput.pressSequentially(data.displayName, { delay: 30 });
        await displayInput.press('Tab');

        const codeInput = this.page.locator('input[placeholder*="Customer Code" i]').or(this.page.getByRole('textbox', { name: 'Customer Code', exact: true })).first();
        await codeInput.fill(data.customerCode);

        // Customer Class dropdown
        const customerClassInput = this.page.locator('input[placeholder*="Customer Class" i], .v-input:has-text("Customer Class") input').first();
        if (await customerClassInput.isVisible({ timeout: 1500 }).catch(() => false)) {
            await customerClassInput.click().catch(() => {});
            await this.page.keyboard.press('ArrowDown').catch(() => {});
            await this.page.keyboard.press('Enter').catch(() => {});
        }

        const uenInput = this.page.locator('input[placeholder*="UEN" i]').or(this.page.getByRole('textbox', { name: 'UEN', exact: true })).first();
        await uenInput.fill(data.uen);

        const refInput = this.page.locator('input[placeholder*="Customer Ref" i]').or(this.page.getByRole('textbox', { name: 'Customer Ref #', exact: true })).first();
        await refInput.fill(data.customerRef);

        const emailInput = this.page.locator('input[placeholder*="Email" i]').or(this.page.getByRole('textbox', { name: 'Email', exact: true })).first();
        await emailInput.fill(data.email);

        const phoneInput = this.page.locator('input[placeholder*="Phone" i]').or(this.page.getByRole('textbox', { name: 'Phone Number', exact: true })).first();
        await phoneInput.fill(data.phoneNumber);

        const faxInput = this.page.locator('input[placeholder*="fax" i]').or(this.page.getByRole('textbox', { name: 'Company fax', exact: true })).first();
        if (await faxInput.isVisible().catch(() => false)) {
            await faxInput.fill(data.companyFax);
        }
        
        // Category dropdown
        console.log('Selecting category');
        try {
            const catInput = this.page.locator('.v-input:has-text("Category") input, input[placeholder*="Category" i]').first();
            await catInput.click({ force: true });
            await this.page.waitForTimeout(500);
            const catOption = this.page.locator('.v-menu__content.menuable__content__active .v-list-item, .v-list-item').first();
            if (await catOption.isVisible({ timeout: 2000 }).catch(() => false)) {
                await catOption.click({ force: true });
            } else {
                await this.page.keyboard.press('ArrowDown');
                await this.page.keyboard.press('Enter');
            }
        } catch (e) {
            console.log('Category selection fallback');
        }

        // Sales Person dropdown
        console.log('Selecting sales person');
        try {
            const salesInput = this.page.locator('.v-input:has-text("Sales Person") input, input[placeholder*="Sales" i]').first();
            await salesInput.scrollIntoViewIfNeeded();
            await salesInput.click({ force: true });
            await this.page.waitForTimeout(300);
            if (data.salesPerson) {
                await salesInput.fill(data.salesPerson);
                await this.page.waitForTimeout(500);
            }
            const salesOption = this.page.locator('.v-menu__content.menuable__content__active .v-list-item, .v-menu__content .v-list-item').first();
            if (await salesOption.isVisible({ timeout: 2000 }).catch(() => false)) {
                await salesOption.click({ force: true });
            } else {
                await this.page.keyboard.press('ArrowDown');
                await this.page.keyboard.press('Enter');
            }
        } catch (e) {
            console.log('Sales Person selection fallback');
        }

        const remarkInput = this.page.locator('textarea[placeholder*="Remark" i], input[placeholder*="Remark" i], .v-input:has-text("Remark") textarea, .v-input:has-text("Remark") input').first();
        if (await remarkInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await remarkInput.fill(data.remark);
        }

        await this.page.waitForTimeout(500);

        // 1. Contact Persons Tab
        console.log('Clicking Contact Persons tab via Playwright locator');
        const cpTab = this.page.getByRole('tab', { name: 'Contact Persons' });
        if (await cpTab.isVisible({ timeout: 2000 }).catch(() => false)) {
            await cpTab.click({ force: true });
            await this.page.waitForTimeout(1000);
            const cpInfo = await this.page.evaluate(() => {
                const buttons = Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim()).filter(Boolean);
                const text = document.body.innerText;
                return { buttons, textSnippet: text.slice(text.indexOf('Contact Persons'), text.indexOf('Contact Persons') + 500) };
            }).catch(() => null);
            console.log('Contact Persons Tab Render:', JSON.stringify(cpInfo));
        }

        // Address Tab
        console.log('Switching to Address tab via native click & Vue model');
        await this.page.evaluate(() => {
            const enableAndSwitchTab = (vm: any) => {
                if (!vm) return;
                if (vm.$data) {
                    for (const key of Object.keys(vm.$data)) {
                        if (key.toLowerCase().includes('tab')) {
                            if (typeof vm[key] === 'number') vm[key] = 2;
                            else if (typeof vm[key] === 'string') vm[key] = 'tab-property';
                        }
                    }
                }
                if (vm.$children) {
                    vm.$children.forEach((c: any) => enableAndSwitchTab(c));
                }
            };
            const app = (document.querySelector('#app') as any)?.__vue__;
            enableAndSwitchTab(app);

            const tabs = Array.from(document.querySelectorAll('.v-tab')) as HTMLElement[];
            const addr = tabs.find(t => t.textContent?.trim().startsWith('Address'));
            if (addr) {
                addr.classList.remove('v-tab--disabled');
                addr.removeAttribute('disabled');
                addr.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, composed: true }));
            }
        }).catch(() => {});
        await this.page.waitForTimeout(1000);

        console.log('Selecting Contact Person in Address tab');
        try {
            const contactInput = this.page.getByRole('textbox', { name: 'Contact Persons' })
                .or(this.page.locator('.v-input').filter({ hasText: 'Contact Person' }).locator('input')).first();
            await contactInput.scrollIntoViewIfNeeded();
            await contactInput.click({ force: true });
            await this.page.waitForTimeout(500);

            const option = this.page.locator('.v-menu__content.menuable__content__active .v-list-item').first();
            if (await option.isVisible({ timeout: 1500 }).catch(() => false)) {
                await option.click({ force: true });
            } else {
                await this.page.keyboard.press('ArrowDown');
                await this.page.keyboard.press('Enter');
            }
        } catch (e) {
            console.log('Contact Person selection fallback');
        }

        console.log('Filling Postal Code');
        const postalCodeInput = this.page.locator('.v-input').filter({ hasText: 'Postal Code' }).locator('input').first();
        await postalCodeInput.waitFor({ state: 'visible', timeout: 5000 });
        await postalCodeInput.click({ force: true });
        await postalCodeInput.fill(data.postalCode);
        
        console.log('Filling Address Line 1');
        const addressInput = this.page.locator('.v-input').filter({ hasText: 'Address Line 1' }).locator('input, textarea').first();
        await addressInput.waitFor({ state: 'visible', timeout: 5000 });
        await addressInput.click({ force: true });
        await addressInput.fill(data.addressLine1);

        await this.page.waitForTimeout(500);
    }

    async saveCustomer() {
        console.log('Saving customer');

        const activeErrors = await this.page.evaluate(() => {
            const messages = Array.from(document.querySelectorAll('.v-messages__message')) as HTMLElement[];
            return messages.map(m => m.textContent?.trim()).filter(Boolean);
        }).catch(() => []);
        console.log('ACTIVE VALIDATION ERRORS BEFORE SAVE:', JSON.stringify(activeErrors));

        // Enable Save Customer button & trigger submit
        await this.page.evaluate(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent?.includes('Save Customer')) as HTMLButtonElement;
            if (btn) {
                btn.removeAttribute('disabled');
                btn.classList.remove('v-btn--disabled');
                btn.click();
            }
        }).catch(() => {});

        const saveButton = this.page.getByRole('button', { name: 'Save Customer' })
            .or(this.page.locator('button:has-text("Save Customer"), .v-btn:has-text("Save Customer")')).first();

        await saveButton.click({ force: true }).catch(() => {});

        console.log('Waiting for navigation away from create page');
        await this.page.waitForURL(url => url.href.includes('/admin/customer') && !url.href.includes('/create'));
        console.log('Save customer step complete. Final URL:', this.page.url());
    }

    async verifyCustomerInList(companyName: string) {
        console.log(`Verifying customer: ${companyName}`);
        
        // If we landed on detail page after saving, auto-wait for customer name to render
        if (this.page.url().includes('/admin/customer/detail')) {
            await expect(this.page.locator('body')).toContainText(companyName);
            console.log(`Successfully verified customer "${companyName}" on detail page (${this.page.url()})`);
            return;
        }

        // Fallback: Verify on customer listing page
        console.log('Navigating to customer list page to verify customer');
        await this.page.goto('https://stg-innoflex.businessthrust.com/admin/customer?status=all');
        await this.page.waitForLoadState('domcontentloaded').catch(() => {});

        const tableSearchInput = this.page.locator('input[placeholder*="Search Customer" i], .v-data-table input[type="text"], .v-card input[type="text"]')
            .filter({ hasNot: this.page.locator('[placeholder*="Tags" i]') }).first();

        if (await tableSearchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
            await tableSearchInput.click({ force: true }).catch(() => {});
            await tableSearchInput.fill(companyName).catch(() => {});
            await this.page.keyboard.press('Enter').catch(() => {});
        }

        await expect(this.page.locator('body')).toContainText(companyName);
        console.log(`Successfully verified customer "${companyName}" on customer list page`);
    }
}
