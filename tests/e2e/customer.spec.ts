import { test, expect } from '@playwright/test';
import { CustomerPage, CustomerData } from '../../pages/customer/CustomerPage';
import { RandomData } from '../../utils/RandomData';

test.describe('Customer Module E2E & Validations', () => {
  let customerPage: CustomerPage;

  test.beforeEach(async ({ page }) => {
    customerPage = new CustomerPage(page);
    await customerPage.navigateToCreateCustomer();
  });

  test('TC-CUST-001: Verify user can create a new customer with unique data', async () => {
    const country = Math.random() > 0.5 ? 'MY' : 'SG';
    RandomData.setCountry(country);

    const companyName = RandomData.getRandomCompanyName();
    const customerData: CustomerData = {
      firstName: RandomData.getRandomFirstName(),
      lastName: RandomData.getRandomLastName(),
      companyName: companyName,
      displayName: companyName,
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
      addressLine1: `Random ${country} Address ` + RandomData.getRandomString(5),
    };

    await customerPage.fillCustomerForm(customerData);
    await customerPage.saveCustomer();
    await customerPage.verifyCustomerInList(customerData.companyName);
  });

  test('TC-CUST-002: Verify mandatory fields validation on blank submission', async ({ page }) => {
    const fields = ['First Name', 'Last Name', 'Company Name', 'Display Name', 'Email', 'Phone Number'];

    for (const field of fields) {
      const input = page.locator(`input[placeholder*="${field}" i]`).or(page.getByRole('textbox', { name: field })).first();
      await input.waitFor({ state: 'visible', timeout: 5000 });
      await input.fill('a');
      await input.fill('');
    }

    await expect(page.locator('.v-messages__message').filter({ hasText: /first name is required/i })).toBeAttached({ timeout: 10000 });
    await expect(page.locator('.v-messages__message').filter({ hasText: /display name is required/i }).first()).toBeAttached({ timeout: 10000 });
  });

  test('TC-CUST-003: Verify invalid email format validation', async ({ page }) => {
    const emailInput = page.getByRole('textbox', { name: 'Email' });
    await emailInput.fill('invalid-email');
    await page.getByRole('textbox', { name: 'First Name' }).click();

    const emailError = page.locator('.v-messages__message').filter({ hasText: /email/i }).filter({ hasText: /valid/i });
    await expect(emailError).toBeAttached({ timeout: 10000 });
  });
});
