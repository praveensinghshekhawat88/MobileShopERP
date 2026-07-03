import { apiClient } from '@/config/axios';
import { EXPENSE_API } from '@/modules/expense/api/expenseApi';
import type {
  CreateExpenseRequest,
  ExpenseResponse,
  UpdateExpenseRequest,
} from '@/modules/expense/types/Expense';
import type { ApiResponse } from '@/types/ApiResponse';
import type { Page, PageableRequest } from '@/types/Page';
import { toSortParam } from '@/utils/pageable';
import { unwrapApiResponse } from '@/utils/unwrapApiResponse';

interface ListExpensesParams extends PageableRequest {
  readonly from?: string;
  readonly to?: string;
  readonly sortKey?: string;
  readonly sortDirection?: 'asc' | 'desc';
}

/** Expense module service — see `ExpenseController.java`. Mutations are ADMIN-only. */
export const expenseService = {
  async list({
    page,
    size,
    from,
    to,
    sortKey,
    sortDirection,
  }: ListExpensesParams): Promise<Page<ExpenseResponse>> {
    const response = await apiClient.get<ApiResponse<Page<ExpenseResponse>>>(EXPENSE_API.base, {
      params: { page, size, from, to, sort: toSortParam(sortKey, sortDirection) },
    });
    return unwrapApiResponse(response.data);
  },

  async getById(id: string): Promise<ExpenseResponse> {
    const response = await apiClient.get<ApiResponse<ExpenseResponse>>(EXPENSE_API.byId(id));
    return unwrapApiResponse(response.data);
  },

  async create(request: CreateExpenseRequest): Promise<ExpenseResponse> {
    const response = await apiClient.post<ApiResponse<ExpenseResponse>>(EXPENSE_API.base, request);
    return unwrapApiResponse(response.data);
  },

  async update(id: string, request: UpdateExpenseRequest): Promise<ExpenseResponse> {
    const response = await apiClient.put<ApiResponse<ExpenseResponse>>(EXPENSE_API.byId(id), request);
    return unwrapApiResponse(response.data);
  },

  /** Soft delete — ADMIN only. */
  async remove(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(EXPENSE_API.byId(id));
  },
};
