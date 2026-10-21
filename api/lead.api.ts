import { apiClient } from './apiClient';

export interface LeadPayload {
  lead_name?: string;
  title?: string;
  company_name?: string;
  contact_name?: string;
  email?: string;
  email_address?: string;
  source?: string;
  assign_to?: number | string;
  company_type?: string;
  persons?: Array<{ name: string; email: string }>;
}

/**
 * lead.api.ts
 * CRUD operations for the Leads module.
 * - List: GET /leads
 * - Create: POST /lead
 * - Update: PUT /leads/:id
 * - Delete: DELETE /leads/:id
 */
export class LeadApi {
  async getAll(params?: Record<string, string>) {
    return apiClient.get('/leads', params);
  }

  async getById(id: string | number) {
    return apiClient.get(`/leads/${id}`);
  }

  async create(payload: LeadPayload) {
    const body = {
      lead_name: payload.lead_name || payload.title || 'Automated Lead',
      company_type: payload.company_type || 'corporate',
      source: payload.source || 'Web',
      assign_to: payload.assign_to || 1,
      email: payload.email || payload.email_address || 'lead@example.com',
      company_name: payload.company_name || 'Business Thrust Pte Ltd',
      persons: payload.persons || [
        {
          name: payload.contact_name || 'Contact Tester',
          email: payload.email || payload.email_address || 'lead@example.com',
        },
      ],
    };
    return apiClient.post('/lead', body);
  }

  async update(id: string | number, payload: Partial<LeadPayload>) {
    const body = {
      lead_name: payload.lead_name || payload.title || 'Updated Lead',
      company_type: payload.company_type || 'corporate',
      source: payload.source || 'Web',
      assign_to: payload.assign_to || 1,
      email: payload.email || payload.email_address || 'lead@example.com',
      company_name: payload.company_name || 'Business Thrust Pte Ltd',
      persons: payload.persons || [
        {
          name: payload.contact_name || 'Contact Tester',
          email: payload.email || payload.email_address || 'lead@example.com',
        },
      ],
    };
    return apiClient.put(`/leads/${id}`, body);
  }

  async delete(id: string | number) {
    return apiClient.delete(`/leads/${id}`);
  }
}

export const leadApi = new LeadApi();
