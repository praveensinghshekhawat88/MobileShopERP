import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { expenseService } from '@/modules/expense/services/expenseService';
import type {
  CreateExpenseRequest,
  ExpenseResponse,
  UpdateExpenseRequest,
} from '@/modules/expense/types/Expense';
import { showSuccessToast } from '@/utils/toast';

export function useCreateExpense(): UseMutationResult<ExpenseResponse, unknown, CreateExpenseRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateExpenseRequest) => expenseService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['expenses'] });
      showSuccessToast('Expense created successfully.');
    },
  });
}

export function useUpdateExpense(): UseMutationResult<
  ExpenseResponse,
  unknown,
  { readonly id: string; readonly request: UpdateExpenseRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => expenseService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['expenses'] });
      showSuccessToast('Expense updated successfully.');
    },
  });
}

export function useDeleteExpense(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['expenses'] });
      showSuccessToast('Expense deleted successfully.');
    },
  });
}
