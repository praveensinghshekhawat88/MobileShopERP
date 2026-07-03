import { apiClient } from '@/config/axios';
import { ROLE_API } from '@/modules/role/api/roleApi';
import type { RoleResponse } from '@/modules/role/types/Role';
import type { ApiResponse } from '@/types/ApiResponse';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

/** Role service — see `RoleController.java`. */
export const roleService = {
  async listActive(): Promise<readonly RoleResponse[]> {
    const response = await apiClient.get<ApiResponse<readonly RoleResponse[]>>(ROLE_API.base);
    return unwrapApiResponse(response.data);
  },

  async getById(id: number): Promise<RoleResponse> {
    const response = await apiClient.get<ApiResponse<RoleResponse>>(ROLE_API.byId(id));
    return unwrapApiResponse(response.data);
  },
};
