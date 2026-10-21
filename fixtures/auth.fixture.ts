import { test as base, APIRequestContext } from '@playwright/test';
import { authApi } from '../api/auth.api';

type AuthFixtures = {
  adminToken: string;
  techToken: string;
  customerToken: string;
};

export const test = base.extend<AuthFixtures>({
  adminToken: async ({}, use) => {
    let token = process.env.ADMIN_TOKEN;
    if (!token) {
      try {
        const login = await authApi.loginAndStoreToken();
        if (login?.token) {
          token = `Bearer ${login.token}`;
        }
      } catch {
        token = 'Bearer mock-admin-token';
      }
    }
    await use(token || 'Bearer mock-admin-token');
  },

  techToken: async ({}, use) => {
    const token = process.env.TECH_TOKEN || 'Bearer mock-tech-token';
    await use(token);
  },

  customerToken: async ({}, use) => {
    const token = process.env.CUSTOMER_TOKEN || 'Bearer mock-customer-token';
    await use(token);
  },
});

export { expect } from '@playwright/test';
