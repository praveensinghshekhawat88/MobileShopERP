import type { AuthTokensResponse } from '@/modules/auth/types/Auth';
import type { ApiResponse } from '@/types/ApiResponse';

const API_BASE = 'http://localhost:8081/api/v1';

export const TEST_ADMIN_USER = {
  id: '11111111-1111-1111-1111-111111111111',
  firstName: 'Admin',
  lastName: 'User',
  mobile: '9999999999',
  roleName: 'ADMIN' as const,
};

export function buildAuthTokensResponse(
  overrides: Partial<AuthTokensResponse> = {}
): AuthTokensResponse {
  return {
    accessToken: 'test-access-token',
    refreshToken: 'test-refresh-token',
    tokenType: 'Bearer',
    expiresIn: 28_800_000,
    user: TEST_ADMIN_USER,
    ...overrides,
  };
}

export function buildSuccessEnvelope<T>(data: T, path: string): ApiResponse<T> {
  return {
    success: true,
    message: 'Success',
    data,
    errorCode: null,
    timestamp: new Date().toISOString(),
    path,
  };
}

export function loginUrl(): string {
  return `${API_BASE}/auth/login`;
}

export function refreshUrl(): string {
  return `${API_BASE}/auth/refresh`;
}
