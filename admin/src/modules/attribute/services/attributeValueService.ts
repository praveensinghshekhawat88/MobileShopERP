import { apiClient } from '@/config/axios';
import { ATTRIBUTE_VALUE_API } from '@/modules/attribute/api/attributeApi';
import type {
  AttributeValueResponse,
  CreateAttributeValueRequest,
  UpdateAttributeValueRequest,
} from '@/modules/attribute/types/Attribute';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListAttributeValuesParams extends PageableRequest {
  readonly attributeId?: number;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/**
 * Attribute Value service — see `AttributeValueController.java`. Values are
 * soft-deactivated (`is_active = false`), never hard-deleted, since sold
 * product variants may still reference them.
 */
export const attributeValueService = {
  async list({
    page,
    size,
    attributeId,
    sortKey,
    sortDirection,
  }: ListAttributeValuesParams): Promise<Page<AttributeValueResponse>> {
    const response = await apiClient.get<ApiResponse<Page<AttributeValueResponse>>>(
      ATTRIBUTE_VALUE_API.base,
      { params: { page, size, attributeId, sort: toSortParam(sortKey, sortDirection) } }
    );
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateAttributeValueRequest): Promise<AttributeValueResponse> {
    const response = await apiClient.post<ApiResponse<AttributeValueResponse>>(
      ATTRIBUTE_VALUE_API.base,
      request
    );
    return unwrapApiResponse(response.data);
  },

  async update(id: number, request: UpdateAttributeValueRequest): Promise<AttributeValueResponse> {
    const response = await apiClient.put<ApiResponse<AttributeValueResponse>>(
      ATTRIBUTE_VALUE_API.byId(id),
      request
    );
    return unwrapApiResponse(response.data);
  },

  async deactivate(id: number): Promise<void> {
    await apiClient.patch<ApiResponse<null>>(ATTRIBUTE_VALUE_API.deactivate(id));
  },
};
