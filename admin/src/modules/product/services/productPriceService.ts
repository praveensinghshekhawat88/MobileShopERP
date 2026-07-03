import axios from 'axios';

import { apiClient } from '@/config/axios';
import { PRODUCT_PRICE_API } from '@/modules/product/api/productApi';
import type { CreateProductPriceRequest, ProductPriceResponse } from '@/modules/product/types/Product';
import type { ApiResponse } from '@/types/ApiResponse';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

/**
 * Product Price service — see `ProductPriceController.java` and AGENTS.md §
 * Product Price Rule: "Never overwrite prices. Always create new record.
 * Maintain Price History Always." There is intentionally no `update`/
 * `remove` here — the API only exposes `GET`/`POST`. Creating a new active
 * RETAIL price server-side auto-closes the previous active RETAIL price
 * (see `ProductPriceService#create`).
 */
export const productPriceService = {
  async listByVariant(variantId: string): Promise<readonly ProductPriceResponse[]> {
    const response = await apiClient.get<ApiResponse<ProductPriceResponse[]>>(PRODUCT_PRICE_API.base, {
      params: { variantId },
    });
    return unwrapApiResponse(response.data);
  },

  /** Returns `null` when the variant has no active RETAIL price yet (backend responds `RESOURCE_NOT_FOUND`). */
  async getActiveRetail(variantId: string): Promise<ProductPriceResponse | null> {
    try {
      const response = await apiClient.get<ApiResponse<ProductPriceResponse>>(PRODUCT_PRICE_API.activeRetail, {
        params: { variantId },
      });
      return unwrapApiResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async create(request: CreateProductPriceRequest): Promise<ProductPriceResponse> {
    const response = await apiClient.post<ApiResponse<ProductPriceResponse>>(PRODUCT_PRICE_API.base, request);
    return unwrapApiResponse(response.data);
  },
};
