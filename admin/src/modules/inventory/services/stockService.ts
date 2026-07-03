import type { StockStatus } from '@/common/constants/stockStatus';
import { apiClient } from '@/config/axios';
import { STOCK_API } from '@/modules/inventory/api/inventoryApi';
import type {
  StockResponse,
  StockStatusUpdateRequest,
  UpdateStockRequest,
} from '@/modules/inventory/types/Stock';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListStockParams extends PageableRequest {
  readonly variantId?: string;
  readonly status?: StockStatus;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/**
 * Stock service — see `StockController.java`. Status changes use the
 * dedicated `/status` endpoint (see BACKEND_API_CONTRACT.md); `update`
 * is metadata-only (IMEI/serial number).
 */
export const stockService = {
  async list({ page, size, variantId, status, sortKey, sortDirection }: ListStockParams): Promise<
    Page<StockResponse>
  > {
    const response = await apiClient.get<ApiResponse<Page<StockResponse>>>(STOCK_API.base, {
      params: { page, size, variantId, status, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async getById(id: string): Promise<StockResponse> {
    const response = await apiClient.get<ApiResponse<StockResponse>>(STOCK_API.byId(id));
    return unwrapApiResponse(response.data);
  },

  async getByImei(imei: string): Promise<StockResponse> {
    const response = await apiClient.get<ApiResponse<StockResponse>>(STOCK_API.byImei(imei));
    return unwrapApiResponse(response.data);
  },

  /** ADMIN only — metadata update (IMEI/serial). Cannot change status here. */
  async update(id: string, request: UpdateStockRequest): Promise<StockResponse> {
    const response = await apiClient.put<ApiResponse<StockResponse>>(STOCK_API.byId(id), request);
    return unwrapApiResponse(response.data);
  },

  /** ADMIN only — dedicated status transition endpoint (see P06-T005). */
  async updateStatus(id: string, request: StockStatusUpdateRequest): Promise<StockResponse> {
    const response = await apiClient.put<ApiResponse<StockResponse>>(STOCK_API.status(id), request);
    return unwrapApiResponse(response.data);
  },
};
