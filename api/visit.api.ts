import { apiClient } from './apiClient';

export interface VisitPayload {
  title: string;
  customer_id: string | number;
  technician_id?: string | number;
  date: string;
  notes?: string;
}

/**
 * visit.api.ts
 * CRUD + cancel operations for the Visits module.
 */
export class VisitApi {
  async getAll(params?: Record<string, string>) {
    return apiClient.get('/visits', params);
  }

  async getById(id: string | number) {
    return apiClient.get(`/visits/${id}`);
  }

  async create(payload: VisitPayload) {
    return apiClient.post('/visits', payload);
  }

  async update(id: string | number, payload: Partial<VisitPayload>) {
    return apiClient.put(`/visits/${id}`, payload);
  }

  async cancel(id: string | number) {
    return apiClient.patch(`/visits/${id}/cancel`, {});
  }

  async delete(id: string | number) {
    return apiClient.delete(`/visits/${id}`);
  }
}

export const visitApi = new VisitApi();
