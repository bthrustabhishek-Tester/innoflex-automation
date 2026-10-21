import * as dotenv from 'dotenv';

dotenv.config();

/**
 * ConfigManager - Centralized configuration management
 * Provides access to all environment variables and configuration values
 */
export class ConfigManager {
  // Environment
  static ENV = process.env.ENV || 'stg';

  // URLs
  static getBaseURL(): string {
	const urlMap: Record<string, string | undefined> = {
	  dev: process.env.DEV_URL,
	  stg: process.env.STG_URL,
	  uat: process.env.UAT_URL,
	  prod: process.env.PROD_URL,
	};
	return urlMap[this.ENV] || process.env.STG_URL || 'https://stg-innoflex.businessthrust.com/admin/login';
  }

  static getLoginURL(): string {
	return this.getBaseURL();
  }

  static getAPIBaseURL(): string {
	const apiMap: Record<string, string | undefined> = {
	  dev: process.env.API_BASE_URL_DEV,
	  stg: process.env.API_BASE_URL_STG,
	  uat: process.env.API_BASE_URL_UAT,
	  prod: process.env.API_BASE_URL_PROD,
	};
	return apiMap[this.ENV] || process.env.API_BASE_URL_STG || 'https://stg-innoflex.businessthrust.com/api';
  }

  // Credentials
  static getUsername(): string {
	const credMap: Record<string, string | undefined> = {
	  dev: process.env.DEV_USERNAME,
	  stg: process.env.STG_USERNAME,
	  uat: process.env.UAT_USERNAME,
	  prod: process.env.PROD_USERNAME,
	};
	return credMap[this.ENV] || process.env.STG_USERNAME || 'admin@bthrust.com';
  }

  static getPassword(): string {
	const credMap: Record<string, string | undefined> = {
	  dev: process.env.DEV_PASSWORD,
	  stg: process.env.STG_PASSWORD,
	  uat: process.env.UAT_PASSWORD,
	  prod: process.env.PROD_PASSWORD,
	};
	return credMap[this.ENV] || process.env.STG_PASSWORD || '#<5Xy0zRGu41';
  }

  // Test Users
  static getTestUserEmail(): string {
	return process.env.TEST_USER_EMAIL || 'testuser@bthrust.com';
  }

  static getTestUserPassword(): string {
	return process.env.TEST_USER_PASSWORD || 'TestPass123';
  }

  // Timeouts
  static getDefaultTimeout(): number {
	return parseInt(process.env.DEFAULT_TIMEOUT || '30000', 10);
  }

  static getNavigationTimeout(): number {
	return parseInt(process.env.NAVIGATION_TIMEOUT || '45000', 10);
  }

  static getAPITimeout(): number {
	return parseInt(process.env.API_TIMEOUT || '30000', 10);
  }

  // Playwright Settings
  static isHeadless(): boolean {
	return (process.env.HEADLESS || 'true').toLowerCase() === 'true';
  }

  static getRetries(): number {
	return parseInt(process.env.RETRIES || '0', 10);
  }

  static getWorkers(): number {
	return parseInt(process.env.WORKERS || '4', 10);
  }

  static getBrowser(): string {
	return process.env.BROWSER || 'chromium';
  }

  // Logging
  static getLogLevel(): string {
	return process.env.LOG_LEVEL || 'info';
  }

  static getLogDir(): string {
	return process.env.LOG_DIR || 'logs';
  }

  // Screenshots & Videos
  static isScreenshotOnFailure(): boolean {
	return (process.env.SCREENSHOT_ON_FAILURE || 'true').toLowerCase() === 'true';
  }

  static isVideoOnFailure(): boolean {
	return (process.env.VIDEO_ON_FAILURE || 'true').toLowerCase() === 'true';
  }

  static isCollectTraces(): boolean {
	return (process.env.COLLECT_TRACES || 'true').toLowerCase() === 'true';
  }

  // Directories
  static getReportDir(): string {
	return process.env.REPORT_DIR || 'reports';
  }

  static getScreenshotDir(): string {
	return process.env.SCREENSHOT_DIR || 'screenshots';
  }

  static getVideoDir(): string {
	return process.env.VIDEO_DIR || 'videos';
  }

  static getTraceDir(): string {
	return process.env.TRACE_DIR || 'traces';
  }

  // Feature Flags
  static isHARMockingEnabled(): boolean {
	return (process.env.ENABLE_HAR_MOCKING || 'false').toLowerCase() === 'true';
  }

  static isPerformanceMetricsEnabled(): boolean {
	return (process.env.ENABLE_PERFORMANCE_METRICS || 'false').toLowerCase() === 'true';
  }

  static isAccessibilityChecksEnabled(): boolean {
	return (process.env.ENABLE_ACCESSIBILITY_CHECKS || 'false').toLowerCase() === 'true';
  }

  // CI/CD
  static isCI(): boolean {
	return (process.env.CI || 'false').toLowerCase() === 'true';
  }

  // Notifications
  static getSlackWebhookURL(): string | undefined {
	return process.env.SLACK_WEBHOOK_URL;
  }

  static getSlackChannel(): string | undefined {
	return process.env.SLACK_CHANNEL;
  }

  static getEmailRecipient(): string | undefined {
	return process.env.EMAIL_RECIPIENT;
  }

  // Print all config (for debugging)
  static printConfig(): void {
	console.log('=== Innoflex Automation Framework Configuration ===');
	console.log(`Environment: ${this.ENV}`);
	console.log(`Base URL: ${this.getBaseURL()}`);
	console.log(`API Base URL: ${this.getAPIBaseURL()}`);
	console.log(`Headless: ${this.isHeadless()}`);
	console.log(`Retries: ${this.getRetries()}`);
	console.log(`Workers: ${this.getWorkers()}`);
	console.log(`Default Timeout: ${this.getDefaultTimeout()}ms`);
	console.log(`Navigation Timeout: ${this.getNavigationTimeout()}ms`);
	console.log('====================================================');
  }
}

export default ConfigManager;
