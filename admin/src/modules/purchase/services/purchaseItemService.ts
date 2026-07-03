import { apiClient } from '@/config/axios';
import { PURCHASE_API } from '@/modules/purchase/api/purchaseApi';
import type {
  CreatePurchaseItemRequest,
  PurchaseItemResponse,
  UpdatePurchaseItemRequest,
} from '@/modules/purchase/types/Purchase';
import type { ApiResponse } from '@/types/ApiResponse';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

/**
 * Purchase Item service — see `PurchaseItemController.java`. Returns a full
 * non-paginated list per purchase; the detail screen paginates client-side.
 */
export const purchaseItemService = {
  async listByPurchase(purchaseId: string): Promise<readonly PurchaseItemResponse[]> {
    const response = await apiClient.get<ApiResponse<readonly PurchaseItemResponse[]>>(
      PURCHASE_API.items(purchaseId)
    );
    return unwrapApiResponse(response.data);
  },

  async create(purchaseId: string, request: CreatePurchaseItemRequest): Promise<PurchaseItemResponse> {
    const response = await apiClient.post<ApiResponse<PurchaseItemResponse>>(
      PURCHASE_API.items(purchaseId),
      request
    );
    return unwrapApiResponse(response.data);
  },

  async update(
    purchaseId: string,
    itemId: string,
    request: UpdatePurchaseItemRequest
  ): Promise<PurchaseItemResponse> {
    const response = await apiClient.put<ApiResponse<PurchaseItemResponse>>(
      PURCHASE_API.itemById(purchaseId, itemId),
      request
    );
    return unwrapApiResponse(response.data);
  },

  async remove(purchaseId: string, itemId: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(PURCHASE_API.itemById(purchaseId, itemId));
  },
};
