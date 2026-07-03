import { env } from '@/config/env';
import { logger } from '@/utils/logger';

export interface ClientErrorReport {
  readonly message: string;
  readonly stack?: string;
  readonly componentStack?: string;
  readonly url: string;
  readonly timestamp: string;
  readonly userAgent: string;
}

interface ReportClientErrorInput {
  readonly message: string;
  readonly stack?: string;
  readonly componentStack?: string;
}

/**
 * Central client-side error reporter — see 09_PERFORMANCE.md § Monitoring and
 * 04_TASKS.md P11-T006. Development logs to the console; production optionally
 * POSTs to `VITE_ERROR_REPORT_URL` when configured (Sentry integration can
 * replace this hook later without touching call sites).
 */
export function reportClientError(input: ReportClientErrorInput): void {
  const payload: ClientErrorReport = {
    message: input.message,
    stack: input.stack,
    componentStack: input.componentStack,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  if (env.isDev) {
    logger.error(payload.message, payload);
    return;
  }

  if (!env.errorReportUrl) {
    return;
  }

  void fetch(env.errorReportUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => undefined);
}
