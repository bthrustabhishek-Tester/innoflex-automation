import { AxiosResponse } from 'axios';
import { BaseAPI } from './baseAPI';

/**
 * VisitsAPI - Visits API endpoints
 */
export class VisitsAPI extends BaseAPI {
  private readonly endpoint = '/visits';

  /**
   * Get all visits
   */
  async getAllVisits(params?: any): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info('Fetching all visits');
	  return await this.get<any>(this.endpoint, { params });
	} catch (error) {
	  this.logger.error('Failed to fetch visits', error);
	  throw error;
	}
  }

  /**
   * Get visit by ID
   */
  async getVisitById(visitId: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Fetching visit: ${visitId}`);
	  return await this.get<any>(`${this.endpoint}/${visitId}`);
	} catch (error) {
	  this.logger.error(`Failed to fetch visit ${visitId}`, error);
	  throw error;
	}
  }

  /**
   * Create new visit
   */
  async createVisit(visitData: {
	customerId: string;
	technicianId: string;
	date: string;
	startTime: string;
	endTime: string;
	status?: string;
	notes?: string;
  }): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Creating visit for customer: ${visitData.customerId}`);
	  return await this.post<any>(this.endpoint, visitData);
	} catch (error) {
	  this.logger.error('Failed to create visit', error);
	  throw error;
	}
  }

  /**
   * Update visit
   */
  async updateVisit(visitId: string, visitData: any): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Updating visit: ${visitId}`);
	  return await this.put<any>(`${this.endpoint}/${visitId}`, visitData);
	} catch (error) {
	  this.logger.error(`Failed to update visit ${visitId}`, error);
	  throw error;
	}
  }

  /**
   * Cancel visit
   */
  async cancelVisit(visitId: string, reason?: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Cancelling visit: ${visitId}`);
	  return await this.patch<any>(`${this.endpoint}/${visitId}/cancel`, { reason });
	} catch (error) {
	  this.logger.error(`Failed to cancel visit ${visitId}`, error);
	  throw error;
	}
  }

  /**
   * Complete visit
   */
  async completeVisit(visitId: string, completionData?: any): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Completing visit: ${visitId}`);
	  return await this.patch<any>(`${this.endpoint}/${visitId}/complete`, completionData);
	} catch (error) {
	  this.logger.error(`Failed to complete visit ${visitId}`, error);
	  throw error;
	}
  }

  /**
   * Delete visit
   */
  async deleteVisit(visitId: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Deleting visit: ${visitId}`);
	  return await this.delete<any>(`${this.endpoint}/${visitId}`);
	} catch (error) {
	  this.logger.error(`Failed to delete visit ${visitId}`, error);
	  throw error;
	}
  }

  /**
   * Get visits by customer
   */
  async getVisitsByCustomer(customerId: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Fetching visits for customer: ${customerId}`);
	  return await this.get<any>(this.endpoint, { params: { customerId } });
	} catch (error) {
	  this.logger.error(`Failed to fetch visits for customer ${customerId}`, error);
	  throw error;
	}
  }

  /**
   * Get visits by technician
   */
  async getVisitsByTechnician(technicianId: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Fetching visits for technician: ${technicianId}`);
	  return await this.get<any>(this.endpoint, { params: { technicianId } });
	} catch (error) {
	  this.logger.error(`Failed to fetch visits for technician ${technicianId}`, error);
	  throw error;
	}
  }

  /**
   * Get visits by status
   */
  async getVisitsByStatus(status: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Fetching visits with status: ${status}`);
	  return await this.get<any>(this.endpoint, { params: { status } });
	} catch (error) {
	  this.logger.error(`Failed to fetch visits by status ${status}`, error);
	  throw error;
	}
  }
}

export default VisitsAPI;
