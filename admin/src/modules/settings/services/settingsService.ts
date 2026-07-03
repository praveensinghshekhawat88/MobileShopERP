import { apiClient } from '@/config/axios';
import { SETTINGS_API } from '@/modules/settings/api/settingsApi';
import type { SettingsResponse, UpdateSettingsRequest } from '@/modules/settings/types/Settings';
import type { ApiResponse } from '@/types/ApiResponse';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

/** Shop settings service — see `SettingsController.java`. */
export const settingsService = {
  async get(): Promise<SettingsResponse> {
    const response = await apiClient.get<ApiResponse<SettingsResponse>>(SETTINGS_API.base);
    return unwrapApiResponse(response.data);
  },

  async update(request: UpdateSettingsRequest): Promise<SettingsResponse> {
    const response = await apiClient.put<ApiResponse<SettingsResponse>>(SETTINGS_API.base, request);
    return unwrapApiResponse(response.data);
  },
};
