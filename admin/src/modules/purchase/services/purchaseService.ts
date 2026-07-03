import { apiClient } from '@/config/axios';
import { PURCHASE_API } from '@/modules/purchase/api/purchaseApi';
import type {
  CreatePurchaseRequest,
  PurchaseResponse,
  ReceivePurchaseRequest,
  UpdatePurchaseRequest,
} from '@/modules/purchase/types/Purchase';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListPurchasesParams extends PageableRequest {
  readonly supplierId?: string;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/**
 * Purchase module service — see `PurchaseController.java`. Default repository
 * ordering is `invoiceDate DESC`; list supports `supplierId` filter only.
 */
export const purchaseService = {
  async list({ page, size, supplierId, sortKey, sortDirection }: ListPurchasesParams): Promise<
    Page<PurchaseResponse>
  > {
    const response = await apiClient.get<ApiResponse<Page<PurchaseResponse>>>(PURCHASE_API.base, {
      params: { page, size, supplierId, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async getById(id: string): Promise<PurchaseResponse> {
    const response = await apiClient.get<ApiResponse<PurchaseResponse>>(PURCHASE_API.byId(id));
    return unwrapApiResponse(response.data);
  },

  /** ADMIN only. */
  async create(request: CreatePurchaseRequest): Promise<PurchaseResponse> {
    const response = await apiClient.post<ApiResponse<PurchaseResponse>>(PURCHASE_API.base, request);
    return unwrapApiResponse(response.data);
  },

  /** ADMIN only. */
  async update(id: string, request: UpdatePurchaseRequest): Promise<PurchaseResponse> {
    const response = await apiClient.put<ApiResponse<PurchaseResponse>>(PURCHASE_API.byId(id), request);
    return unwrapApiResponse(response.data);
  },

  /** ADMIN only — creates stock records and movements (see AGENTS.md § Stock Rule). */
  async receive(id: string, request: ReceivePurchaseRequest): Promise<PurchaseResponse> {
    const response = await apiClient.post<ApiResponse<PurchaseResponse>>(PURCHASE_API.receive(id), request);
    return unwrapApiResponse(response.data);
  },

  /** ADMIN only — soft-deletes stock and sets `paymentStatus = CANCELLED`. */
  async cancel(id: string): Promise<PurchaseResponse> {
    const response = await apiClient.post<ApiResponse<PurchaseResponse>>(PURCHASE_API.cancel(id));
    return unwrapApiResponse(response.data);
  },
};
