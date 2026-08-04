import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/LoginPage';
import { CustomerPage, CustomerData } from '../../pages/customer/CustomerPage';
import { env } from '../../config/env';
import { RandomData } from '../../utils/RandomData';

test.describe('Customer Creation Tests', () => {
    test('Verify user can create a new customer with unique data', async ({ page }) => {
        const customerPage = new CustomerPage(page);

        // 1. Direct navigation (already authenticated via storageState)
        await customerPage.navigateToCreateCustomer();

        // 3. Prepare unique customer data
        const country = Math.random() > 0.5 ? 'MY' : 'SG';
        RandomData.setCountry(country);
        
        const companyName = RandomData.getRandomCompanyName();
        const customerData: CustomerData = {
            firstName: RandomData.getRandomFirstName(),
            lastName: RandomData.getRandomLastName(),
            companyName: companyName,
            displayName: companyName, // Display Name depends on Company Name
            customerCode: 'C' + RandomData.getRandomNumber(5),
            uen: RandomData.getRandomUEN(),
            customerRef: 'CR' + RandomData.getRandomNumber(3),
            email: RandomData.getRandomEmail(),
            phoneNumber: RandomData.getRandomPhoneNumber(),
            companyFax: RandomData.getRandomPhoneNumber(),
            category: 'Option A',
            salesPerson: 'kim',
            remark: `Automated test customer remark for ${country}`,
            postalCode: RandomData.getRandomPostalCode(),
            addressLine1: `Random ${country} Address ` + RandomData.getRandomString(5)
        };

        // 4. Fill and Save
        await customerPage.fillCustomerForm(customerData);
        await customerPage.saveCustomer();
        
        // 5. Verify customer in listing page
        await customerPage.verifyCustomerInList(customerData.companyName);
    });
});
