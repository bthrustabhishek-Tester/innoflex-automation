import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/LoginPage';
import { env } from '../../config/env';

test.describe('Login Validation Tests', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.navigateTo(env.baseUrl);
    });

    test('Verify validation messages for empty fields', async ({ page }) => {
        const emailInput = page.locator('input[type="text"]').first();
        const passwordInput = page.locator('input[type="password"]').first();
        
        // Trigger validation by interacting with fields
        await emailInput.fill('a');
        await emailInput.fill('');
        await passwordInput.fill('a');
        await passwordInput.fill('');
        await emailInput.click(); // blur password
        
        const emailError = page.locator('.v-messages__message').filter({ hasText: /email/i }).filter({ hasText: /required/i });
        const passwordError = page.locator('.v-messages__message').filter({ hasText: /password/i }).filter({ hasText: /required/i });
        
        await expect(emailError).toBeAttached({ timeout: 10000 });
        await expect(passwordError).toBeAttached({ timeout: 10000 });
    });

    test('Verify validation for invalid email format', async ({ page }) => {
        const emailInput = page.locator('input[type="text"]').first();
        await emailInput.fill('invalid-email');
        await page.locator('input[type="password"]').first().click(); // blur email
        
        const emailError = page.locator('.v-messages__message').filter({ hasText: /email/i }).filter({ hasText: /valid/i });
        await expect(emailError).toBeAttached({ timeout: 10000 });
    });

    test('Verify error message for invalid credentials', async ({ page }) => {
        await page.locator('input[type="text"]').first().fill('wrong@example.com');
        await page.locator('input[type="password"]').first().fill('wrongpassword');
        
        // Button might be disabled if validation failed above, but here email is valid format
        const signInButton = page.getByRole('button', { name: 'Sign In' });
        await expect(signInButton).toBeEnabled();
        await signInButton.click();
        
        // Wait for any error message to appear (snackbar or alert)
        // Try multiple common locators or just text
        const errorIndicator = page.locator('.v-snack__wrapper, .v-alert, .error--text, [role="alert"]').first();
        await expect(errorIndicator.or(page.getByText(/invalid/i))).toBeVisible({ timeout: 15000 });
        
        const pageText = await page.innerText('body');
        console.log('Page text after failed login attempt:', pageText);
    });
});
