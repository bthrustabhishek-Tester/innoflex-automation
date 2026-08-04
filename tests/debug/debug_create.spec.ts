import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/LoginPage';
import { CustomerPage, CustomerData } from '../../pages/customer/CustomerPage';
import { env } from '../../config/env';
import { RandomData } from '../../utils/RandomData';

test('Debug Create Customer', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const customerPage = new CustomerPage(page);

    await loginPage.navigateTo(env.baseUrl);
    await loginPage.login(env.username, env.password);
    await customerPage.navigateToCreateCustomer();

    const companyName = 'Debug ' + RandomData.getRandomString(5).toUpperCase();
    const customerData: CustomerData = {
        firstName: 'Debug',
        lastName: 'Test',
        companyName: companyName,
        displayName: companyName,
        customerCode: 'D' + RandomData.getRandomNumber(5),
        uen: RandomData.getRandomUEN(),
        customerRef: 'REF' + RandomData.getRandomNumber(3),
        email: RandomData.getRandomEmail(),
        phoneNumber: '8' + RandomData.getRandomNumber(7),
        companyFax: '8' + RandomData.getRandomNumber(7),
        category: 'Option A',
        salesPerson: 'kim',
        remark: 'Debug remark',
        postalCode: '123456',
        addressLine1: 'Debug Address 1'
    };

    await customerPage.fillCustomerForm(customerData);
    
    // Check for errors before saving
    const errorMessages = await page.locator('.v-messages__message').allInnerTexts();
    console.log('Error messages before save:', errorMessages.filter(m => m.trim() !== ''));

    // Try to click save and see what happens
    console.log('Attempting to click Save Customer');
    const saveButton = page.getByRole('button', { name: 'Save Customer' }).first();
    const isDisabled = await saveButton.isDisabled();
    console.log('Is Save button disabled?', isDisabled);

    if (isDisabled) {
        // Find which field is causing the issue
        console.log('Checking all mandatory fields...');
        // You can add more checks here
    }

    await customerPage.saveCustomer();
});
