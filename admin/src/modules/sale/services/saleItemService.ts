import { apiClient } from '@/config/axios';
import { SALE_API } from '@/modules/sale/api/saleApi';
import type {
  CreateSaleItemRequest,
  SaleItemResponse,
  UpdateSaleItemRequest,
} from '@/modules/sale/types/Sale';
import type { ApiResponse } from '@/types/ApiResponse';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

/** Sale Item service — see `SaleItemController.java`. Returns a full non-paginated list. */
export const saleItemService = {
  async listBySale(saleId: string): Promise<readonly SaleItemResponse[]> {
    const response = await apiClient.get<ApiResponse<readonly SaleItemResponse[]>>(SALE_API.items(saleId));
    return unwrapApiResponse(response.data);
  },

  async create(saleId: string, request: CreateSaleItemRequest): Promise<SaleItemResponse> {
    const response = await apiClient.post<ApiResponse<SaleItemResponse>>(SALE_API.items(saleId), request);
    return unwrapApiResponse(response.data);
  },

  async update(saleId: string, itemId: string, request: UpdateSaleItemRequest): Promise<SaleItemResponse> {
    const response = await apiClient.put<ApiResponse<SaleItemResponse>>(
      SALE_API.itemById(saleId, itemId),
      request
    );
    return unwrapApiResponse(response.data);
  },

  async remove(saleId: string, itemId: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(SALE_API.itemById(saleId, itemId));
  },
};
