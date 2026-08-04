import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login/LoginPage';
import { LeadPage, LeadData } from '../../pages/lead/LeadPage';
import { env } from '../../config/env';
import { RandomData } from '../../utils/RandomData';

test.describe('Lead Creation and Update Tests', () => {
    test('Verify user can create a new lead and update lead details', async ({ page }) => {
        const leadPage = new LeadPage(page);

        // 1. Direct navigation (already authenticated via storageState)
        await leadPage.navigateToCreateLead();

        // 3. Prepare Lead Data (Pure alphabetic Lead name without numbers or special characters)
        const leadTitle = RandomData.getRandomValidLeadName('Lead');
        const companyName = RandomData.getRandomCompanyName();
        const leadData: LeadData = {
            title: leadTitle,
            source: 'Web Enquiry',
            assignTo: 'Sales Person',
            companyName: companyName,
            phoneNumber: RandomData.getRandomPhoneNumber('SG', false),
            email: RandomData.getRandomEmail('gmail.com'),
            website: RandomData.getRandomWebsite(companyName),
            addressLine1: '685 GEYLANG ROAD',
            addressLine2: 'EVER LODGE',
            unitNumber: 'UN' + RandomData.getRandomNumber(4),
            postalCode: RandomData.getRandomPostalCode('SG'),
            description: 'Automated test lead description',
            contactPerson: {
                contactName: RandomData.getRandomFirstName('SG') + ' ' + RandomData.getRandomLastName('SG'),
                email: RandomData.getRandomEmail('gmail.com'),
                position: 'Manager',
                mobileNumber: RandomData.getRandomPhoneNumber('SG', false),
                did: RandomData.getRandomLandline('SG'),
                landlineNumber: RandomData.getRandomLandline('SG')
            }
        };

        // 4. Fill and Save Lead
        await leadPage.fillLeadForm(leadData);
        await leadPage.saveLead();

        // 5. Verify detail page
        await leadPage.verifyLeadDetailPage(leadTitle);

        // 6. Update Lead Details (using pure valid alphabetic Lead name without appending 'Updated')
        const updatedTitle = RandomData.getRandomValidLeadName('Lead');
        await leadPage.updateLeadDetails({
            title: updatedTitle,
            description: 'Automated updated description for lead'
        });

        // 7. Verify updated title on detail page
        await leadPage.verifyLeadDetailPage(updatedTitle);
    });
});
