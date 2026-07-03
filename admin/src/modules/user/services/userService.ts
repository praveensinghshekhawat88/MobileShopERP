import { apiClient } from '@/config/axios';
import { USER_API } from '@/modules/user/api/userApi';
import type { CreateUserRequest, UpdateUserRequest, UserResponse } from '@/modules/user/types/User';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListUsersParams extends PageableRequest {
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/** User service — see `UserController.java`. All endpoints are ADMIN-only. */
export const userService = {
  async list({ page, size, sortKey, sortDirection }: ListUsersParams): Promise<Page<UserResponse>> {
    const response = await apiClient.get<ApiResponse<Page<UserResponse>>>(USER_API.base, {
      params: { page, size, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async getById(id: string): Promise<UserResponse> {
    const response = await apiClient.get<ApiResponse<UserResponse>>(USER_API.byId(id));
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateUserRequest): Promise<UserResponse> {
    const response = await apiClient.post<ApiResponse<UserResponse>>(USER_API.base, request);
    return unwrapApiResponse(response.data);
  },

  async update(id: string, request: UpdateUserRequest): Promise<UserResponse> {
    const response = await apiClient.put<ApiResponse<UserResponse>>(USER_API.byId(id), request);
    return unwrapApiResponse(response.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(USER_API.byId(id));
  },
};
