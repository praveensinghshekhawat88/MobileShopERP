/**
 * Canonical envelope returned by every backend endpoint (success or error).
 * Shape is locked — see BACKEND_API_CONTRACT.md § ApiResponse<T> Envelope.
 */
export interface ApiResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T | null;
  readonly errorCode: ApiErrorCode | null;
  readonly timestamp: string;
  readonly path: string;
}

/**
 * Locked backend error code enum — see BACKEND_API_CONTRACT.md § Error Codes.
 */
export type ApiErrorCode =
  | 'VALIDATION_FAILED'
  | 'RESOURCE_NOT_FOUND'
  | 'BUSINESS_RULE_VIOLATION'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'INTERNAL_ERROR';

/**
 * `data` shape returned alongside `errorCode: 'VALIDATION_FAILED'` —
 * a flat map of field name to message.
 */
export type ValidationErrorMap = Record<string, string>;

export function isValidationErrorResponse(
  response: ApiResponse<unknown>
): response is ApiResponse<ValidationErrorMap> {
  return response.errorCode === 'VALIDATION_FAILED' && typeof response.data === 'object';
}
