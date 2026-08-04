import { Page } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigateTo(url: string) {
        await this.page.goto(url);
    }

    async getErrorMessage(fieldName: string) {
        // Find the input container that has the field name (as label or placeholder)
        // Then find the message within that container
        return this.page.locator('.v-input').filter({ 
            has: this.page.locator('label, input').filter({ hasText: new RegExp(fieldName, 'i') }) 
        }).locator('.v-messages__message');
    }
}
