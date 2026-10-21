import { test, expect } from '../fixtures/testFixture';
import { ConfigManager } from '../utils/configManager';

test.describe('API Tests', () => {
  const adminEmail = ConfigManager.getUsername();
  const adminPassword = ConfigManager.getPassword();

  test('TC301 - API - Login endpoint', async ({ authAPI }) => {
	const response = await authAPI.login(adminEmail, adminPassword);
	expect(response.status).toBe(200);
	expect(response.data).toHaveProperty('token');
  });

  test('TC302 - API - Invalid login', async ({ authAPI }) => {
	try {
	  await authAPI.login('invalid@test.com', 'wrongpassword');
	  expect.fail('Should have thrown error');
	} catch (error) {
	  expect(error).toBeDefined();
	}
  });

  test('TC303 - API - Get all leads', async ({ leadsAPI, authAPI }) => {
	await authAPI.login(adminEmail, adminPassword);
	leadsAPI.setAuthToken((await authAPI.login(adminEmail, adminPassword)).data.token);
	const response = await leadsAPI.getAllLeads();
	expect(response.status).toBe(200);
	expect(Array.isArray(response.data)).toBe(true);
  });

  test('TC304 - API - Create lead via API', async ({ leadsAPI, authAPI }) => {
	const token = (await authAPI.login(adminEmail, adminPassword)).data.token;
	leadsAPI.setAuthToken(token);

	const response = await leadsAPI.createLead({
	  title: 'API Test Lead',
	  companyName: 'Test Company',
	  contactName: 'Test Contact',
	  email: 'test@example.com',
	});

	expect(response.status).toBe(201);
	expect(response.data).toHaveProperty('id');
  });

  test('TC305 - API - Get all customers', async ({ customersAPI, authAPI }) => {
	const token = (await authAPI.login(adminEmail, adminPassword)).data.token;
	customersAPI.setAuthToken(token);

	const response = await customersAPI.getAllCustomers();
	expect(response.status).toBe(200);
	expect(Array.isArray(response.data)).toBe(true);
  });

  test('TC306 - API - Verify token', async ({ authAPI }) => {
	const loginResponse = await authAPI.login(adminEmail, adminPassword);
	const verifyResponse = await authAPI.verifyToken();
	expect(verifyResponse.status).toBe(200);
  });
});
