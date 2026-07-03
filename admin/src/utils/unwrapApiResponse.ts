import type { ApiResponse } from '@/types/ApiResponse';

/**
 * Unwraps a successful `ApiResponse<T>.data` payload — see
 * BACKEND_API_CONTRACT.md § ApiResponse<T> Envelope. Every module service
 * should call this instead of reading `.data` directly, so a missing payload
 * fails loudly instead of silently propagating `null` into a typed model.
 */
export function unwrapApiResponse<T>(envelope: ApiResponse<T>): T {
  if (envelope.data === null) {
    throw new Error('Response did not contain data');
  }
  return envelope.data;
}
