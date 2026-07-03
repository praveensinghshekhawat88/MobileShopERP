import { apiClient } from '@/config/axios';
import { SUPPLIER_API } from '@/modules/supplier/api/supplierApi';
import type {
  CreateSupplierRequest,
  SupplierResponse,
  UpdateSupplierRequest,
} from '@/modules/supplier/types/Supplier';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListSuppliersParams extends PageableRequest {
  readonly supplierName?: string;
  readonly mobile?: string;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/**
 * Supplier module service — see 03_ARCHITECTURE.md § API Architecture and
 * `SupplierController.java`. `mobile` takes priority over `supplierName`
 * when both search params are supplied (see `SupplierService#findAll`).
 */
export const supplierService = {
  async list({
    page,
    size,
    supplierName,
    mobile,
    sortKey,
    sortDirection,
  }: ListSuppliersParams): Promise<Page<SupplierResponse>> {
    const response = await apiClient.get<ApiResponse<Page<SupplierResponse>>>(SUPPLIER_API.base, {
      params: { page, size, supplierName, mobile, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async getById(id: string): Promise<SupplierResponse> {
    const response = await apiClient.get<ApiResponse<SupplierResponse>>(SUPPLIER_API.byId(id));
    return unwrapApiResponse(response.data);
  },

  /** ADMIN only (see `SupplierController#create`). */
  async create(request: CreateSupplierRequest): Promise<SupplierResponse> {
    const response = await apiClient.post<ApiResponse<SupplierResponse>>(
      SUPPLIER_API.base,
      request
    );
    return unwrapApiResponse(response.data);
  },

  /** ADMIN only (see `SupplierController#update`). */
  async update(id: string, request: UpdateSupplierRequest): Promise<SupplierResponse> {
    const response = await apiClient.put<ApiResponse<SupplierResponse>>(
      SUPPLIER_API.byId(id),
      request
    );
    return unwrapApiResponse(response.data);
  },

  /** Soft delete (see `SupplierService#softDelete`, sets `deleted_at`) — ADMIN only. */
  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(SUPPLIER_API.byId(id));
  },
};
