import { apiClient } from '@/config/axios';
import { WARRANTY_API } from '@/modules/warranty/api/warrantyApi';
import type { CreateWarrantyRequest, WarrantyResponse } from '@/modules/warranty/types/Warranty';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListWarrantiesParams extends PageableRequest {
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/** Warranty module service — see `WarrantyController.java`. No update/delete endpoints. */
export const warrantyService = {
  async list({ page, size, sortKey, sortDirection }: ListWarrantiesParams): Promise<Page<WarrantyResponse>> {
    const response = await apiClient.get<ApiResponse<Page<WarrantyResponse>>>(WARRANTY_API.base, {
      params: { page, size, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async getById(id: string): Promise<WarrantyResponse> {
    const response = await apiClient.get<ApiResponse<WarrantyResponse>>(WARRANTY_API.byId(id));
    return unwrapApiResponse(response.data);
  },

  async getBySaleItemId(saleItemId: string): Promise<WarrantyResponse> {
    const response = await apiClient.get<ApiResponse<WarrantyResponse>>(WARRANTY_API.bySaleItem(saleItemId));
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateWarrantyRequest): Promise<WarrantyResponse> {
    const response = await apiClient.post<ApiResponse<WarrantyResponse>>(WARRANTY_API.base, request);
    return unwrapApiResponse(response.data);
  },

  async submitClaim(id: string): Promise<WarrantyResponse> {
    const response = await apiClient.post<ApiResponse<WarrantyResponse>>(WARRANTY_API.claim(id));
    return unwrapApiResponse(response.data);
  },
};
