import { apiClient } from '@/config/axios';
import { VARIANT_ATTRIBUTE_API } from '@/modules/product/api/productApi';
import type { CreateVariantAttributeRequest, VariantAttributeDetailResponse } from '@/modules/product/types/Product';
import type { ApiResponse } from '@/types/ApiResponse';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

/**
 * Variant Attribute service — see `VariantAttributeController.java` and
 * AGENTS.md § Attribute Engine. Assigns/removes one attribute value at a
 * time; the backend enforces "one value per attribute per variant" and
 * rejects duplicates (see `ProductVariantAttributeService#assign`). Removal
 * is a genuine hard delete (see backend reference), so the calling page must
 * confirm first.
 */
export const variantAttributeService = {
  async listByVariant(variantId: string): Promise<readonly VariantAttributeDetailResponse[]> {
    const response = await apiClient.get<ApiResponse<VariantAttributeDetailResponse[]>>(
      VARIANT_ATTRIBUTE_API.base,
      { params: { variantId } }
    );
    return unwrapApiResponse(response.data);
  },

  async assign(request: CreateVariantAttributeRequest): Promise<VariantAttributeDetailResponse> {
    const response = await apiClient.post<ApiResponse<VariantAttributeDetailResponse>>(
      VARIANT_ATTRIBUTE_API.base,
      request
    );
    return unwrapApiResponse(response.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(VARIANT_ATTRIBUTE_API.byId(id));
  },
};
