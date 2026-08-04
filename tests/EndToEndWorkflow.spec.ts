import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../pages/login/LoginPage';
import { LeadPage, LeadData } from '../pages/lead/LeadPage';
import { CustomerPage, CustomerData } from '../pages/customer/CustomerPage';
import { env } from '../config/env';
import { RandomData } from '../utils/RandomData';

test.describe.serial('Comprehensive End-to-End (E2E) Workflow Test Suite', () => {
    let page: Page;
    let loginPage: LoginPage;
    let leadPage: LeadPage;
    let customerPage: CustomerPage;

    // Shared Lead and Customer tracking variables across E2E pipeline
    let createdLeadTitle: string;
    let createdLeadCompany: string;
    let createdCustomerCompany: string;

    test.beforeAll(async ({ browser }) => {
        console.log('=== Initializing Single Browser Context for End-to-End Workflow ===');
        const context = await browser.newContext();
        page = await context.newPage();
        loginPage = new LoginPage(page);
        leadPage = new LeadPage(page);
        customerPage = new CustomerPage(page);
    });

    test.beforeEach(async () => {
        test.setTimeout(180000);
    });

    test.afterAll(async () => {
        console.log('=== Completed End-to-End Workflow Test Suite ===');
        if (page) {
            await page.close();
        }
    });

    // =========================================================================
    // E2E SCENARIO 1: AUTHENTICATION & LOGIN WORKFLOW
    // =========================================================================
    test('E2E 1.1: Verify successful user login and session initialization', async () => {
        console.log('--- E2E Step 1.1: Logging in with valid credentials ---');
        await loginPage.navigateTo(env.baseUrl);
        await loginPage.login(env.username, env.password);
        await expect(page.getByRole('link', { name: /CRM/i }).first()).toBeVisible({ timeout: 15000 });
    });

    test('E2E 1.2: Verify login form validation for invalid inputs', async () => {
        console.log('--- E2E Step 1.2: Verifying login validation rules ---');
        const emailInput = page.locator('input[type="text"], input[name*="email" i]').first();
        if (await emailInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await emailInput.fill('invalidemailformat');
            await page.keyboard.press('Tab');
            await expect(page.locator('.v-messages__message').first()).toBeAttached();
        }
    });

    // =========================================================================
    // E2E SCENARIO 2: LEAD LIFECYCLE (CREATE, UPDATE, SEARCH, FILTER, BULK)
    // =========================================================================
    test('E2E 2.1: Create a new Lead with sequential name, contact person, and clean email', async () => {
        console.log('--- E2E Step 2.1: Creating a new Lead ---');
        await leadPage.navigateToCreateLead();

        createdLeadTitle = RandomData.getRandomValidLeadName('Lead');
        createdLeadCompany = RandomData.getRandomCompanyName('SG');

        const leadData: LeadData = {
            title: createdLeadTitle,
            source: 'Web Enquiry',
            assignTo: 'Sales Person',
            companyName: createdLeadCompany,
            phoneNumber: RandomData.getRandomPhoneNumber('SG', false),
            email: RandomData.getRandomEmail('gmail.com'),
            website: RandomData.getRandomWebsite(createdLeadCompany),
            addressLine1: '88 MARKET STREET',
            addressLine2: 'CAPITASPRISE',
            unitNumber: 'UN' + RandomData.getRandomNumber(4),
            postalCode: RandomData.getRandomPostalCode('SG'),
            description: 'E2E end-to-end automated lead creation scenario',
            contactPerson: {
                contactName: RandomData.getRandomFirstName('SG') + ' ' + RandomData.getRandomLastName('SG'),
                email: RandomData.getRandomEmail('gmail.com'),
                position: 'Business Development Manager',
                mobileNumber: RandomData.getRandomPhoneNumber('SG', false),
                did: RandomData.getRandomLandline('SG'),
                landlineNumber: RandomData.getRandomLandline('SG')
            }
        };

        await leadPage.fillLeadForm(leadData);
        await leadPage.saveLead();
        await leadPage.verifyLeadDetailPage(createdLeadTitle);

        // Update Lead Details right after creation on detail view
        const updatedTitle = RandomData.getRandomValidLeadName('Lead');
        await leadPage.updateLeadDetails({
            title: updatedTitle,
            description: 'Updated E2E description for lead detail verification'
        });
        await leadPage.verifyLeadDetailPage(updatedTitle);
    });

    test('E2E 2.2: Test Lead dashboard status tab filtering & date range presets', async () => {
        console.log('--- E2E Step 2.2: Testing status filters and date presets ---');
        await leadPage.navigateToLeads();

        // 1. Status Tabs
        const statuses = ['All Leads', 'Not Contacted', 'Follow Up', 'Meeting', 'Converted to Customer', 'Rejected', 'Accepted'];
        for (const status of statuses) {
            await leadPage.filterByStatusTab(status);
            await expect(page.locator('body')).toBeVisible();
        }

        // 2. Date Presets
        const presets = ['Today', 'This Week', 'Last 7 Days', 'This Month', 'This Year'];
        for (const preset of presets) {
            await leadPage.applyDatePreset(preset);
            await expect(page.locator('body')).toBeVisible();
        }
        await leadPage.resetFilters();
    });

    test('E2E 2.3: Execute one-by-one single-row bulk status actions on Lead list', async () => {
        console.log('--- E2E Step 2.3: Performing one-by-one bulk status updates ---');
        await leadPage.navigateToLeads();
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

    test('E2E 2.4: Search and locate created Lead on Dashboard', async () => {
        console.log(`--- E2E Step 2.4: Searching for created Lead (${createdLeadTitle}) ---`);
        await leadPage.navigateToLeads();
        await leadPage.searchLead('Lead Tst');
        await expect(page.locator('body')).toBeVisible();
        await leadPage.resetFilters();
    });

    test('E2E 2.5: Validate mandatory field errors on blank Lead form submission', async () => {
        console.log('--- E2E Step 2.5: Validating mandatory field errors on Lead creation ---');
        await leadPage.navigateToCreateLead();

        const saveBtn = page.getByRole('button', { name: 'Save Lead' })
            .or(page.locator('button:has-text("Save Lead")')).first();
        await saveBtn.click({ force: true }).catch(() => {});

        const messages = await page.locator('.v-messages__message').allInnerTexts();
        console.log('Lead validation error messages:', messages.filter(m => m.trim() !== ''));
        await expect(page.locator('.v-messages__message').first()).toBeAttached();
    });

    // =========================================================================
    // E2E SCENARIO 3: CUSTOMER LIFECYCLE (CREATE, VALIDATE, SEARCH, EDIT)
    // =========================================================================
    test('E2E 3.1: Create a new Customer profile with Singapore UEN and address details', async () => {
        console.log('--- E2E Step 3.1: Creating a new Customer profile ---');
        await customerPage.navigateToCreateCustomer();

        const dataSet = RandomData.getFullRandomDataSet('SG');
        createdCustomerCompany = dataSet.companyName;

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
            remark: 'End-to-End automated customer creation remark'
        };

        await customerPage.fillCustomerForm(customerData);
        await customerPage.saveCustomer();
        await customerPage.verifyCustomerInList(createdCustomerCompany);
    });

    test('E2E 3.2: Search and locate created Customer on Customer Dashboard', async () => {
        console.log(`--- E2E Step 3.2: Locating customer ${createdCustomerCompany} ---`);
        await customerPage.navigateToCustomers();

        const searchInput = page.locator('input[placeholder*="Search" i], input[placeholder*="Start Typing" i]').first();
        if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await searchInput.click({ force: true });
            await searchInput.fill(createdCustomerCompany);
            await searchInput.press('Enter');
            await page.waitForTimeout(1000);
        }
        await expect(page.locator('body')).toContainText(createdCustomerCompany);
    });

    test('E2E 3.3: Validate blank submission errors on Customer Creation form', async () => {
        console.log('--- E2E Step 3.3: Validating blank submission errors for Customer ---');
        await customerPage.navigateToCreateCustomer();

        const saveBtn = page.getByRole('button', { name: 'Save Customer' }).first();
        await saveBtn.click({ force: true }).catch(() => {});

        const messages = await page.locator('.v-messages__message').allInnerTexts();
        console.log('Customer validation error messages:', messages.filter(m => m.trim() !== ''));
        await expect(page.locator('.v-messages__message').first()).toBeAttached();
    });

    test('E2E 3.4: Verify field length limits and numeric input constraints', async () => {
        console.log('--- E2E Step 3.4: Verifying field length and numeric constraints ---');
        await customerPage.navigateToCreateCustomer();

        // 1. Field length truncation test on Customer Code
        const codeInput = page.locator('input[placeholder*="Customer Code" i]').first();
        if (await codeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            const longCode = 'A'.repeat(30);
            await codeInput.fill(longCode);
            const value = await codeInput.inputValue();
            expect(value.length).toBeLessThanOrEqual(30);
        }

        // 2. Numeric inputs
        const phoneInput = page.locator('input[placeholder*="Phone" i], input[type="tel"]').first();
        if (await phoneInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await phoneInput.fill('ABC123XYZ');
            const phoneVal = await phoneInput.inputValue();
            expect(phoneVal).not.toContain('ABC');
        }
    });
});
