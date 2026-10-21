import { test, expect } from '../../fixtures/testFixture';

test.describe('Dashboard Tests', () => {
  test('TC201 - Dashboard loads after login', async ({ authenticatedPage, dashboardPage }) => {
    dashboardPage.page = authenticatedPage;
    const isDashboardDisplayed = await dashboardPage.isDashboardDisplayed();
    expect(isDashboardDisplayed).toBe(true);
  });

  test('TC202 - Navigate to Leads module', async ({ authenticatedPage, dashboardPage }) => {
    dashboardPage.page = authenticatedPage;
    await dashboardPage.navigateToLeads();
    await expect(authenticatedPage).toHaveURL(/leads/);
  });

  test('TC203 - Navigate to Customers module', async ({ authenticatedPage, dashboardPage }) => {
    dashboardPage.page = authenticatedPage;
    await dashboardPage.navigateToCustomers();
    await expect(authenticatedPage).toHaveURL(/customers/);
  });

  test('TC204 - Navigate to Visits module', async ({ authenticatedPage, dashboardPage }) => {
    dashboardPage.page = authenticatedPage;
    await dashboardPage.navigateToVisits();
    await expect(authenticatedPage).toHaveURL(/visits/);
  });

  test('TC205 - Get welcome message', async ({ authenticatedPage, dashboardPage }) => {
    dashboardPage.page = authenticatedPage;
    const message = await dashboardPage.getWelcomeMessage();
    expect(message.length).toBeGreaterThan(0);
  });

  test('TC206 - Logout functionality', async ({ authenticatedPage, dashboardPage }) => {
    dashboardPage.page = authenticatedPage;
    await dashboardPage.logout();
    await expect(authenticatedPage).toHaveURL(/login/);
  });
});
