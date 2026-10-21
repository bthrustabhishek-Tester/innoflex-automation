# Innoflex Automation Framework

Playwright + TypeScript end-to-end and API automation framework for the
**Innoflex** Field Service Management (FSM) admin application, built using
the **Page Object Model (POM)**.

- Application under test: `https://stg-innoflex.businessthrust.com/admin/login`
- Modules covered: Login, Dashboard, Leads, Customers, Visits, Jobs, Technicians, Timesheet

---

## 1. Project Structure

```
FSM-AUTOMATION/
├── tests/
│   ├── setup/
│   │   └── auth.setup.ts        # Logs in once, saves storage state for reuse
│   ├── e2e/
│   │   ├── login.spec.ts
│   │   ├── lead.spec.ts
│   │   ├── visit.spec.ts
│   │   └── leads-mocked.spec.ts # HAR-mocked example
│   └── api/
│       ├── auth.api.spec.ts
│       └── lead.api.spec.ts
│
├── pages/                       # Page Object Model classes
│   ├── BasePage.ts
│   ├── LoginPage.ts
│   ├── DashboardPage.ts
│   ├── LeadsPage.ts
│   ├── CustomersPage.ts
│   ├── VisitsPage.ts
│   ├── JobsPage.ts
│   ├── TechniciansPage.ts
│   └── TimesheetPage.ts
│
├── api/                         # API client + endpoint wrappers
│   ├── apiClient.ts
│   ├── auth.api.ts
│   ├── lead.api.ts
│   └── visit.api.ts
│
├── fixtures/
│   └── test-fixture.ts          # Custom Playwright fixtures (auto page-object injection)
│
├── utils/
│   ├── config.ts                # Environment/config resolver
│   ├── logger.ts                # Console logger
│   ├── helper.ts                # Reusable UI actions/assertions
│   └── harMocker.ts             # HAR record/replay helper
│
├── test-data/                   # JSON test data (valid / invalid / boundary)
│   ├── login.json
│   ├── leads.json
│   ├── visits.json
│   ├── customers.json
│   ├── jobs.json
│   ├── technicians.json
│   └── timesheet.json
│
├── har/                         # Recorded HAR files for API mocking
│   └── README.md
│
├── reports/                     # HTML / Allure / JUnit output (gitignored contents)
├── screenshots/                 # Manual/failure screenshots
├── .github/workflows/
│   └── playwright.yml           # CI/CD pipeline
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── .env / .env.example
└── README.md
```

---

## 2. Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Install Playwright browsers
npm run install:browsers

# 3. Copy environment template and fill in secrets (already pre-filled for STG)
cp .env.example .env

# 4. Run the full suite against STG (default)
npm test
```

---

## 3. Environment Configuration

All environment values live in `.env` and are resolved via `utils/config.ts`.
Switch environments with the `ENV` variable:

```bash
npm run test:dev   # ENV=dev
npm run test:stg   # ENV=stg  (default, configured)
npm run test:uat   # ENV=uat
npm run test:prod  # ENV=prod
```

| Variable | Description |
|---|---|
| `STG_URL` | `https://stg-innoflex.businessthrust.com/admin/login` |
| `STG_USERNAME` / `STG_PASSWORD` | Admin login credentials for STG |
| `API_BASE_URL_STG` | Base URL for API test requests |
| `HEADLESS` | `true`/`false` |
| `RETRIES` / `WORKERS` | Local retry & parallelism defaults |

---

## 4. Running Tests

```bash
npm run test:headed        # Run with browser UI visible
npm run test:debug         # Playwright inspector / step-through debugging
npm run test:ui            # Playwright's interactive UI mode

npm run test:chrome        # Single browser
npm run test:firefox
npm run test:edge
npm run test:mobile        # Emulated mobile (Pixel 7)

npm run test:smoke         # Tests tagged @smoke
npm run test:regression    # Tests tagged @regression
npm run test:api           # API-only test suite
npm run test:e2e           # UI E2E-only test suite
```

Run a single spec file:
```bash
npx playwright test tests/e2e/lead.spec.ts
```

---

## 5. Authentication Strategy

Rather than logging in through the UI in every single test (slow and
flaky), a dedicated **`setup` project** (`tests/setup/auth.setup.ts`) logs
in once, saves the browser's `storageState` to
`playwright/.auth/user.json`, and every other project (`chromium`,
`firefox`, `edge`, `mobile-chrome`) depends on it and reuses that saved
session automatically (see `playwright.config.ts` → `dependencies:
['setup']`).

If a specific test needs to start unauthenticated (e.g. the login tests
themselves), override with:
```ts
test.use({ storageState: { cookies: [], origins: [] } });
```

---

## 6. Page Object Model (POM)

Every module has a dedicated Page class extending `BasePage`, which
centralizes common list/table interactions (Add, Search, Save, Cancel,
Edit-row, Delete-row, success/error toast assertions). Module-specific
classes (e.g. `LeadsPage`) only define their own unique form fields and
flows.

Locators are injected via custom Playwright **fixtures**
(`fixtures/test-fixture.ts`), so test files never instantiate Page Objects
manually:

```ts
import { test, expect } from '../../fixtures/test-fixture';

test('Create Lead', async ({ leadsPage, dashboardPage }) => {
  await dashboardPage.goToCreateLead();
  await leadsPage.createLead({ ... });
  await leadsPage.expectSuccessToast();
});
```

---

## 7. API Automation

`api/apiClient.ts` wraps Playwright's native `APIRequestContext` with base
URL + bearer-token handling. Endpoint-specific classes (`auth.api.ts`,
`lead.api.ts`, `visit.api.ts`) expose typed CRUD methods. API tests live
under `tests/api/*.api.spec.ts` and run as their own Playwright **project**
(`api`), independent of any browser.

```ts
const response = await leadApi.create({ title: '...', company_name: '...' });
expect(response.status()).toBe(201);
```

---

## 8. HAR Mocking

`utils/harMocker.ts` provides:
- `HarMocker.routeFromHar(page, harPath, urlGlob)` – replay recorded responses
- `HarMocker.mockJson(page, urlGlob, body)` – ad-hoc static JSON mocks (no HAR file)

See `har/README.md` for the list of expected HAR files and how to record
new ones, and `tests/e2e/leads-mocked.spec.ts` for a working example.

---

## 9. Reporting

| Report | Command |
|---|---|
| Playwright HTML | `npm run report:html` (auto-generated in `reports/html-report`) |
| Allure | `npm run report:allure:generate && npm run report:allure:open` |
| JUnit XML (CI) | Written to `reports/junit-results.xml` |

Screenshots (on failure), videos (retain-on-failure), and traces
(retain-on-failure) are configured centrally in `playwright.config.ts` and
attach automatically to the HTML/Allure reports.

---

## 10. CI/CD

`.github/workflows/playwright.yml` runs on push/PR/nightly schedule and:
1. Runs E2E tests across chromium/firefox/edge in a matrix
2. Runs the API suite separately
3. Publishes a combined Allure report as a build artifact
4. Uploads traces/videos/screenshots on failure for debugging

Secrets required in the repository settings: `STG_URL`, `STG_USERNAME`,
`STG_PASSWORD`, `API_BASE_URL_STG` (and their `DEV_`/`UAT_`/`PROD_`
equivalents if those environments are added later).

---

## 11. Best Practices Followed

- **POM** with a shared `BasePage` to avoid locator/action duplication
- **Fixtures** for automatic page-object + auth injection (no manual `new X(page)`)
- **Config-driven** environment/base URL/credentials (no hardcoded values in tests)
- **Typed test data** separated from test logic (`test-data/*.json`)
- **Storage-state reuse** to avoid repeating login in every test (fast + stable)
- **Tagged tests** (`@smoke`, `@regression`, `@api`) for selective CI runs
- **Retry + trace/video/screenshot on failure** for easy debugging without bloating passing runs
- **HAR mocking** for deterministic, backend-independent UI tests
- **CI/CD ready** with parallel browser matrix + artifact publishing

## 12. Known Placeholders To Verify Against the Live App

The Leads module locators (Title, Company Name, Contact Name, Email
Address, Source, Assign To) were provided and used exactly as given.
Customers, Visits, Jobs, Technicians, and Timesheet field locators were
**not** supplied, so they follow the same `getByRole('textbox', { name:
'<Label>' })` pattern as a placeholder — update the `name` strings in
those Page classes once you inspect the real form labels in the app.
