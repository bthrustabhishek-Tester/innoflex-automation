# HAR Mock Files

This folder stores recorded HAR (HTTP Archive) files used to mock backend
API responses so UI tests can run deterministically, offline, or against
unstable staging environments.

| File name              | API endpoint mocked        | Mock response required                          |
|-------------------------|-----------------------------|--------------------------------------------------|
| `login-api.har`         | `POST /login`               | 200 with valid token + user payload               |
| `leads-list.har`        | `GET /leads`                | 200 with a fixed array of 5 sample leads          |
| `leads-create.har`      | `POST /leads`               | 201 with the created lead echoed back             |
| `visits-list.har`       | `GET /visits`               | 200 with a fixed array of sample visits           |

## How to record a new HAR file

```bash
npx playwright open --save-har=har/leads-list.har --save-har-glob="**/api/leads**" https://stg-innoflex.businessthrust.com/admin/login
```

Log in and navigate to the screen you want to capture, then close the
browser - Playwright flushes the HAR file to disk on close.

## How HAR mocking is used in tests

```ts
import { HarMocker } from '../utils/harMocker';

test('Leads list renders from mocked API @regression', async ({ page }) => {
  await HarMocker.routeFromHar(page, 'har/leads-list.har', '**/api/leads**');
  await page.goto('/admin/leads');
  // assertions against the mocked, deterministic data...
});
```

`notFound: 'fallback'` is set by default, meaning any request not present
in the HAR file falls through to the real network - so you only need to
record the specific calls you want to control.
