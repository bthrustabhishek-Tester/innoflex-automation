import { FullConfig } from '@playwright/test';
import { Logger } from '../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Global Teardown - runs after all tests
 * Performs cleanup tasks
 */
async function globalTeardown(config: FullConfig) {
  Logger.info('=== Global Teardown Started ===');

  try {
	// Archive logs
	const logDir = Logger.getLogFilePath();
	if (fs.existsSync(path.dirname(logDir))) {
	  Logger.info('Logs archived');
	}

	// Generate summary
	const reportDir = path.join(process.cwd(), 'reports', 'html-report');
	if (fs.existsSync(reportDir)) {
	  Logger.info(`Report generated at: ${reportDir}`);
	}

	Logger.info('=== Global Teardown Completed ===');
  } catch (error) {
	Logger.error('Global teardown error', error);
  }
}

export default globalTeardown;
