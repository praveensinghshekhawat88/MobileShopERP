import { apiClient } from '@/config/axios';
import { BRAND_API } from '@/modules/brand/api/brandApi';
import type { BrandResponse, CreateBrandRequest, UpdateBrandRequest } from '@/modules/brand/types/Brand';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListBrandsParams extends PageableRequest {
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/**
 * Brand module service — see 03_ARCHITECTURE.md § API Architecture and
 * `BrandController.java`. `findAllActive` only ever returns active brands
 * (deactivated brands still exist for referential integrity on historical
 * purchases/stock — see AGENTS.md § Soft Delete).
 */
export const brandService = {
  async list({ page, size, sortKey, sortDirection }: ListBrandsParams): Promise<Page<BrandResponse>> {
    const response = await apiClient.get<ApiResponse<Page<BrandResponse>>>(BRAND_API.base, {
      params: { page, size, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateBrandRequest): Promise<BrandResponse> {
    const response = await apiClient.post<ApiResponse<BrandResponse>>(BRAND_API.base, request);
    return unwrapApiResponse(response.data);
  },

  async update(id: number, request: UpdateBrandRequest): Promise<BrandResponse> {
    const response = await apiClient.put<ApiResponse<BrandResponse>>(BRAND_API.byId(id), request);
    return unwrapApiResponse(response.data);
  },

  async deactivate(id: number): Promise<void> {
    await apiClient.patch<ApiResponse<null>>(BRAND_API.deactivate(id));
  },
};
