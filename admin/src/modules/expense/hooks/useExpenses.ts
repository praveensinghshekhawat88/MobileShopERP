import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { expenseService } from '@/modules/expense/services/expenseService';
import type { ExpenseResponse } from '@/modules/expense/types/Expense';
import type { Page } from '@/types/Page';

interface UseExpensesParams {
  readonly page: number;
  readonly size: number;
  readonly from?: string;
  readonly to?: string;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useExpenses({
  page,
  size,
  from,
  to,
  sortKey,
  sortDirection,
}: UseExpensesParams): UseQueryResult<Page<ExpenseResponse>> {
  return useQuery({
    queryKey: ['expenses', 'list', page, size, from, to, sortKey, sortDirection],
    queryFn: () => expenseService.list({ page, size, from, to, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}

export function useExpense(expenseId: string | undefined): UseQueryResult<ExpenseResponse> {
  return useQuery({
    queryKey: ['expenses', 'detail', expenseId],
    queryFn: () => expenseService.getById(expenseId as string),
    enabled: Boolean(expenseId),
    staleTime: STALE_TIME.default,
  });
}
