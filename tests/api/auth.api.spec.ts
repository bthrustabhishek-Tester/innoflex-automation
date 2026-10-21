import { test, expect } from '@playwright/test';
import { authApi } from '../../api/auth.api';
import { apiClient } from '../../api/apiClient';
import loginData from '../../test-data/login.json';

test.describe('Auth API @api', () => {
  test.afterAll(async () => {
    await apiClient.dispose();
  });

  test('POST /auth/login - returns 200 and a token for valid credentials', async () => {
    const response = await authApi.login(loginData.valid);
    expect(response.status()).toBe(200);

    const body = await response.json();
    const token = body?.data?.auth?.access_token || body?.token;
    expect(token).toBeTruthy();
    const userEmail = body?.data?.user?.user_email || body?.user?.email;
    expect(userEmail).toBe(loginData.valid.email);
  });

  test('POST /auth/login - returns error status for invalid credentials', async () => {
    const response = await authApi.login(loginData.invalid.wrongPassword);
    expect([400, 401]).toContain(response.status());
  });

  test('POST /auth/login - returns 422 for empty payload (boundary)', async () => {
    const response = await authApi.login(loginData.boundary.emptyBoth);
    expect([400, 422]).toContain(response.status());
  });
});
