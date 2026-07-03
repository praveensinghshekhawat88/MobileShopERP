/**
 * Single point of access for environment variables — see 01_AGENTS.md § Environment
 * Variables and § Environment Rules. Never read `import.meta.env` anywhere else.
 */
function requireEnv(key: keyof ImportMetaEnv): string {
  const value = import.meta.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  apiBaseUrl: requireEnv('VITE_API_BASE_URL'),
  apiTimeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 30_000,
  appName: import.meta.env.VITE_APP_NAME || 'Mobile Shop ERP',
  /** Optional production error ingest endpoint — see P11-T006. */
  errorReportUrl: import.meta.env.VITE_ERROR_REPORT_URL || '',
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
} as const;
