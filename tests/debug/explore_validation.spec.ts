import { test, expect } from '@playwright/test';
import { env } from '../../config/env';

test('Explore Login Validation', async ({ page }) => {
    await page.goto(env.baseUrl);
    
    // Submit without entering anything
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for any error message
    await page.waitForTimeout(2000);
    
    // Take a screenshot or log some info (though I can't see screenshots easily, I can check for common error locators)
    const errorMessages = await page.locator('.v-messages__message').allInnerTexts();
    console.log('Error messages for empty fields:', errorMessages);
    
    // Try invalid email format
    await page.locator('input[type="text"]').first().fill('invalid-email');
    await page.locator('input[type="password"]').first().click(); // blur field to trigger validation
    const invalidEmailError = await page.locator('.v-messages__message').allInnerTexts();
    console.log('Error messages for invalid email format:', invalidEmailError);

    // Try invalid credentials
    await page.locator('input[type="text"]').first().fill('invalid@example.com');
    await page.locator('input[type="password"]').first().fill('wrongpassword');
    await page.getByRole('button', { name: 'Sign In' }).click();
    
    // Wait for snackbar to appear
    await page.locator('.v-snack__content').waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
    const toastError = await page.locator('.v-snack__content').allInnerTexts();
    console.log('Toast error for invalid credentials:', toastError);
});
