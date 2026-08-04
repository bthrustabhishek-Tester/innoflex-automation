
import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/LoginPage';
import { CustomerPage } from '../../pages/customer/CustomerPage';
import { env } from '../../config/env';

test('Explore customer listing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const customerPage = new CustomerPage(page);

    await loginPage.navigateTo(env.baseUrl);
    await loginPage.login(env.username, env.password);
    
    // Navigate to listing (not create)
    await page.getByRole('link', { name: /CRM/i }).first().click();
    await page.getByRole('link', { name: 'Customers' }).click();
    
    await page.waitForTimeout(5000); // Wait for data to load
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search" i]').first();
    if (await searchInput.isVisible()) {
        console.log('Search input found with placeholder Search');
    } else {
        console.log('Search input NOT found with placeholder Search');
        const allInputs = await page.locator('input').all();
        for (const input of allInputs) {
            console.log('Input found:', await input.getAttribute('placeholder'), await input.getAttribute('class'));
        }
    }

    // Find table
    const table = page.locator('table').first();
    if (await table.isVisible()) {
        console.log('Table found');
        const headers = await table.locator('th').allInnerTexts();
        console.log('Table headers:', headers);
    }
    
    await page.screenshot({ path: 'customer_listing.png' });
});
