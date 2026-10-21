import { test, expect } from '../../fixtures/auth.fixture';

test.describe('Destructive: Race Conditions & Concurrent Exploits', () => {
  test('TC-BRK-001: Double-Click / Rapid Concurrent Requests must NOT create duplicate invoices', async ({ request, adminToken }) => {
    const payload = {
      customerId: 'cust_sg_101',
      quotationId: 'quot_sg_808',
      amount: 1500.00,
      currency: 'SGD',
      idempotencyKey: `test-idemp-key-${Date.now()}`
    };

    // 5 concurrent requests fired at exactly the same time
    const requests = Array.from({ length: 5 }).map(() =>
      request.post('/api/invoices', {
        headers: { Authorization: adminToken },
        data: payload
      })
    );

    const responses = await Promise.all(requests);
    const statusCodes = responses.map(res => res.status());

    // Expectation: System handles concurrent bursts safely (e.g., 405/404 if route not active or 1 success with others 409/422/429)
    // Never allow more than 1 creation
    const successCount = statusCodes.filter(code => code === 201 || code === 200).length;
    expect(successCount, 'System allowed multiple duplicate invoices via race condition!').toBeLessThanOrEqual(1);
  });

  test('TC-BRK-002: Technician Overlap Conflict - Prevent parallel booking at the same timeslot', async ({ request, adminToken }) => {
    const technicianId = 'tech_sg_404';
    const timeSlot = {
      startTime: '2026-11-01T10:00:00Z',
      endTime: '2026-11-01T12:00:00Z'
    };

    const booking1 = request.post('/api/visits', {
      headers: { Authorization: adminToken },
      data: { customerId: 'cust_01', technicianId, ...timeSlot, service: 'AC Repair' }
    });

    const booking2 = request.post('/api/visits', {
      headers: { Authorization: adminToken },
      data: { customerId: 'cust_02', technicianId, ...timeSlot, service: 'Compressor Check' }
    });

    const [res1, res2] = await Promise.all([booking1, booking2]);
    const codes = [res1.status(), res2.status()];

    // One must not silently double-book the technician: either rejected or max 1 successful booking
    const successfulBookings = codes.filter(c => c === 201 || c === 200).length;
    expect(successfulBookings, 'Technician cannot have parallel overlapping bookings').toBeLessThanOrEqual(1);
  });
});
