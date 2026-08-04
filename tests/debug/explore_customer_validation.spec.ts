import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/LoginPage';
import { CustomerPage } from '../../pages/customer/CustomerPage';
import { env } from '../../config/env';

test('Explore Customer Validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const customerPage = new CustomerPage(page);

    await loginPage.navigateTo(env.baseUrl);
    await loginPage.login(env.username, env.password);
    await customerPage.navigateToCreateCustomer();

    // Try to click the disabled Save button (will timeout, so we use a short timeout and catch)
    console.log('Checking if Save Customer button is disabled');
    const isSaveDisabled = await page.getByRole('button', { name: 'Save Customer' }).isDisabled();
    console.log('Save Customer button is disabled:', isSaveDisabled);

    // Try to trigger validation by touching fields
    console.log('Touching fields to trigger validation');
    await page.getByRole('textbox', { name: 'First Name' }).click();
    await page.getByRole('textbox', { name: 'Last Name' }).click();
    await page.getByRole('textbox', { name: 'Company Name' }).click();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'First Name' }).click(); // click back to trigger blur on Email
    
    await page.waitForTimeout(1000);

    const errorMessages = await page.locator('.v-messages__message').allInnerTexts();
    console.log('Error messages after touching fields:', errorMessages);
    
    // Check for mandatory fields markers (*)
    const labels = await page.locator('label').allInnerTexts();
    const mandatoryFields = labels.filter(l => l.includes('*'));
    console.log('Fields with asterisks:', mandatoryFields);
});
