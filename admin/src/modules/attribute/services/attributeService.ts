import { apiClient } from '@/config/axios';
import { ATTRIBUTE_API } from '@/modules/attribute/api/attributeApi';
import type {
  AttributeResponse,
  CreateAttributeRequest,
  UpdateAttributeRequest,
} from '@/modules/attribute/types/Attribute';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListAttributesParams extends PageableRequest {
  readonly attributeGroupId?: number;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/**
 * Attribute service — see `AttributeController.java`. No `active` field
 * exists on this master; `remove` is a genuine hard delete (see
 * `AttributeService#delete`).
 */
export const attributeService = {
  async list({
    page,
    size,
    attributeGroupId,
    sortKey,
    sortDirection,
  }: ListAttributesParams): Promise<Page<AttributeResponse>> {
    const response = await apiClient.get<ApiResponse<Page<AttributeResponse>>>(ATTRIBUTE_API.base, {
      params: { page, size, attributeGroupId, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateAttributeRequest): Promise<AttributeResponse> {
    const response = await apiClient.post<ApiResponse<AttributeResponse>>(ATTRIBUTE_API.base, request);
    return unwrapApiResponse(response.data);
  },

  async update(id: number, request: UpdateAttributeRequest): Promise<AttributeResponse> {
    const response = await apiClient.put<ApiResponse<AttributeResponse>>(ATTRIBUTE_API.byId(id), request);
    return unwrapApiResponse(response.data);
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(ATTRIBUTE_API.byId(id));
  },
};
