import { AxiosResponse } from 'axios';
import { BaseAPI } from './baseAPI';

/**
 * LeadsAPI - Leads API endpoints
 */
export class LeadsAPI extends BaseAPI {
  private readonly endpoint = '/leads';

  /**
   * Get all leads
   */
  async getAllLeads(params?: any): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info('Fetching all leads');
	  return await this.get<any>(this.endpoint, { params });
	} catch (error) {
	  this.logger.error('Failed to fetch leads', error);
	  throw error;
	}
  }

  /**
   * Get lead by ID
   */
  async getLeadById(leadId: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Fetching lead: ${leadId}`);
	  return await this.get<any>(`${this.endpoint}/${leadId}`);
	} catch (error) {
	  this.logger.error(`Failed to fetch lead ${leadId}`, error);
	  throw error;
	}
  }

  /**
   * Create new lead
   */
  async createLead(leadData: {
	title: string;
	companyName: string;
	contactName: string;
	email: string;
	phone?: string;
	source?: string;
	assignTo?: string;
  }): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Creating lead: ${leadData.title}`);
	  return await this.post<any>(this.endpoint, leadData);
	} catch (error) {
	  this.logger.error('Failed to create lead', error);
	  throw error;
	}
  }

  /**
   * Update lead
   */
  async updateLead(leadId: string, leadData: any): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Updating lead: ${leadId}`);
	  return await this.put<any>(`${this.endpoint}/${leadId}`, leadData);
	} catch (error) {
	  this.logger.error(`Failed to update lead ${leadId}`, error);
	  throw error;
	}
  }

  /**
   * Partially update lead
   */
  async partialUpdateLead(leadId: string, leadData: any): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Partially updating lead: ${leadId}`);
	  return await this.patch<any>(`${this.endpoint}/${leadId}`, leadData);
	} catch (error) {
	  this.logger.error(`Failed to partially update lead ${leadId}`, error);
	  throw error;
	}
  }

  /**
   * Delete lead
   */
  async deleteLead(leadId: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Deleting lead: ${leadId}`);
	  return await this.delete<any>(`${this.endpoint}/${leadId}`);
	} catch (error) {
	  this.logger.error(`Failed to delete lead ${leadId}`, error);
	  throw error;
	}
  }

  /**
   * Search leads
   */
  async searchLeads(searchTerm: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Searching leads: ${searchTerm}`);
	  return await this.get<any>(this.endpoint, { params: { search: searchTerm } });
	} catch (error) {
	  this.logger.error(`Search leads failed for term: ${searchTerm}`, error);
	  throw error;
	}
  }

  /**
   * Get leads by company
   */
  async getLeadsByCompany(companyId: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Fetching leads for company: ${companyId}`);
	  return await this.get<any>(this.endpoint, { params: { companyId } });
	} catch (error) {
	  this.logger.error(`Failed to fetch leads for company ${companyId}`, error);
	  throw error;
	}
  }

  /**
   * Assign lead
   */
  async assignLead(leadId: string, assigneeId: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Assigning lead ${leadId} to ${assigneeId}`);
	  return await this.patch<any>(`${this.endpoint}/${leadId}`, { assignedTo: assigneeId });
	} catch (error) {
	  this.logger.error(`Failed to assign lead ${leadId}`, error);
	  throw error;
	}
  }

  /**
   * Change lead status
   */
  async changeLeadStatus(leadId: string, status: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Changing lead ${leadId} status to ${status}`);
	  return await this.patch<any>(`${this.endpoint}/${leadId}`, { status });
	} catch (error) {
	  this.logger.error(`Failed to change lead status for ${leadId}`, error);
	  throw error;
	}
  }
}

export default LeadsAPI;
