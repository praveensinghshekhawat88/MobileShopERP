import { apiClient } from '@/config/axios';
import { PRODUCT_VARIANT_API } from '@/modules/product/api/productApi';
import type {
  CreateProductVariantRequest,
  ProductVariantResponse,
  UpdateProductVariantRequest,
} from '@/modules/product/types/Product';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListProductVariantsParams extends PageableRequest {
  readonly productId?: string;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/**
 * Product Variant service — see `ProductVariantController.java`. A variant
 * is the actual sellable item (see AGENTS.md § Product Structure); it never
 * carries IMEI, price, or image fields directly.
 */
export const productVariantService = {
  async list({
    page,
    size,
    productId,
    sortKey,
    sortDirection,
  }: ListProductVariantsParams): Promise<Page<ProductVariantResponse>> {
    const response = await apiClient.get<ApiResponse<Page<ProductVariantResponse>>>(PRODUCT_VARIANT_API.base, {
      params: { page, size, productId, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async getById(id: string): Promise<ProductVariantResponse> {
    const response = await apiClient.get<ApiResponse<ProductVariantResponse>>(PRODUCT_VARIANT_API.byId(id));
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateProductVariantRequest): Promise<ProductVariantResponse> {
    const response = await apiClient.post<ApiResponse<ProductVariantResponse>>(
      PRODUCT_VARIANT_API.base,
      request
    );
    return unwrapApiResponse(response.data);
  },

  async update(id: string, request: UpdateProductVariantRequest): Promise<ProductVariantResponse> {
    const response = await apiClient.put<ApiResponse<ProductVariantResponse>>(
      PRODUCT_VARIANT_API.byId(id),
      request
    );
    return unwrapApiResponse(response.data);
  },

  async deactivate(id: string): Promise<void> {
    await apiClient.patch<ApiResponse<null>>(PRODUCT_VARIANT_API.deactivate(id));
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(PRODUCT_VARIANT_API.byId(id));
  },
};
