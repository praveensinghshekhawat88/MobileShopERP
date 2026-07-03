import { apiClient } from '@/config/axios';
import { AUTH_API } from '@/modules/auth/api/authApi';
import type { AuthTokensResponse, LoginRequest, RefreshRequest } from '@/modules/auth/types/Auth';
import type { ApiResponse } from '@/types/ApiResponse';

/**
 * Auth module service — see 03_ARCHITECTURE.md § API Architecture:
 * "UI → React Query → Service → Axios → Spring Boot." Only this file and
 * `config/axios.ts` are allowed to know about `/auth/*` endpoint response
 * shapes; hooks and pages must go through here.
 */
export const authService = {
  async login(request: LoginRequest): Promise<AuthTokensResponse> {
    const response = await apiClient.post<ApiResponse<AuthTokensResponse>>(AUTH_API.login, request);
    return unwrap(response.data);
  },

  async refresh(request: RefreshRequest): Promise<AuthTokensResponse> {
    const response = await apiClient.post<ApiResponse<AuthTokensResponse>>(
      AUTH_API.refresh,
      request
    );
    return unwrap(response.data);
  },
};

function unwrap(envelope: ApiResponse<AuthTokensResponse>): AuthTokensResponse {
  if (!envelope.data) {
    throw new Error('Authentication response did not contain token data');
  }
  return envelope.data;
}
