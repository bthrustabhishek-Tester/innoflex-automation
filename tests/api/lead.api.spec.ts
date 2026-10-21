import { test, expect } from '@playwright/test';
import { authApi } from '../../api/auth.api';
import { leadApi } from '../../api/lead.api';
import { apiClient } from '../../api/apiClient';
import { Helper } from '../../utils/helper';

test.describe('Leads API @api', () => {
  test.describe.configure({ mode: 'serial' });
  let createdLeadId: string | number;

  test.beforeAll(async () => {
    await authApi.loginAndStoreToken();
  });

  test.afterAll(async () => {
    if (createdLeadId) {
      await leadApi.delete(createdLeadId).catch(() => undefined);
    }
    await apiClient.dispose();
  });

  test('GET /leads - returns 200 with a list', async () => {
    const response = await leadApi.getAll();
    expect(response.status()).toBe(200);
    const body = await response.json();
    const leadsList = Array.isArray(body.data) ? body.data : (body.data?.rows ?? body);
    expect(Array.isArray(leadsList)).toBeTruthy();
  });

  test('POST /leads - creates a new lead', async () => {
    const response = await leadApi.create({
      title: `API Lead ${Helper.uniqueString()}`,
      company_name: 'Business Thrust Pte Ltd',
      contact_name: 'API Tester',
      email_address: Helper.uniqueEmail(),
      source: 'API',
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    createdLeadId = body.id ?? body.data?.id;
    expect(createdLeadId).toBeTruthy();
  });

  test('PUT /leads/:id - updates the lead', async () => {
    test.skip(!createdLeadId, 'Requires a lead created in a prior test');
    const response = await leadApi.update(createdLeadId, { title: `Updated ${Helper.uniqueString()}` });
    expect(response.status()).toBe(200);
  });

  test('DELETE /leads/:id - removes the lead', async () => {
    test.skip(!createdLeadId, 'Requires a lead created in a prior test');
    const response = await leadApi.delete(createdLeadId);
    expect([200, 204]).toContain(response.status());
    createdLeadId = 0 as unknown as string;
  });
});
