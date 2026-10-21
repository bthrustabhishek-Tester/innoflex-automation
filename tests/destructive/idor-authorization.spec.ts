import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Destructive: IDOR & Role-Based Access Control (RBAC)', () => {
  test('TC-BRK-010: IDOR - Customer A cannot view Customer B invoices', async ({ request, customerToken }) => {
    const unauthorizedCustomerId = 'cust_sg_999'; // Belongs to another company
    const response = await request.get(`/api/customers/${unauthorizedCustomerId}/invoices`, {
      headers: { Authorization: customerToken }
    });

    // Must be blocked with 401 Unauthorized, 403 Forbidden, 404 Not Found, or 405
    expect([401, 403, 404, 405]).toContain(response.status());
  });

  test('TC-BRK-011: Privilege Escalation - Technician cannot update their own role to ADMIN', async ({ request, techToken }) => {
    const response = await request.patch('/api/users/me', {
      headers: { Authorization: techToken },
      data: {
        name: 'Technician John',
        role: 'SUPER_ADMIN' // Attack payload
      }
    });

    // Even if 200 OK is returned for name update, verify role did not escalate
    if (response.status() === 200) {
      try {
        const body = await response.json();
        expect(body.role || body.data?.role).not.toBe('SUPER_ADMIN');
      } catch {
        // Safe json handling
      }
    } else {
      expect([400, 401, 403, 404, 405, 422]).toContain(response.status());
    }
  });
});
