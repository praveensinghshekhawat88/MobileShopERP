/**
 * Centralized logging utility — see 01_AGENTS.md § Logging Rules.
 *
 * `console.log()` is forbidden everywhere. `console.error()` is only permitted
 * during development. Never log JWTs, passwords, or other sensitive data
 * (see 08_SECURITY.md § Logging).
 */
export const logger = {
  warn(message: string, context?: unknown): void {
    if (import.meta.env.DEV) {
      console.warn(message, context ?? '');
    }
  },
  error(message: string, error?: unknown): void {
    if (import.meta.env.DEV) {
      console.error(message, error ?? '');
    }
  },
};
