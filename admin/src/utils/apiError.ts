import axios from 'axios';

import type { ApiErrorCode, ApiResponse } from '@/types/ApiResponse';

/**
 * Maps a backend `errorCode` to a friendly, generic UI message — see
 * 06_API_INTEGRATION.md § Error Response and BACKEND_API_CONTRACT.md § Error
 * Codes. Field-level `VALIDATION_FAILED` messages are handled separately by
 * forms (see BACKEND_API_CONTRACT.md § Validation Error Shape); this map is
 * for the generic toast/snackbar case only.
 */
const ERROR_CODE_MESSAGES: Record<ApiErrorCode, string> = {
  VALIDATION_FAILED: 'Please check the highlighted fields and try again.',
  RESOURCE_NOT_FOUND: 'The requested item could not be found.',
  BUSINESS_RULE_VIOLATION: 'This action is not allowed.',
  UNAUTHORIZED: 'Your session has expired. Please sign in again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  CONFLICT: 'This record already exists.',
  INTERNAL_ERROR: 'Something went wrong. Please try again later.',
};

const FALLBACK_MESSAGE = 'Something went wrong. Please try again.';
const NETWORK_ERROR_MESSAGE = 'Unable to reach the server. Please check your connection.';

/**
 * Extracts a friendly message from any error thrown by the Axios client.
 * Never exposes backend stack traces (see 08_SECURITY.md § Error Messages).
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    if (!error.response) {
      return NETWORK_ERROR_MESSAGE;
    }
    const errorCode = error.response.data?.errorCode;
    if (errorCode) {
      return ERROR_CODE_MESSAGES[errorCode];
    }
    return error.response.data?.message || FALLBACK_MESSAGE;
  }
  return FALLBACK_MESSAGE;
}
