import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

import { tokenStorage } from '@/auth/tokenStorage';
import { env } from '@/config/env';
import { clearAuthenticatedUser } from '@/store/slices/authSlice';
import { store } from '@/store/store';
import type { ApiResponse } from '@/types/ApiResponse';
import { logger } from '@/utils/logger';

/**
 * The single Axios instance for the entire app — see 01_AGENTS.md § Axios Rules
 * and 06_API_INTEGRATION.md § Axios Instance. Never create another instance,
 * never call `fetch()` directly, never import this file from a page component
 * (pages must go through a module's service layer — see 03_ARCHITECTURE.md
 * § API Architecture).
 */
export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    'Content-Type': 'application/json',
  },
});

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

let refreshInFlight: Promise<string | null> | null = null;

/**
 * Calls `POST /auth/refresh` using a bare Axios request (never the
 * `apiClient` instance) so a failed refresh cannot re-trigger this same
 * interceptor and loop forever. Concurrent 401s share a single in-flight
 * refresh call instead of each firing their own.
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  refreshInFlight ??= axios
    .post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
      `${env.apiBaseUrl}/auth/refresh`,
      { refreshToken },
      { timeout: env.apiTimeoutMs }
    )
    .then((response) => {
      const data = response.data.data;
      if (!data) {
        throw new Error('Refresh response did not contain token data');
      }
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    })
    .catch((error: unknown) => {
      logger.warn('Token refresh failed, logging out', error);
      tokenStorage.clear();
      store.dispatch(clearAuthenticatedUser());
      return null;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const status = error.response?.status;
    const requestUrl = originalRequest?.url ?? '';
    const isRefreshEndpoint = requestUrl.includes('/auth/refresh');
    const isLoginEndpoint = requestUrl.includes('/auth/login');

    if (
      status === 401 &&
      originalRequest &&
      !originalRequest._retried &&
      !isRefreshEndpoint &&
      !isLoginEndpoint
    ) {
      originalRequest._retried = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.set('Authorization', `Bearer ${newAccessToken}`);
        return apiClient.request(originalRequest as AxiosRequestConfig);
      }
    }

    return Promise.reject(error);
  }
);
