import { apiClient } from '@/config/axios';
import { CUSTOMER_API } from '@/modules/customer/api/customerApi';
import type {
  CreateCustomerRequest,
  CustomerResponse,
  UpdateCustomerRequest,
} from '@/modules/customer/types/Customer';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListCustomersParams extends PageableRequest {
  readonly name?: string;
  readonly mobile?: string;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/**
 * Customer module service — see 03_ARCHITECTURE.md § API Architecture and
 * `CustomerController.java`. `mobile` takes priority over `name` when both
 * search params are supplied (see `CustomerService#findAll`).
 */
export const customerService = {
  async list({
    page,
    size,
    name,
    mobile,
    sortKey,
    sortDirection,
  }: ListCustomersParams): Promise<Page<CustomerResponse>> {
    const response = await apiClient.get<ApiResponse<Page<CustomerResponse>>>(CUSTOMER_API.base, {
      params: { page, size, name, mobile, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async getById(id: string): Promise<CustomerResponse> {
    const response = await apiClient.get<ApiResponse<CustomerResponse>>(CUSTOMER_API.byId(id));
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateCustomerRequest): Promise<CustomerResponse> {
    const response = await apiClient.post<ApiResponse<CustomerResponse>>(
      CUSTOMER_API.base,
      request
    );
    return unwrapApiResponse(response.data);
  },

  async update(id: string, request: UpdateCustomerRequest): Promise<CustomerResponse> {
    const response = await apiClient.put<ApiResponse<CustomerResponse>>(
      CUSTOMER_API.byId(id),
      request
    );
    return unwrapApiResponse(response.data);
  },

  /** Soft delete (see `CustomerService#softDelete`, sets `deleted_at`) — ADMIN only. */
  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(CUSTOMER_API.byId(id));
  },
};
