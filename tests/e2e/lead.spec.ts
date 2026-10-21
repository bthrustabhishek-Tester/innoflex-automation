import { test, expect } from '../../fixtures/test-fixture';
import leadsData from '../../test-data/leads.json';
import { Helper } from '../../utils/helper';

test.describe('Leads Module @regression', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goToCreateLead();
  });

  test('TC006 - Create a new lead with valid data @smoke', async ({ leadsPage, dashboardPage }) => {
    const uniqueTitle = `${leadsData.valid.title} - ${Helper.uniqueString()}`;
    await leadsPage.createLead({ ...leadsData.valid, title: uniqueTitle });
    await leadsPage.expectSuccessToast();

    await dashboardPage.goToAllLeads();
    await leadsPage.expectRecordVisible(uniqueTitle);
  });

  test('TC007 - Search for an existing lead', async ({ leadsPage, dashboardPage }) => {
    const uniqueTitle = `${leadsData.validAlternate.title} - ${Helper.uniqueString()}`;
    await leadsPage.createLead({ ...leadsData.validAlternate, title: uniqueTitle });
    await leadsPage.expectSuccessToast();

    await dashboardPage.goToAllLeads();
    await leadsPage.searchLead(uniqueTitle);
    await leadsPage.expectRecordVisible(uniqueTitle);
  });

  test('TC008 - Edit an existing lead', async ({ leadsPage, dashboardPage }) => {
    const original = `${leadsData.valid.title} - ${Helper.uniqueString('EDIT')}`;
    const updated = `${original} - Updated`;

    await leadsPage.createLead({ ...leadsData.valid, title: original });
    await leadsPage.expectSuccessToast();

    await dashboardPage.goToAllLeads();
    await leadsPage.editLead(original, { title: updated });
    await leadsPage.expectSuccessToast();
    await leadsPage.expectRecordVisible(updated);
  });

  test('TC009 - Delete an existing lead', async ({ leadsPage, dashboardPage }) => {
    const title = `${leadsData.valid.title} - ${Helper.uniqueString('DEL')}`;
    await leadsPage.createLead({ ...leadsData.valid, title });
    await leadsPage.expectSuccessToast();

    await dashboardPage.goToAllLeads();
    await leadsPage.deleteLead(title);
    await leadsPage.expectRecordNotVisible(title);
  });

  test('TC010 - Creating a lead without required Title field shows validation error', async ({ leadsPage }) => {
    await leadsPage.fillLeadForm(leadsData.invalid.missingTitle as any);
    await leadsPage.clickSave();
    await expect(leadsPage.titleInput).toHaveAttribute('aria-invalid', 'true').catch(async () => {
      // fallback assertion if the app doesn't use aria-invalid
      await expect(leadsPage.page.getByText(/title is required/i)).toBeVisible();
    });
  });

  test('TC011 - Creating a lead with malformed email shows validation error', async ({ leadsPage }) => {
    await leadsPage.fillLeadForm({ ...leadsData.invalid.malformedEmail, title: `${leadsData.invalid.malformedEmail.title} - ${Helper.uniqueString()}` } as any);
    await leadsPage.clickSave();
    await expect(leadsPage.page.getByText(/valid email/i)).toBeVisible();
  });

  test('TC012 - Lead title accepts boundary-length values @regression', async ({ leadsPage, dashboardPage }) => {
    const title = `${leadsData.boundary.maxLengthTitle.title.slice(0, 60)}-${Helper.uniqueString()}`;
    await leadsPage.createLead({ ...leadsData.boundary.maxLengthTitle, title } as any);
    await leadsPage.expectSuccessToast();
    await dashboardPage.goToAllLeads();
    await leadsPage.expectRecordVisible(title);
  });
});
