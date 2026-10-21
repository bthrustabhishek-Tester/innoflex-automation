import { AxiosResponse } from 'axios';
import { BaseAPI } from './baseAPI';
import { ConfigManager } from '../utils/configManager';

/**
 * AuthAPI - Authentication API endpoints
 */
export class AuthAPI extends BaseAPI {
  constructor() {
	super(ConfigManager.getAPIBaseURL());
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Logging in user: ${email}`);
	  const response = await this.post<any>('/auth/login', {
		email,
		password,
	  });
	  if (response.data.token) {
		this.setAuthToken(response.data.token);
	  }
	  return response;
	} catch (error) {
	  this.logger.error(`Login failed for ${email}`, error);
	  throw error;
	}
  }

  /**
   * Logout
   */
  async logout(): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info('Logging out');
	  const response = await this.post<any>('/auth/logout', {});
	  this.clearAuth();
	  return response;
	} catch (error) {
	  this.logger.error('Logout failed', error);
	  throw error;
	}
  }

  /**
   * Verify token
   */
  async verifyToken(): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info('Verifying token');
	  return await this.get<any>('/auth/verify');
	} catch (error) {
	  this.logger.error('Token verification failed', error);
	  throw error;
	}
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info('Refreshing token');
	  const response = await this.post<any>('/auth/refresh', {});
	  if (response.data.token) {
		this.setAuthToken(response.data.token);
	  }
	  return response;
	} catch (error) {
	  this.logger.error('Token refresh failed', error);
	  throw error;
	}
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info(`Resetting password for: ${email}`);
	  return await this.post<any>('/auth/reset-password', { email });
	} catch (error) {
	  this.logger.error(`Password reset failed for ${email}`, error);
	  throw error;
	}
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<AxiosResponse<any>> {
	try {
	  this.logger.info('Changing password');
	  return await this.post<any>('/auth/change-password', {
		currentPassword,
		newPassword,
	  });
	} catch (error) {
	  this.logger.error('Change password failed', error);
	  throw error;
	}
  }
}

export default AuthAPI;
