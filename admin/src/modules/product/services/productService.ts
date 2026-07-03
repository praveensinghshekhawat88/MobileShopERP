import { apiClient } from '@/config/axios';
import { PRODUCT_API } from '@/modules/product/api/productApi';
import type { CreateProductRequest, ProductResponse, UpdateProductRequest } from '@/modules/product/types/Product';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListProductsParams extends PageableRequest {
  readonly brandId?: number;
  readonly categoryId?: number;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/**
 * Product module service — see 03_ARCHITECTURE.md § API Architecture and
 * `ProductController.java`. `list` only ever returns active products
 * (deactivated/deleted products still exist for referential integrity on
 * historical variants — see AGENTS.md § Soft Delete).
 */
export const productService = {
  async list({
    page,
    size,
    brandId,
    categoryId,
    sortKey,
    sortDirection,
  }: ListProductsParams): Promise<Page<ProductResponse>> {
    const response = await apiClient.get<ApiResponse<Page<ProductResponse>>>(PRODUCT_API.base, {
      params: { page, size, brandId, categoryId, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async getById(id: string): Promise<ProductResponse> {
    const response = await apiClient.get<ApiResponse<ProductResponse>>(PRODUCT_API.byId(id));
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateProductRequest): Promise<ProductResponse> {
    const response = await apiClient.post<ApiResponse<ProductResponse>>(PRODUCT_API.base, request);
    return unwrapApiResponse(response.data);
  },

  async update(id: string, request: UpdateProductRequest): Promise<ProductResponse> {
    const response = await apiClient.put<ApiResponse<ProductResponse>>(PRODUCT_API.byId(id), request);
    return unwrapApiResponse(response.data);
  },

  async deactivate(id: string): Promise<void> {
    await apiClient.patch<ApiResponse<null>>(PRODUCT_API.deactivate(id));
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(PRODUCT_API.byId(id));
  },
};
