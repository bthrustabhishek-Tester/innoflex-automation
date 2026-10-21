import { APIRequestContext, request } from '@playwright/test';
import { config } from '../utils/config';
import { logger } from '../utils/logger';

/**
 * Thin wrapper around Playwright's APIRequestContext.
 * Centralizes base URL, default headers, and bearer-token injection
 * so individual *.api.ts files stay declarative.
 */
export class ApiClient {
  private context: APIRequestContext | null = null;
  private token: string | null = null;

  async init(): Promise<APIRequestContext> {
    if (!this.context) {
      this.context = await request.newContext({
        baseURL: config.apiBaseUrl,
        extraHTTPHeaders: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
    }
    return this.context;
  }

  setToken(token: string): void {
    this.token = token;
  }

  private authHeaders(): Record<string, string> {
    return this.token ? { Authorization: `Bearer ${this.token}` } : {};
  }

  private resolveUrl(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }
    const base = config.apiBaseUrl.replace(/\/+$/, '');
    const path = endpoint.replace(/^\/+/, '');
    return `${base}/${path}`;
  }

  async get(endpoint: string, params?: Record<string, string>) {
    const ctx = await this.init();
    const url = this.resolveUrl(endpoint);
    logger.info(`GET ${url}`, params);
    return ctx.get(url, { params, headers: this.authHeaders() });
  }

  async post(endpoint: string, data: unknown) {
    const ctx = await this.init();
    const url = this.resolveUrl(endpoint);
    logger.info(`POST ${url}`, data);
    return ctx.post(url, { data, headers: this.authHeaders() });
  }

  async put(endpoint: string, data: unknown) {
    const ctx = await this.init();
    const url = this.resolveUrl(endpoint);
    logger.info(`PUT ${url}`, data);
    return ctx.put(url, { data, headers: this.authHeaders() });
  }

  async patch(endpoint: string, data: unknown) {
    const ctx = await this.init();
    const url = this.resolveUrl(endpoint);
    logger.info(`PATCH ${url}`, data);
    return ctx.patch(url, { data, headers: this.authHeaders() });
  }

  async delete(endpoint: string) {
    const ctx = await this.init();
    const url = this.resolveUrl(endpoint);
    logger.info(`DELETE ${url}`);
    return ctx.delete(url, { headers: this.authHeaders() });
  }

  async dispose(): Promise<void> {
    await this.context?.dispose();
    this.context = null;
  }
}

export const apiClient = new ApiClient();
