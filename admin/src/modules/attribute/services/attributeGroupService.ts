import { apiClient } from '@/config/axios';
import { ATTRIBUTE_GROUP_API } from '@/modules/attribute/api/attributeApi';
import type {
  AttributeGroupResponse,
  CreateAttributeGroupRequest,
  UpdateAttributeGroupRequest,
} from '@/modules/attribute/types/Attribute';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListAttributeGroupsParams extends PageableRequest {
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/**
 * Attribute Group service — see `AttributeGroupController.java`. No
 * `active` field exists on this master; `delete` is a genuine hard delete
 * (see `AttributeGroupService#delete`), unlike Brand/Category/AttributeValue.
 */
export const attributeGroupService = {
  async list({
    page,
    size,
    sortKey,
    sortDirection,
  }: ListAttributeGroupsParams): Promise<Page<AttributeGroupResponse>> {
    const response = await apiClient.get<ApiResponse<Page<AttributeGroupResponse>>>(
      ATTRIBUTE_GROUP_API.base,
      { params: { page, size, sort: toSortParam(sortKey, sortDirection) } }
    );
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateAttributeGroupRequest): Promise<AttributeGroupResponse> {
    const response = await apiClient.post<ApiResponse<AttributeGroupResponse>>(
      ATTRIBUTE_GROUP_API.base,
      request
    );
    return unwrapApiResponse(response.data);
  },

  async update(id: number, request: UpdateAttributeGroupRequest): Promise<AttributeGroupResponse> {
    const response = await apiClient.put<ApiResponse<AttributeGroupResponse>>(
      ATTRIBUTE_GROUP_API.byId(id),
      request
    );
    return unwrapApiResponse(response.data);
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(ATTRIBUTE_GROUP_API.byId(id));
  },
};
