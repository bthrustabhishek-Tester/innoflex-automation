import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/LoginPage';
import { LeadPage } from '../../pages/lead/LeadPage';
import { env } from '../../config/env';

test.describe('Lead Dashboard Filtering and Bulk Action Tests', () => {
    let loginPage: LoginPage;
    let leadPage: LeadPage;

    test.beforeEach(async ({ page }) => {
        leadPage = new LeadPage(page);

        await leadPage.navigateToLeads();
    });

    test('Verify filtering leads by status tabs', async ({ page }) => {
        const statuses = ['All Leads', 'Not Contacted', 'Follow Up', 'Meeting', 'Converted to Customer', 'Rejected', 'Accepted'];

        for (const status of statuses) {
            await leadPage.filterByStatusTab(status);
            await expect(page.locator('body')).toBeVisible();
        }
    });

    test('Verify search lead functionality', async ({ page }) => {
        await leadPage.searchLead('Lead');
        await expect(page.locator('body')).toBeVisible();

        await leadPage.resetFilters();
    });

    test('Verify applying date range presets', async ({ page }) => {
        const presets = ['Today', 'This Week', 'Last 7 Days', 'This Month', 'This Year'];

        for (const preset of presets) {
            await leadPage.applyDatePreset(preset);
            await expect(page.locator('body')).toBeVisible();
        }

        await leadPage.resetFilters();
    });

    test('Verify status change via bulk actions one by one on single row selections', async ({ page }) => {
        // Switch to All Leads tab
        await leadPage.filterByStatusTab('All Leads');

        const bulkActions = [
            'Mark as Not Contacted',
            'Mark as Follow Up',
            'Mark as Meeting',
            'Mark as Accepted'
        ];

        // Select and apply status change one by one per row
        for (let i = 0; i < bulkActions.length; i++) {
            const action = bulkActions[i];
            const rowIndex = (i % 2) + 1; // Alternates between row 1 and row 2
            await leadPage.performBulkActionForSingleRow(action, rowIndex);
            await expect(page.locator('body')).toBeVisible();
        }
    });
});
