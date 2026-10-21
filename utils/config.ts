import * as dotenv from 'dotenv';
dotenv.config();

/**
 * Supported environments
 */
export type EnvName = 'dev' | 'stg' | 'uat' | 'prod';

/**
 * Central configuration reader.
 * Reads the active ENV from process.env.ENV (default: stg)
 * and resolves the corresponding URL / credentials / API base url.
 */
class Config {
  public readonly env: EnvName;

  constructor() {
    this.env = (process.env.ENV as EnvName) || 'stg';
  }

  private get(key: string): string {
    const value = process.env[key];
    if (!value) {
      // Don't throw for optional/unused envs (dev/uat/prod may be blank in this project)
      return '';
    }
    return value;
  }

  /** Base application URL (login page) for the active environment */
  get baseUrl(): string {
    switch (this.env) {
      case 'dev':
        return this.get('DEV_URL');
      case 'uat':
        return this.get('UAT_URL');
      case 'prod':
        return this.get('PROD_URL');
      case 'stg':
      default:
        return this.get('STG_URL');
    }
  }

  /** Username for the active environment */
  get username(): string {
    switch (this.env) {
      case 'dev':
        return this.get('DEV_USERNAME');
      case 'uat':
        return this.get('UAT_USERNAME');
      case 'prod':
        return this.get('PROD_USERNAME');
      case 'stg':
      default:
        return this.get('STG_USERNAME');
    }
  }

  /** Password for the active environment */
  get password(): string {
    switch (this.env) {
      case 'dev':
        return this.get('DEV_PASSWORD');
      case 'uat':
        return this.get('UAT_PASSWORD');
      case 'prod':
        return this.get('PROD_PASSWORD');
      case 'stg':
      default:
        return this.get('STG_PASSWORD');
    }
  }

  /** API base URL for the active environment */
  get apiBaseUrl(): string {
    switch (this.env) {
      case 'dev':
        return this.get('API_BASE_URL_DEV');
      case 'uat':
        return this.get('API_BASE_URL_UAT');
      case 'prod':
        return this.get('API_BASE_URL_PROD');
      case 'stg':
      default:
        return this.get('API_BASE_URL_STG');
    }
  }

  get defaultTimeout(): number {
    return Number(this.get('DEFAULT_TIMEOUT')) || 30000;
  }

  get navigationTimeout(): number {
    return Number(this.get('NAVIGATION_TIMEOUT')) || 45000;
  }

  get headless(): boolean {
    return (this.get('HEADLESS') || 'true').toLowerCase() !== 'false';
  }

  get retries(): number {
    return Number(this.get('RETRIES')) || 0;
  }

  get workers(): number {
    return Number(this.get('WORKERS')) || 1;
  }
}

export const config = new Config();
