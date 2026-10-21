# 🚀 QUICK START GUIDE - Innoflex Playwright Automation Framework

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
cd D:\FSM-AUTOMATION\FSM-AUTOMATION\
npm install
npm run install:browsers
```

### 2. Run Your First Test
```bash
npm test
```

### 3. View HTML Report
```bash
npm run report
```

---

## 📖 Common Commands

### Run Tests by Type
```bash
npm test                    # Run all tests
npm run test:login         # Login tests only
npm run test:leads         # Leads tests only
npm run test:smoke         # Smoke tests (@smoke tag)
npm run test:chrome        # Chrome browser only
npm run test:headed        # See browser while running
npm run test:debug         # Debug mode with Inspector
npm run test:ui            # Interactive UI mode
```

### Reporting
```bash
npm run report              # Open HTML report
npm run report:allure       # Generate Allure report
npm run test:with-allure    # Run tests + generate Allure
```

### Clean Up
```bash
npm run clean:reports      # Delete all reports
```

---

## 📁 Where Everything Is

### Test Files
```
tests/
├── login.spec.ts       (10 tests)
├── leads.spec.ts       (10 tests)
├── dashboard.spec.ts   (6 tests)
└── api.spec.ts         (6 tests)
```

### Page Objects
```
pages/
├── basePage.ts         (Base class)
├── loginPage.ts        (Login module)
├── leadsPage.ts        (Leads module)
├── dashboardPage.ts    (Dashboard)
└── ... (other modules)
```

### API Classes
```
api/
├── baseAPI.ts          (Base class)
├── authAPI.ts          (Authentication)
├── leadsAPI.ts         (Leads endpoints)
├── customersAPI.ts     (Customers)
└── visitsAPI.ts        (Visits)
```

### Test Data
```
test-data/
├── login.json          (Login scenarios)
├── leads.json          (Lead data)
├── customers.json      (Customer data)
└── ... (other modules)
```

### Configuration
```
.env                       (Environment variables)
playwright.config.ts       (Playwright config)
package.json              (Dependencies & scripts)
tsconfig.json             (TypeScript config)
```

---

## 📝 Writing Your First Test

### Using Page Objects
```typescript
import { test } from '../fixtures/testFixture';
import testData from '../test-data/login.json';

test('My first test', async ({ loginPage }) => {
  await loginPage.navigateToLogin();
  await loginPage.login(
	testData.validLogin.email,
	testData.validLogin.password
  );
  expect(await loginPage.isDashboardDisplayed()).toBe(true);
});
```

### Using Fixtures
```typescript
test('Create lead', async ({ leadsPage }) => {
  await leadsPage.navigateToLeads();
  await leadsPage.createLead({
	title: 'New Lead',
	companyName: 'ABC Corp',
	contactName: 'John Doe',
	email: 'john@abc.com'
  });
});
```

### Using API
```typescript
test('API Test', async ({ leadsAPI, authAPI }) => {
  const token = (await authAPI.login('admin@bthrust.com', 'admin@123')).data.token;
  leadsAPI.setAuthToken(token);
  const response = await leadsAPI.getAllLeads();
  expect(response.status).toBe(200);
});
```

---

## 🔧 Configuration (.env)

Key variables in `.env`:
```
ENV=stg                              # Environment
STG_URL=https://...                 # Base URL
STG_USERNAME=admin@bthrust.com      # Login username
STG_PASSWORD=admin@123              # Login password
HEADLESS=true                       # Run headless
RETRIES=0                           # Retry failed tests
WORKERS=4                           # Parallel workers
```

---

## 📊 Test Statistics

- **Total Tests**: 32
- **Page Objects**: 9
- **API Classes**: 5+
- **Utilities**: 6+
- **Test Data Scenarios**: 50+
- **Browsers**: 6 (Chromium, Firefox, WebKit, Edge, Mobile Chrome, Mobile Safari)

---

## 🎯 Test Tags

Use tags to filter tests:

```typescript
test.describe('@smoke Login Tests', () => {
  test('Login', async ({ loginPage }) => { /* ... */ });
});
```

Run tagged tests:
```bash
npm run test:smoke         # Only @smoke tests
npm run test:regression    # Only @regression tests
```

---

## 📋 Test Scenarios by Module

### Login (10 tests)
✓ Valid credentials  
✓ Invalid credentials  
✓ Empty fields  
✓ Page elements  
✓ Remember me  

### Leads (10 tests)
✓ Create lead  
✓ Search lead  
✓ Edit lead  
✓ Delete lead  
✓ Validation  

### Dashboard (6 tests)
✓ Dashboard load  
✓ Module navigation  
✓ Logout  

### API (6 tests)
✓ Login endpoint  
✓ Get leads  
✓ Create lead  
✓ Token verification  

---

## 🐛 Debugging

### View Screenshots
Failed tests automatically save screenshots in `screenshots/`

### View Videos
Failed tests automatically save videos in `videos/`

### View Traces
Failed tests automatically save traces in `traces/`

### Run in Debug Mode
```bash
npm run test:debug
```

---

## 📚 Documentation

- **README.md** - Full documentation
- **FRAMEWORK_VERIFICATION.md** - Framework overview
- **QUICK_START.md** - This file
- **.github/workflows/tests.yml** - CI/CD pipeline

---

## 🚨 Troubleshooting

### Browser not found
```bash
npm run install:browsers
```

### Tests timing out
Increase timeout in `.env`:
```
DEFAULT_TIMEOUT=60000
NAVIGATION_TIMEOUT=90000
```

### Need help?
See full README.md for comprehensive guide

---

## ✨ Pro Tips

1. **Use test fixtures** - Automatically initialize page objects and APIs
2. **Leverage test data** - Don't hardcode values
3. **Tag your tests** - Filter with @smoke, @regression
4. **Check reports** - HTML and Allure reports available
5. **Use retry logic** - Automatic retry on failure
6. **Generate data** - Use `helpers.generateRandomEmail()`
7. **View logs** - Check `logs/` directory
8. **Debug tests** - Run in headed or UI mode
9. **Parallel execution** - Tests run in parallel by default
10. **Extend framework** - Add new page objects as needed

---

## 🎓 Project Structure

```
innoflex-automation/
├── 📁 tests/              [Test specifications]
├── 📁 pages/              [Page Object Models]
├── 📁 api/                [API automation]
├── 📁 fixtures/           [Test fixtures]
├── 📁 utils/              [Utilities & helpers]
├── 📁 test-data/          [Test data (JSON)]
├── 📁 reports/            [Test reports]
├── 📁 screenshots/        [Failure screenshots]
├── 📁 videos/             [Failure videos]
├── 📁 logs/               [Log files]
└── 📄 [Config files]
```

---

## 🚀 Next Steps

1. ✅ Installation complete
2. ✅ Run first test: `npm test`
3. 📊 View report: `npm run report`
4. 📝 Add new tests in `tests/` directory
5. 📄 Create new page objects in `pages/` directory
6. 🔌 Create new API classes in `api/` directory

---

**Happy Testing! 🎉**

For detailed documentation, see `README.md`
For framework overview, see `FRAMEWORK_VERIFICATION.md`
