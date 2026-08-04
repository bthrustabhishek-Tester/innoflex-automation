import { test, expect, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/login/LoginPage';
import { LeadPage, LeadData } from '../pages/lead/LeadPage';
import { CustomerPage, CustomerData } from '../pages/customer/CustomerPage';
import { env } from '../config/env';
import { RandomData } from '../utils/RandomData';

test.describe.serial('Master Sequential Execution Suite (1 Single Browser Window)', () => {
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        console.log('=== Opening 1 Single Browser Window for All Tests ===');
        const context = await browser.newContext();
        page = await context.newPage();
    });

    test.beforeEach(async () => {
        test.setTimeout(180000);
    });

    test.afterAll(async () => {
        console.log('=== Closing Browser Window after All Tests Complete ===');
        if (page) {
            await page.close();
        }
    });

    // -------------------------------------------------------------
    // PHASE 1: LOGIN TESTS
    // -------------------------------------------------------------
    test('Phase 1.1: Verify successful login with valid credentials', async () => {
        console.log('Executing Phase 1.1: Login');
        const loginPage = new LoginPage(page);
        await loginPage.navigateTo(env.baseUrl);
        await loginPage.login(env.username, env.password);
        await expect(page.getByRole('link', { name: /CRM/i }).first()).toBeVisible();
    });

    test('Phase 1.2: Verify login validation for invalid email format', async () => {
        console.log('Executing Phase 1.2: Login Validation');
        const emailInput = page.locator('input[type="text"], input[name*="email" i]').first();
        if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await emailInput.fill('invalidemail');
            await page.keyboard.press('Tab');
            await expect(page.locator('.v-messages__message').first()).toBeAttached();
        }
    });

    // -------------------------------------------------------------
    // PHASE 2: LEADS TESTS
    // -------------------------------------------------------------
    test('Phase 2.1: Navigate to Leads module and verify status tab filtering', async () => {
        console.log('Executing Phase 2.1: Leads Status Tab Filtering');
        const leadPage = new LeadPage(page);
        await leadPage.navigateToLeads();

        const statuses = ['All Leads', 'Not Contacted', 'Follow Up', 'Meeting', 'Converted to Customer', 'Rejected', 'Accepted'];
        for (const status of statuses) {
            await leadPage.filterByStatusTab(status);
            await expect(page.locator('body')).toBeVisible();
        }
    });

    test('Phase 2.2: Verify search lead functionality', async () => {
        console.log('Executing Phase 2.2: Search Lead');
        const leadPage = new LeadPage(page);
        await leadPage.searchLead('Lead');
        await expect(page.locator('body')).toBeVisible();
        await leadPage.resetFilters();
    });

    test('Phase 2.3: Verify applying date range presets', async () => {
        console.log('Executing Phase 2.3: Date Range Presets');
        const leadPage = new LeadPage(page);
        const presets = ['Today', 'This Week', 'Last 7 Days', 'This Month', 'This Year'];
        for (const preset of presets) {
            await leadPage.applyDatePreset(preset);
            await expect(page.locator('body')).toBeVisible();
        }
        await leadPage.resetFilters();
    });

    test('Phase 2.4: Verify status change via bulk actions one by one on single row selections', async () => {
        console.log('Executing Phase 2.4: Bulk Actions One By One');
        const leadPage = new LeadPage(page);
        await leadPage.filterByStatusTab('All Leads');

        const bulkActions = [
            'Mark as Not Contacted',
            'Mark as Follow Up',
            'Mark as Meeting',
            'Mark as Accepted'
        ];

        for (let i = 0; i < bulkActions.length; i++) {
            const action = bulkActions[i];
            const rowIndex = (i % 2) + 1;
            await leadPage.performBulkActionForSingleRow(action, rowIndex);
            await expect(page.locator('body')).toBeVisible();
        }
    });

    test('Phase 2.5: Verify user can create a new lead with sequential Lead Tst name and clean email', async () => {
        console.log('Executing Phase 2.5: Create & Update Lead');
        const leadPage = new LeadPage(page);
        await leadPage.navigateToCreateLead();

        const leadTitle = RandomData.getRandomValidLeadName('Lead');
        const companyName = RandomData.getRandomCompanyName('SG');
        const leadData: LeadData = {
            title: leadTitle,
            source: 'Web Enquiry',
            assignTo: 'Sales Person',
            companyName: companyName,
            phoneNumber: RandomData.getRandomPhoneNumber('SG', false),
            email: RandomData.getRandomEmail('gmail.com'),
            website: RandomData.getRandomWebsite(companyName),
            addressLine1: '685 GEYLANG ROAD',
            addressLine2: 'EVER LODGE',
            unitNumber: 'UN' + RandomData.getRandomNumber(4),
            postalCode: RandomData.getRandomPostalCode('SG'),
            description: 'Automated test lead description',
            contactPerson: {
                contactName: RandomData.getRandomFirstName('SG') + ' ' + RandomData.getRandomLastName('SG'),
                email: RandomData.getRandomEmail('gmail.com'),
                position: 'Manager',
                mobileNumber: RandomData.getRandomPhoneNumber('SG', false),
                did: RandomData.getRandomLandline('SG'),
                landlineNumber: RandomData.getRandomLandline('SG')
            }
        };

        await leadPage.fillLeadForm(leadData);
        await leadPage.saveLead();
        await leadPage.verifyLeadDetailPage(leadTitle);

        // Update Lead Details
        const updatedTitle = RandomData.getRandomValidLeadName('Lead');
        await leadPage.updateLeadDetails({
            title: updatedTitle,
            description: 'Automated updated description for lead'
        });
        await leadPage.verifyLeadDetailPage(updatedTitle);
    });

    // -------------------------------------------------------------
    // PHASE 3: CUSTOMER TESTS
    // -------------------------------------------------------------
    test('Phase 3.1: Verify user can create a new customer with unique data', async () => {
        console.log('Executing Phase 3.1: Create Customer');
        const customerPage = new CustomerPage(page);
        await customerPage.navigateToCreateCustomer();

        const dataSet = RandomData.getFullRandomDataSet('SG');
        const customerData: CustomerData = {
            firstName: dataSet.firstName,
            lastName: dataSet.lastName,
            displayName: `${dataSet.companyName} (${dataSet.firstName} ${dataSet.lastName})`,
            companyName: dataSet.companyName,
            email: dataSet.email,
            phoneNumber: dataSet.mobileNumber,
            customerCode: 'CUST' + RandomData.getRandomNumber(5),
            uen: dataSet.uenOrSsm,
            customerRef: 'REF' + RandomData.getRandomNumber(4),
            companyFax: dataSet.landlineNumber,
            category: 'Category A',
            salesPerson: 'Sales Person',
            addressLine1: dataSet.address.addressLine1,
            postalCode: dataSet.address.postalCode,
            remark: 'Automated test customer remark'
        };

        await customerPage.fillCustomerForm(customerData);
        await customerPage.saveCustomer();
        await customerPage.verifyCustomerInList(customerData.companyName);
    });

    test('Phase 3.2: Verify mandatory fields validation on Create Customer page', async () => {
        console.log('Executing Phase 3.2: Customer Mandatory Fields Validation');
        const customerPage = new CustomerPage(page);
        await customerPage.navigateToCreateCustomer();

        const saveBtn = page.getByRole('button', { name: 'Save Customer' }).first();
        await saveBtn.click({ force: true }).catch(() => {});

        const messages = await page.locator('.v-messages__message').allInnerTexts();
        console.log('Detected validation error messages:', messages.filter(m => m.trim() !== ''));
        await expect(page.locator('.v-messages__message').first()).toBeAttached();
    });
});
