import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Destructive: Business Logic & Financial Integrity', () => {
  test('TC-BRK-007: Negative Amounts, Quantities, and Invalid Discount (>100%) must be rejected', async ({ request, adminToken }) => {
    const malformedInvoice = {
      customerId: 'cust_sg_101',
      items: [
        { description: 'HVAC Maintenance', quantity: -3, unitPrice: 200 },
        { description: 'Filter Replacement', quantity: 1, unitPrice: -50 }
      ],
      discountPercentage: 150 // Impossible discount
    };

    const response = await request.post('/api/invoices', {
      headers: { Authorization: adminToken },
      data: malformedInvoice
    });

    // Must be rejected or invalid, never treated as successful positive transaction
    expect(response.status()).not.toBe(200);
    expect(response.status()).not.toBe(201);
  });

  test('TC-BRK-008: State Machine Bypass - Direct PENDING to INVOICE_PAID without Visit completion', async ({ request, adminToken }) => {
    // Attempting direct terminal state transition
    const response = await request.patch('/api/visits/visit_123/status', {
      headers: { Authorization: adminToken },
      data: { status: 'COMPLETED_AND_BILLED' }
    });

    // If visit was never assigned or started, state change should fail
    expect([400, 404, 405, 422]).toContain(response.status());
  });

  test('TC-BRK-009: Invalid Date Ranges (EndDate earlier than StartDate)', async ({ request, adminToken }) => {
    const response = await request.post('/api/contracts', {
      headers: { Authorization: adminToken },
      data: {
        customerId: 'cust_sg_101',
        startDate: '2026-12-31T00:00:00Z',
        endDate: '2026-01-01T00:00:00Z', // Past date!
        contractType: 'ANNUAL_MAINTENANCE'
      }
    });

    expect([400, 404, 405, 422]).toContain(response.status());
  });
});
