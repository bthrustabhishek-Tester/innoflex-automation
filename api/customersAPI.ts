import { AxiosResponse } from 'axios';
import { BaseAPI } from './baseAPI';

/**
 * CustomersAPI - Customers API endpoints
 */
export class CustomersAPI extends BaseAPI {
  private readonly endpoint = '/customers';

  /**
   * Get all customers
   */
  async getAllCustomers(params?: any): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info('Fetching all customers');
	  return await this.get<any>(this.endpoint, { params });
	} catch (error) {
	  this.logger.error('Failed to fetch customers', error);
	  throw error;
	}
  }

  /**
   * Get customer by ID
   */
  async getCustomerById(customerId: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Fetching customer: ${customerId}`);
	  return await this.get<any>(`${this.endpoint}/${customerId}`);
	} catch (error) {
	  this.logger.error(`Failed to fetch customer ${customerId}`, error);
	  throw error;
	}
  }

  /**
   * Create new customer
   */
  async createCustomer(customerData: {
	name: string;
	email: string;
	phone: string;
	address?: string;
	city?: string;
	state?: string;
	zip?: string;
  }): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Creating customer: ${customerData.name}`);
	  return await this.post<any>(this.endpoint, customerData);
	} catch (error) {
	  this.logger.error('Failed to create customer', error);
	  throw error;
	}
  }

  /**
   * Update customer
   */
  async updateCustomer(customerId: string, customerData: any): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Updating customer: ${customerId}`);
	  return await this.put<any>(`${this.endpoint}/${customerId}`, customerData);
	} catch (error) {
	  this.logger.error(`Failed to update customer ${customerId}`, error);
	  throw error;
	}
  }

  /**
   * Delete customer
   */
  async deleteCustomer(customerId: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Deleting customer: ${customerId}`);
	  return await this.delete<any>(`${this.endpoint}/${customerId}`);
	} catch (error) {
	  this.logger.error(`Failed to delete customer ${customerId}`, error);
	  throw error;
	}
  }

  /**
   * Search customers
   */
  async searchCustomers(searchTerm: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Searching customers: ${searchTerm}`);
	  return await this.get<any>(this.endpoint, { params: { search: searchTerm } });
	} catch (error) {
	  this.logger.error(`Search customers failed for term: ${searchTerm}`, error);
	  throw error;
	}
  }

  /**
   * Get customer visits
   */
  async getCustomerVisits(customerId: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Fetching visits for customer: ${customerId}`);
	  return await this.get<any>(`${this.endpoint}/${customerId}/visits`);
	} catch (error) {
	  this.logger.error(`Failed to fetch visits for customer ${customerId}`, error);
	  throw error;
	}
  }

  /**
   * Get customer jobs
   */
  async getCustomerJobs(customerId: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Fetching jobs for customer: ${customerId}`);
	  return await this.get<any>(`${this.endpoint}/${customerId}/jobs`);
	} catch (error) {
	  this.logger.error(`Failed to fetch jobs for customer ${customerId}`, error);
	  throw error;
	}
  }
}

export default CustomersAPI;
