import { apiClient } from '@/config/axios';
import { SALE_API } from '@/modules/sale/api/saleApi';
import type {
  CreateSaleRequest,
  FinalizeSaleRequest,
  SaleCompletionResponse,
  SaleResponse,
  UpdateSaleRequest,
} from '@/modules/sale/types/Sale';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListSalesParams extends PageableRequest {
  readonly customerId?: string;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/** Sale module service — see `SaleController.java`. Default ordering is `invoiceDate DESC`. */
export const saleService = {
  async list({ page, size, customerId, sortKey, sortDirection }: ListSalesParams): Promise<Page<SaleResponse>> {
    const response = await apiClient.get<ApiResponse<Page<SaleResponse>>>(SALE_API.base, {
      params: { page, size, customerId, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async getById(id: string): Promise<SaleResponse> {
    const response = await apiClient.get<ApiResponse<SaleResponse>>(SALE_API.byId(id));
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateSaleRequest): Promise<SaleResponse> {
    const response = await apiClient.post<ApiResponse<SaleResponse>>(SALE_API.base, request);
    return unwrapApiResponse(response.data);
  },

  /** ADMIN only. */
  async update(id: string, request: UpdateSaleRequest): Promise<SaleResponse> {
    const response = await apiClient.put<ApiResponse<SaleResponse>>(SALE_API.byId(id), request);
    return unwrapApiResponse(response.data);
  },

  async finalize(id: string, request?: FinalizeSaleRequest): Promise<SaleCompletionResponse> {
    const response = await apiClient.post<ApiResponse<SaleCompletionResponse>>(SALE_API.finalize(id), request ?? {});
    return unwrapApiResponse(response.data);
  },

  /** ADMIN only — soft-deletes sale and restores stock. */
  async cancel(id: string): Promise<SaleCompletionResponse> {
    const response = await apiClient.post<ApiResponse<SaleCompletionResponse>>(SALE_API.cancel(id));
    return unwrapApiResponse(response.data);
  },
};
