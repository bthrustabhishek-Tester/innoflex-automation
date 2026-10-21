import { test, expect } from '../../fixtures/test-fixture';
import loginData from '../../test-data/login.json';

test.describe('Login Module @smoke', () => {
  // These tests run without the pre-authenticated storage state,
  // so use the plain "page" fixture rather than "authenticatedPage".
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC001 - Login with valid credentials @smoke', async ({ page, loginPage, dashboardPage }) => {
    await loginPage.goto();
    await loginPage.login(loginData.valid.email, loginData.valid.password);
    await loginPage.expectLoginSuccess();
    await expect(page).not.toHaveURL(/login/);
  });

  test('TC002 - Login with invalid password shows validation error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(loginData.invalid.wrongPassword.email, loginData.invalid.wrongPassword.password);
    await loginPage.expectValidationError();
  });

  test('TC003 - Login with unregistered email shows validation error', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(loginData.invalid.wrongEmail.email, loginData.invalid.wrongEmail.password);
    await loginPage.expectValidationError();
  });

  test('TC004 - Login with empty credentials is blocked @regression', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(loginData.boundary.emptyBoth.email, loginData.boundary.emptyBoth.password);
    await loginPage.expectValidationError();
  });

  test('TC005 - Login form rejects malformed email @regression', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(loginData.invalid.malformedEmail.email, loginData.invalid.malformedEmail.password);
    await loginPage.expectValidationError();
  });
});
