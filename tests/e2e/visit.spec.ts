import { test, expect } from '../../fixtures/test-fixture';
import visitsData from '../../test-data/visits.json';
import { Helper } from '../../utils/helper';

test.describe('Visits Module @regression', () => {
  test.beforeEach(async ({ dashboardPage }) => {
    await dashboardPage.goToVisits();
  });

  test('TC013 - Create a new visit with valid data @smoke', async ({ visitsPage }) => {
    const title = `${visitsData.valid.title} - ${Helper.uniqueString()}`;
    await visitsPage.createVisit({ ...visitsData.valid, title });
    await visitsPage.expectSuccessToast();
    await visitsPage.expectRecordVisible(title);
  });

  test('TC014 - Cancel an existing visit', async ({ visitsPage }) => {
    const title = `${visitsData.valid.title} - ${Helper.uniqueString('CANCEL')}`;
    await visitsPage.createVisit({ ...visitsData.valid, title });
    await visitsPage.expectSuccessToast();

    await visitsPage.cancelVisit(title);
    await expect(visitsPage.rowFor(title)).toContainText(/cancelled/i);
  });

  test('TC015 - Visit creation fails without a Customer selected', async ({ visitsPage }) => {
    await visitsPage.clickAdd();
    await visitsPage.helper.fill(visitsPage.titleInput, 'No Customer Visit', 'Title');
    await visitsPage.helper.fill(visitsPage.dateInput, visitsData.invalid.missingCustomer.date, 'Date');
    await visitsPage.clickSave();
    await expect(visitsPage.page.getByText(/customer is required/i)).toBeVisible();
  });

  test('TC016 - Visit can be scheduled for the current day (boundary)', async ({ visitsPage }) => {
    const title = `${visitsData.boundary.todayDate.title} - ${Helper.uniqueString()}`;
    await visitsPage.createVisit({ ...visitsData.boundary.todayDate, title } as any);
    await visitsPage.expectSuccessToast();
  });
});
