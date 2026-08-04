import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/login/LoginPage';
import { env } from '../config/env';
import path from 'path';

export const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('Authenticate and save session state', async ({ page }) => {
    console.log('--- Global Authentication Setup ---');
    const loginPage = new LoginPage(page);
    
    await loginPage.navigateTo(env.baseUrl);
    await loginPage.login(env.username, env.password);
    
    // Save storage state (cookies, localStorage, session tokens)
    await page.context().storageState({ path: authFile });
    console.log(`Session state successfully saved to ${authFile}`);
});
