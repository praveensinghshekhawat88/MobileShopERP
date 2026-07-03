import { apiClient } from '@/config/axios';
import { PRODUCT_IMAGE_API } from '@/modules/product/api/productApi';
import type {
  CreateProductImageRequest,
  ProductImageResponse,
  UpdateProductImageRequest,
} from '@/modules/product/types/Product';
import type { ApiResponse } from '@/types/ApiResponse';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

/**
 * Product Image service — see `ProductImageController.java` and AGENTS.md §
 * Product Image Rule: "Images belong to Variant. Never Product." Images are
 * nested under a variant (not a top-level paginated resource); the backend
 * returns a plain list ordered by `displayOrder ASC, createdAt ASC`.
 */
export const productImageService = {
  async listByVariant(variantId: string): Promise<readonly ProductImageResponse[]> {
    const response = await apiClient.get<ApiResponse<ProductImageResponse[]>>(
      PRODUCT_IMAGE_API.base(variantId)
    );
    return unwrapApiResponse(response.data);
  },

  async create(variantId: string, request: CreateProductImageRequest): Promise<ProductImageResponse> {
    const response = await apiClient.post<ApiResponse<ProductImageResponse>>(
      PRODUCT_IMAGE_API.base(variantId),
      request
    );
    return unwrapApiResponse(response.data);
  },

  async update(
    variantId: string,
    imageId: string,
    request: UpdateProductImageRequest
  ): Promise<ProductImageResponse> {
    const response = await apiClient.put<ApiResponse<ProductImageResponse>>(
      PRODUCT_IMAGE_API.byId(variantId, imageId),
      request
    );
    return unwrapApiResponse(response.data);
  },

  async remove(variantId: string, imageId: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(PRODUCT_IMAGE_API.byId(variantId, imageId));
  },
};
