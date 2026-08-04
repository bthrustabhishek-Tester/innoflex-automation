import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/LoginPage';
import { env } from '../../config/env';

test.describe('Login Tests', () => {
    test('Successful Login with valid credentials', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigateTo(env.baseUrl);
        await loginPage.login(env.username, env.password);
        await expect(page).not.toHaveURL(/.*login/);
    });
});
