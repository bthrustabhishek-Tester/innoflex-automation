import { Page, BrowserContext } from '@playwright/test';

/**
 * HAR Mocking helper.
 *
 * Two supported modes, matching Playwright's native HAR capabilities:
 *  1. RECORD  - capture real network traffic to a .har file (used once to seed mocks)
 *  2. REPLAY  - serve responses from a previously recorded .har file, so tests
 *               run deterministically without hitting the real backend.
 *
 * Usage (replay/mock an API during a test):
 *   await HarMocker.routeFromHar(page, 'har/leads-api.har');
 *
 * Usage (record a new HAR file while exploring the app manually via codegen):
 *   npx playwright open --save-har=har/leads-api.har --save-har-glob="**\/api/**" <url>
 */
export class HarMocker {
  /**
   * Route matching network calls through a recorded HAR file instead of the live network.
   * @param page current Page
   * @param harPath path to the .har file, e.g. 'har/leads-api.har'
   * @param urlGlob optional glob to scope which requests are mocked (default: all /api/ calls)
   * @param update  if true, Playwright will UPDATE the har file with live responses instead of replaying
   */
  static async routeFromHar(
    page: Page,
    harPath: string,
    urlGlob = '**/api/**',
    update = false
  ): Promise<void> {
    await page.routeFromHAR(harPath, {
      url: urlGlob,
      update,
      notFound: 'fallback', // fall through to network if a request isn't found in the HAR
    });
  }

  /**
   * Record all network traffic for a browser context into a HAR file.
   * Typically used in a dedicated "record" script/test, not in normal CI runs.
   */
  static async recordHar(context: BrowserContext, harPath: string): Promise<void> {
    // Context-level HAR recording must be configured at context-creation time via
    // browser.newContext({ recordHar: { path: harPath } }). This helper documents
    // the pattern for a one-off recording script:
    //
    // const context = await browser.newContext({ recordHar: { path: harPath, mode: 'minimal' } });
    // ... perform actions ...
    // await context.close(); // HAR is flushed to disk on close
    throw new Error(
      `Use browser.newContext({ recordHar: { path: '${harPath}' } }) at context creation time to record HAR.`
    );
  }

  /** Abort/mock a single endpoint with a custom static JSON response (no HAR file needed) */
  static async mockJson(page: Page, urlGlob: string, jsonBody: unknown, status = 200): Promise<void> {
    await page.route(urlGlob, async (route) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(jsonBody),
      });
    });
  }
}
