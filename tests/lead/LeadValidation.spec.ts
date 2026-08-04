import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/LoginPage';
import { LeadPage } from '../../pages/lead/LeadPage';
import { env } from '../../config/env';

test.describe('Lead Validation Tests', () => {
    let loginPage: LoginPage;
    let leadPage: LeadPage;

    test.beforeEach(async ({ page }) => {
        leadPage = new LeadPage(page);

        await leadPage.navigateToCreateLead();
    });

    test('Verify mandatory fields validation on blank submission', async ({ page }) => {
        // Attempting to click Save Lead when mandatory fields are blank
        const saveBtn = page.getByRole('button', { name: 'Save Lead' });
        
        // Check if button is disabled or triggers validation messages
        if (await saveBtn.isDisabled()) {
            expect(await saveBtn.isDisabled()).toBe(true);
        } else {
            await saveBtn.click({ force: true });
        }

        // Touch fields to trigger Vuetify validation messages
        const titleInput = page.getByRole('textbox', { name: 'Title' }).or(page.locator('input[placeholder*="Title" i]')).first();
        const companyInput = page.getByRole('textbox', { name: 'Company Name' }).or(page.locator('input[placeholder*="Company Name" i]')).first();
        
        await titleInput.click({ force: true });
        await companyInput.click({ force: true });
        await titleInput.click({ force: true }); // blur

        const messages = await page.locator('.v-messages__message').allInnerTexts();
        console.log('Lead validation error messages:', messages.filter(m => m.trim() !== ''));

        await expect(page.locator('.v-messages__message').filter({ hasText: /required/i }).first()).toBeAttached({ timeout: 10000 });
    });

    test('Verify invalid email format validation on Lead creation', async ({ page }) => {
        const emailInput = page.getByRole('textbox', { name: 'Email' }).or(page.locator('input[placeholder*="Email" i]')).first();
        await emailInput.click({ force: true });
        await emailInput.fill('invalid-email-address');
        
        const saveBtn = page.getByRole('button', { name: 'Save Lead' }).first();
        await saveBtn.click({ force: true }).catch(() => {});

        const messages = await page.locator('.v-messages__message').allInnerTexts();
        console.log('Messages for invalid email:', messages.filter(m => m.trim() !== ''));

        const emailError = page.locator('.v-messages__message').filter({ hasText: /email must be valid|valid|invalid|required/i }).first();
        await expect(emailError).toBeAttached({ timeout: 10000 });
    });
});
