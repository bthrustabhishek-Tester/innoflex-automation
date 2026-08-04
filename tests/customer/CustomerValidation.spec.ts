import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/LoginPage';
import { CustomerPage } from '../../pages/customer/CustomerPage';
import { env } from '../../config/env';

test.describe('Customer Validation Tests', () => {
    let loginPage: LoginPage;
    let customerPage: CustomerPage;

    test.beforeEach(async ({ page }) => {
        customerPage = new CustomerPage(page);

        await customerPage.navigateToCreateCustomer();
    });

    test('Verify mandatory fields validation (blank fields)', async ({ page }) => {
        const fields = ['First Name', 'Last Name', 'Company Name', 'Display Name', 'Email', 'Phone Number'];
        
        for (const field of fields) {
            const input = page.locator(`input[placeholder*="${field}" i]`).or(page.getByRole('textbox', { name: field })).first();
            await input.waitFor({ state: 'visible', timeout: 5000 });
            await input.fill('a');
            await input.fill('');
        }
        
        const errorMessages = page.locator('.v-messages__message');
        const messages = await errorMessages.allInnerTexts();
        console.log('Detected error messages:', messages.filter(m => m.trim() !== ''));

        await expect(page.locator('.v-messages__message').filter({ hasText: /first name is required/i })).toBeAttached({ timeout: 10000 });
        await expect(page.locator('.v-messages__message').filter({ hasText: /display name is required/i }).first()).toBeAttached({ timeout: 10000 });
    });

    test('Verify invalid email format validation', async ({ page }) => {
        const emailInput = page.getByRole('textbox', { name: 'Email' });
        await emailInput.fill('invalid-email');
        await page.getByRole('textbox', { name: 'First Name' }).click(); // blur
        
        const messages = await page.locator('.v-messages__message').allInnerTexts();
        console.log('Messages after invalid email:', messages.filter(m => m.trim() !== ''));
        
        const emailError = page.locator('.v-messages__message').filter({ hasText: /email/i }).filter({ hasText: /valid/i });
        await expect(emailError).toBeAttached({ timeout: 10000 });
    });

    test('Verify field length limits', async ({ page }) => {
        // Example: Customer Code or UEN might have limits
        const customerCodeInput = page.getByRole('textbox', { name: 'Customer Code' });
        
        // Fill with a very long string if there is a limit
        const longString = 'A'.repeat(51); 
        await customerCodeInput.fill(longString);
        
        // Check if it's truncated or if there's an error message
        const value = await customerCodeInput.inputValue();
        if (value.length < longString.length) {
            console.log(`Customer Code was truncated to ${value.length} characters`);
        } else {
            // Check for error message
            await page.getByRole('textbox', { name: 'First Name' }).click(); // blur
            const messages = await page.locator('.v-messages__message').allInnerTexts();
            console.log('Messages for long Customer Code:', messages);
        }
    });

    test('Verify numeric fields only accept numbers', async ({ page }) => {
        const phoneInput = page.getByRole('textbox', { name: 'Phone Number' });
        await phoneInput.fill('abc');
        
        const value = await phoneInput.inputValue();
        expect(value).not.toBe('abc'); // Should either be empty or ignore non-numeric chars
    });
});
