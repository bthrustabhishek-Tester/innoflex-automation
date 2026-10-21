import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ConfigManager } from '../utils/configManager';
import { Logger } from '../utils/logger';

/**
 * BaseAPI - Base class for API automation
 * Provides common functionality for API requests with authentication and error handling
 */
export class BaseAPI {
  protected client: AxiosInstance;
  protected baseURL: string;
  protected timeout: number;
  protected logger: typeof Logger;
  protected authToken: string = '';

  constructor(baseURL?: string, timeout?: number) {
	this.baseURL = baseURL || ConfigManager.getAPIBaseURL();
	this.timeout = timeout || ConfigManager.getAPITimeout();
	this.logger = Logger;

	this.client = axios.create({
	  baseURL: this.baseURL,
	  timeout: this.timeout,
	  headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	  },
	});

	this.setupInterceptors();
  }

  /**
   * Setup axios interceptors for logging and error handling
   */
  private setupInterceptors(): void {
	// Request interceptor
	this.client.interceptors.request.use((config) => {
	  this.logger.info(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
	  if (config.data) {
		this.logger.debug('Request Data:', config.data);
	  }
	  return config;
	});

	// Response interceptor
	this.client.interceptors.response.use(
	  (response) => {
		this.logger.info(`API Response: ${response.status} ${response.statusText}`);
		this.logger.debug('Response Data:', response.data);
		return response;
	  },
	  (error) => {
		if (error.response) {
		  this.logger.error(`API Error: ${error.response.status} - ${error.response.statusText}`, error.response.data);
		} else if (error.request) {
		  this.logger.error('API No Response:', error.request);
		} else {
		  this.logger.error('API Error:', error.message);
		}
		return Promise.reject(error);
	  },
	);
  }

  /**
   * Set authorization token
   */
  setAuthToken(token: string): void {
	this.authToken = token;
	this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	this.logger.info('Authorization token set');
  }

  /**
   * Perform GET request
   */
  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
	try {
	  const response = await this.client.get<T>(endpoint, config);
	  return response;
	} catch (error) {
	  this.logger.error(`GET request failed for ${endpoint}`, error);
	  throw error;
	}
  }

  /**
   * Perform POST request
   */
  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
	try {
	  const response = await this.client.post<T>(endpoint, data, config);
	  return response;
	} catch (error) {
	  this.logger.error(`POST request failed for ${endpoint}`, error);
	  throw error;
	}
  }

  /**
   * Perform PUT request
   */
  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
	try {
	  const response = await this.client.put<T>(endpoint, data, config);
	  return response;
	} catch (error) {
	  this.logger.error(`PUT request failed for ${endpoint}`, error);
	  throw error;
	}
  }

  /**
   * Perform PATCH request
   */
  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
	try {
	  const response = await this.client.patch<T>(endpoint, data, config);
	  return response;
	} catch (error) {
	  this.logger.error(`PATCH request failed for ${endpoint}`, error);
	  throw error;
	}
  }

  /**
   * Perform DELETE request
   */
  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
	try {
	  const response = await this.client.delete<T>(endpoint, config);
	  return response;
	} catch (error) {
	  this.logger.error(`DELETE request failed for ${endpoint}`, error);
	  throw error;
	}
  }

  /**
   * Perform HEAD request
   */
  async head<T>(endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
	try {
	  const response = await this.client.head<T>(endpoint, config);
	  return response;
	} catch (error) {
	  this.logger.error(`HEAD request failed for ${endpoint}`, error);
	  throw error;
	}
  }

  /**
   * Get response status
   */
  getStatus(response: AxiosResponse): number {
	return response.status;
  }

  /**
   * Get response data
   */
  getResponseData<T>(response: AxiosResponse<T>): T {
	return response.data;
  }

  /**
   * Get response headers
   */
  getResponseHeaders(response: AxiosResponse): any {
	return response.headers;
  }

  /**
   * Check if response is success (2xx status)
   */
  isSuccess(response: AxiosResponse): boolean {
	return response.status >= 200 && response.status < 300;
  }

  /**
   * Generic assertion for response
   */
  assertResponseStatus(response: AxiosResponse, expectedStatus: number): void {
	if (response.status !== expectedStatus) {
	  throw new Error(`Expected status ${expectedStatus}, got ${response.status}`);
	}
	this.logger.info(`Response status assertion passed: ${expectedStatus}`);
  }

  /**
   * Generic assertion for response data
   */
  assertResponseData<T>(response: AxiosResponse<T>, expectedData: Partial<T>): void {
	const responseData = this.getResponseData(response);
	for (const key in expectedData) {
	  if (responseData[key] !== expectedData[key]) {
		throw new Error(`Expected ${key}: ${expectedData[key]}, got ${responseData[key]}`);
	  }
	}
	this.logger.info('Response data assertion passed');
  }

  /**
   * Clear authorization
   */
  clearAuth(): void {
	this.authToken = '';
	delete this.client.defaults.headers.common['Authorization'];
	this.logger.info('Authorization token cleared');
  }

  /**
   * Set custom header
   */
  setHeader(key: string, value: string): void {
	this.client.defaults.headers.common[key] = value;
	this.logger.info(`Header set: ${key}`);
  }

  /**
   * Remove custom header
   */
  removeHeader(key: string): void {
	delete this.client.defaults.headers.common[key];
	this.logger.info(`Header removed: ${key}`);
  }
}

export default BaseAPI;
