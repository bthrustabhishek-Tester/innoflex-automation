/* eslint-disable no-console */

type LogLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR' | 'STEP';

const colors: Record<LogLevel, string> = {
  INFO: '\x1b[36m', // cyan
  DEBUG: '\x1b[90m', // grey
  WARN: '\x1b[33m', // yellow
  ERROR: '\x1b[31m', // red
  STEP: '\x1b[32m', // green
};
const RESET = '\x1b[0m';

function timestamp(): string {
  return new Date().toISOString();
}

function write(level: LogLevel, message: string, meta?: unknown): void {
  const color = colors[level] || '';
  const prefix = `${color}[${timestamp()}] [${level}]${RESET}`;
  if (meta !== undefined) {
    console.log(`${prefix} ${message}`, meta);
  } else {
    console.log(`${prefix} ${message}`);
  }
}

export const logger = {
  info: (message: string, meta?: unknown) => write('INFO', message, meta),
  debug: (message: string, meta?: unknown) => write('DEBUG', message, meta),
  warn: (message: string, meta?: unknown) => write('WARN', message, meta),
  error: (message: string, meta?: unknown) => write('ERROR', message, meta),
  step: (message: string, meta?: unknown) => write('STEP', message, meta),
};
