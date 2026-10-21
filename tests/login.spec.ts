import { test, expect } from '../fixtures/testFixture';
import { LoginPage } from '../pages/loginPage';
import testData from '../test-data/login.json';
import { ConfigManager } from '../utils/configManager';

test.describe('@smoke Login Tests', () => {
  test('TC001 - Login with valid credentials', async ({ loginPage }) => {
	await loginPage.navigateToLogin();
	await loginPage.login(testData.validLogin.email, testData.validLogin.password);
	await expect(loginPage.page).not.toHaveURL(/login/);
  });

  test('TC002 - Login with invalid credentials', async ({ loginPage }) => {
	await loginPage.navigateToLogin();
	await loginPage.enterEmail(testData.invalidLogin.email);
	await loginPage.enterPassword(testData.invalidLogin.password);
	await loginPage.clickSignIn();
	const errorVisible = await loginPage.isErrorMessageDisplayed();
	expect(errorVisible).toBe(true);
  });

  test('TC003 - Login with empty credentials', async ({ loginPage }) => {
	await loginPage.navigateToLogin();
	await loginPage.clickSignIn();
	const errorVisible = await loginPage.isErrorMessageDisplayed();
	expect(errorVisible).toBe(true);
  });

  test('TC004 - Login page displays all required elements', async ({ loginPage }) => {
	await loginPage.navigateToLogin();
	expect(await loginPage.isElementVisible('#input-17')).toBe(true);
	expect(await loginPage.isElementVisible('#input-20')).toBe(true);
	expect(await loginPage.isElementVisible('button:has-text("Sign In")')).toBe(true);
  });

  test('TC005 - Remember me functionality', async ({ loginPage }) => {
	await loginPage.navigateToLogin();
	await loginPage.fillInput('#input-17', testData.validLogin.email);
	// Test remember me if checkbox exists
	const rememberMeCheckbox = await loginPage.isElementVisible('input[type="checkbox"]');
	if (rememberMeCheckbox) {
	  await loginPage.checkElement('input[type="checkbox"]');
	}
  });

  test('@regression TC006 - Valid email with invalid password', async ({ loginPage }) => {
	await loginPage.navigateToLogin();
	await loginPage.login(testData.validEmailInvalidPassword.email, testData.validEmailInvalidPassword.password);
	const errorVisible = await loginPage.isErrorMessageDisplayed();
	expect(errorVisible).toBe(true);
  });

  test('@regression TC007 - Invalid email with valid password', async ({ loginPage }) => {
	await loginPage.navigateToLogin();
	await loginPage.login(testData.invalidEmailValidPassword.email, testData.invalidEmailValidPassword.password);
	const errorVisible = await loginPage.isErrorMessageDisplayed();
	expect(errorVisible).toBe(true);
  });

  test('TC008 - Clear email field', async ({ loginPage }) => {
	await loginPage.navigateToLogin();
	await loginPage.enterEmail('test@example.com');
	await loginPage.clearEmail();
	const inputValue = await loginPage.page.inputValue('#input-17');
	expect(inputValue).toBe('');
  });

  test('TC009 - Clear password field', async ({ loginPage }) => {
	await loginPage.navigateToLogin();
	await loginPage.enterPassword('password123');
	await loginPage.clearPassword();
	const inputValue = await loginPage.page.inputValue('#input-20');
	expect(inputValue).toBe('');
  });

  test('TC010 - Page title verification', async ({ loginPage }) => {
	await loginPage.navigateToLogin();
	const title = await loginPage.getPageTitle();
	expect(title.toLowerCase()).toContain('login');
  });
});
