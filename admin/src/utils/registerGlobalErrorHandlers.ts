import { reportClientError } from '@/utils/errorReporting';

/**
 * Registers window-level error listeners — see 04_TASKS.md P11-T006. Returns a
 * cleanup function so the registration can be tied to the app lifecycle.
 */
export function registerGlobalErrorHandlers(): () => void {
  const handleError = (event: ErrorEvent): void => {
    reportClientError({
      message: event.message,
      stack: event.error instanceof Error ? event.error.stack : undefined,
    });
  };

  const handleUnhandledRejection = (event: PromiseRejectionEvent): void => {
    const reason = event.reason;
    reportClientError({
      message: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  };

  window.addEventListener('error', handleError);
  window.addEventListener('unhandledrejection', handleUnhandledRejection);

  return () => {
    window.removeEventListener('error', handleError);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
  };
}
