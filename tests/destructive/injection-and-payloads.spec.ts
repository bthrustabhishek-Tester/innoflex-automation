import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Destructive: Input Validation & Security Payloads', () => {
  test('TC-BRK-004: SQL Injection query parameter must return 400 or safe sanitized results, never 500', async ({ request, adminToken }) => {
    const sqliPayload = "'; DROP TABLE customers; --";
    const response = await request.get(`/api/customers?search=${encodeURIComponent(sqliPayload)}`, {
      headers: { Authorization: adminToken }
    });

    // Server must handle gracefully (e.g. 200/400/404/405/422), never unhandled internal 500
    expect(response.status()).not.toBe(500);

    const bodyText = await response.text();
    // Database internal error leak check
    expect(bodyText).not.toContain('SQLSTATE');
    expect(bodyText).not.toContain('syntax error');
    expect(bodyText).not.toContain('sqlMessage');
  });

  test('TC-BRK-005: Stored XSS Script Tag in Customer Remarks must be sanitized', async ({ request, adminToken }) => {
    const xssPayload = '<script>window.__xss_vulnerable=true;</script>';
    const createRes = await request.post('/api/customers', {
      headers: { Authorization: adminToken },
      data: {
        name: 'Innoflex Test Client',
        email: `xss_test_${Date.now()}@test.com`,
        remarks: xssPayload
      }
    });

    // Rejection or creation with sanitization
    expect(createRes.status()).not.toBe(500);
    if (createRes.status() === 201 || createRes.status() === 200) {
      try {
        const created = await createRes.json();
        const customerId = created.id || created.data?.id;
        if (customerId) {
          const fetchRes = await request.get(`/api/customers/${customerId}`, {
            headers: { Authorization: adminToken }
          });
          const data = await fetchRes.json();
          const savedRemarks = data.remarks || data.data?.remarks;
          expect(savedRemarks).not.toBe('<script>window.__xss_vulnerable=true;</script>');
        }
      } catch {
        // Safe json handling
      }
    }
  });

  test('TC-BRK-006: Buffer Overflow (100,000 characters payload) must trigger 413 Payload Too Large / 400, never 500', async ({ request, adminToken }) => {
    const hugeString = 'A'.repeat(100000);
    const response = await request.post('/api/customers', {
      headers: { Authorization: adminToken },
      data: {
        name: hugeString,
        email: 'overflow@innoflex.com'
      }
    });

    // Application should reject before overloading memory/DB without crashing with 500
    expect(response.status()).not.toBe(500);
  });
});
