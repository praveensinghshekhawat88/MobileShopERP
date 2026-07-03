import axios from 'axios';
import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';

import { isValidationErrorResponse, type ApiResponse } from '@/types/ApiResponse';

/**
 * Maps a backend `VALIDATION_FAILED` response onto React Hook Form field
 * errors — see 01_AGENTS.md § Error Handling: "Validation Error → Field
 * Error" and BACKEND_API_CONTRACT.md § Validation Error Shape (`data` is a
 * flat `{ field: message }` map). Every module form should call this from
 * its mutation's `onError` instead of re-implementing the mapping.
 *
 * Returns `true` if field errors were applied (caller should skip showing a
 * generic toast), `false` otherwise (caller should fall back to
 * `getApiErrorMessage`).
 */
export function applyServerValidationErrors<TFieldValues extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<TFieldValues>
): boolean {
  if (!axios.isAxiosError<ApiResponse<unknown>>(error) || !error.response) {
    return false;
  }

  const body = error.response.data;
  if (!body || !isValidationErrorResponse(body) || !body.data) {
    return false;
  }

  Object.entries(body.data).forEach(([field, message]) => {
    setError(field as Path<TFieldValues>, { type: 'server', message });
  });

  return true;
}
