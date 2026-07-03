import { toast, type ToastOptions } from 'react-toastify';

/**
 * Centralized toast/snackbar helper — see 01_AGENTS.md § Snackbar Rules.
 * Always use these helpers instead of calling `react-toastify` directly, and
 * never use `window.alert`/`window.confirm` (browser alerts are forbidden).
 */
const DEFAULT_OPTIONS: ToastOptions = {
  position: 'top-right',
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
};

export const showSuccessToast = (message: string): void => {
  toast.success(message, DEFAULT_OPTIONS);
};

export const showErrorToast = (message: string): void => {
  toast.error(message, DEFAULT_OPTIONS);
};

export const showWarningToast = (message: string): void => {
  toast.warning(message, DEFAULT_OPTIONS);
};

export const showInfoToast = (message: string): void => {
  toast.info(message, DEFAULT_OPTIONS);
};
