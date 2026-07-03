import type { ReferenceType } from '@/common/constants/referenceType';
import { apiClient } from '@/config/axios';
import { STOCK_MOVEMENT_API } from '@/modules/inventory/api/inventoryApi';
import type { StockMovementResponse } from '@/modules/inventory/types/Stock';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListStockMovementsParams extends PageableRequest {
  readonly stockId?: string;
  readonly referenceType?: ReferenceType;
  readonly referenceId?: string;
  readonly from?: string;
  readonly to?: string;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/** Stock Movement service — see `StockMovementController.java` (read-only audit trail). */
export const stockMovementService = {
  async list({
    page,
    size,
    stockId,
    referenceType,
    referenceId,
    from,
    to,
    sortKey,
    sortDirection,
  }: ListStockMovementsParams): Promise<Page<StockMovementResponse>> {
    const response = await apiClient.get<ApiResponse<Page<StockMovementResponse>>>(
      STOCK_MOVEMENT_API.base,
      {
        params: {
          page,
          size,
          stockId,
          referenceType,
          referenceId,
          from,
          to,
          sort: toSortParam(sortKey, sortDirection),
        },
      }
    );
    return unwrapApiResponse(response.data);
  },

  async getById(id: string): Promise<StockMovementResponse> {
    const response = await apiClient.get<ApiResponse<StockMovementResponse>>(
      STOCK_MOVEMENT_API.byId(id)
    );
    return unwrapApiResponse(response.data);
  },
};
