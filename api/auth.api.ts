import { apiClient } from './apiClient';
import { config } from '../utils/config';

export interface LoginPayload {
  email?: string;
  user_email?: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number | string;
    email: string;
    name?: string;
  };
  data?: any;
}

/**
 * auth.api.ts
 * POST /auth/login
 * Body: { "user_email": "...", "password": "..." }
 * Response contains { data: { auth: { access_token: "..." }, user: { ... } } }
 */
export class AuthApi {
  async login(payload: LoginPayload = { email: config.username, password: config.password }) {
    const emailVal = payload.user_email || payload.email || config.username;
    const body: Record<string, any> = {
      user_email: emailVal,
      password: payload.password !== undefined ? payload.password : config.password,
    };
    const response = await apiClient.post('/auth/login', body);
    return response;
  }

  /** Login and automatically store the bearer token on the shared apiClient for subsequent calls */
  async loginAndStoreToken(payload?: LoginPayload): Promise<LoginResponse> {
    const response = await this.login(payload);
    const body = await response.json();
    const token = body?.data?.auth?.access_token || body?.token || '';
    if (token) {
      apiClient.setToken(token);
    }
    const userObj = body?.data?.user || body?.user || {};
    return {
      token,
      user: {
        id: userObj.id || '',
        email: userObj.user_email || userObj.email || config.username,
        name: userObj.display_name || userObj.first_name || userObj.name || '',
      },
      data: body.data,
    };
  }

  async logout() {
    return apiClient.post('/auth/logout', {});
  }
}

export const authApi = new AuthApi();
