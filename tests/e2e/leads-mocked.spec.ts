import { test, expect } from '../../fixtures/test-fixture';
import { HarMocker } from '../../utils/harMocker';

/**
 * Demonstrates HAR-based network mocking so the Leads list can be tested
 * deterministically without depending on live backend data.
 * Record har/leads-list.har once via:
 *   npx playwright open --save-har=har/leads-list.har --save-har-glob="**\/api/leads**" <url>
 */
test.describe('Leads Module - HAR mocked @regression', () => {
  test('Leads list renders correctly from a mocked API response', async ({ page, dashboardPage }) => {
    await HarMocker.routeFromHar(page, 'har/leads-list.har', '**/api/leads**');

    await dashboardPage.goToAllLeads();

    // With the HAR replayed, we expect the deterministic mocked leads to render
    await expect(page.locator('table tbody tr')).toHaveCount(5);
  });

  test('Leads list falls back gracefully on empty mocked response', async ({ page, dashboardPage }) => {
    await HarMocker.mockJson(page, '**/api/leads**', { data: [] });
    await dashboardPage.goToAllLeads();
    await expect(page.getByText(/no leads found/i)).toBeVisible();
  });
});
