import { test, expect } from '../fixtures/testFixture';
import testData from '../test-data/leads.json';

test.describe('@smoke Leads Tests', () => {
  test('TC101 - Create new lead', async ({ leadsPage }) => {
	await leadsPage.navigateToLeads();
	await leadsPage.createLead(testData.validLeads[0]);
	await leadsPage.expectSuccessToast('Lead created');
  });

  test('TC102 - Search for lead', async ({ leadsPage }) => {
	await leadsPage.navigateToLeads();
	await leadsPage.searchLead(testData.searchTerms[0]);
	expect(await leadsPage.leadsTable.isVisible()).toBe(true);
  });

  test('TC103 - Edit lead', async ({ leadsPage }) => {
	await leadsPage.navigateToLeads();
	const leadName = testData.validLeads[0].title;
	await leadsPage.editLead(leadName);
	await leadsPage.fillTitle(testData.updateLeadData.title);
	await leadsPage.clickSave();
	await leadsPage.expectSuccessToast();
  });

  test('TC104 - Delete lead', async ({ leadsPage }) => {
	await leadsPage.navigateToLeads();
	const leadName = testData.validLeads[1].title;
	await leadsPage.deleteLead(leadName);
	await leadsPage.expectSuccessToast('deleted');
  });

  test('TC105 - Verify required fields', async ({ leadsPage }) => {
	await leadsPage.navigateToCreateLead();
	// Test form validation
	expect(await leadsPage.titleInput.isVisible()).toBe(true);
	expect(await leadsPage.companyNameInput.isVisible()).toBe(true);
	expect(await leadsPage.emailAddressInput.isVisible()).toBe(true);
  });

  test('@regression TC106 - Create lead with invalid email', async ({ leadsPage }) => {
	await leadsPage.navigateToLeads();
	await leadsPage.navigateToCreateLead();
	await leadsPage.fillTitle('Test Lead');
	await leadsPage.fillCompanyName('Test Company');
	await leadsPage.fillContactName('Test Contact');
	await leadsPage.fillEmailAddress('invalid-email');
	await leadsPage.clickSave();
	const errorVisible = await leadsPage.isElementVisible('.error-message, .alert-danger');
	expect(errorVisible).toBe(true);
  });

  test('@regression TC107 - Lead count verification', async ({ leadsPage }) => {
	await leadsPage.navigateToLeads();
	const count = await leadsPage.getLeadCount();
	expect(count).toBeGreaterThan(0);
  });

  test('TC108 - Cancel create lead', async ({ leadsPage }) => {
	await leadsPage.navigateToCreateLead();
	await leadsPage.fillTitle('Test Lead to Cancel');
	await leadsPage.clickCancel();
	await expect(leadsPage.page).toHaveURL(/leads/);
  });

  test('TC109 - Lead with phone number', async ({ leadsPage }) => {
	await leadsPage.navigateToLeads();
	const leadWithPhone = { ...testData.validLeads[0], phone: '+1-555-9999' };
	await leadsPage.createLead(leadWithPhone);
	await leadsPage.expectSuccessToast();
  });

  test('@regression TC110 - Search with no results', async ({ leadsPage }) => {
	await leadsPage.navigateToLeads();
	await leadsPage.searchLead('NonExistentLeadXYZ123');
	const rowCount = await leadsPage.getLeadCount();
	expect(rowCount).toBe(0);
  });
});
