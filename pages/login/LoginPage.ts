import { Page, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class LoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    async login(username: string, password: string) {
        console.log(`Attempting to login with username: ${username}`);
        
        // Wait for inputs to be available
        const usernameInput = this.page.locator('input[type="text"], input[name*="email" i], input[placeholder*="email" i]').first();
        const passwordInput = this.page.locator('input[type="password"]').first();
        
        await usernameInput.waitFor({ state: 'visible', timeout: 15000 });
        await usernameInput.fill(username);
        await passwordInput.fill(password);
        
        console.log('Clicking Sign In button');
        // Vuetify buttons often have the text inside a v-btn__content span
        await this.page.getByRole('button', { name: /Sign In/i }).click();
        
        console.log('Waiting for CRM link to verify login');
        await expect(this.page.getByRole('link', { name: /CRM/i }).first()).toBeVisible({ timeout: 20000 });
        console.log('Login successful');
    }
}
