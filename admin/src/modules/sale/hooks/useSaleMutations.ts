import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { saleService } from '@/modules/sale/services/saleService';
import type {
  CreateSaleRequest,
  FinalizeSaleRequest,
  SaleCompletionResponse,
  SaleResponse,
  UpdateSaleRequest,
} from '@/modules/sale/types/Sale';
import { showSuccessToast } from '@/utils/toast';

function invalidateSaleQueries(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['sales'] });
  void queryClient.invalidateQueries({ queryKey: ['stock'] });
  void queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
  void queryClient.invalidateQueries({ queryKey: ['payments'] });
}

export function useCreateSale(): UseMutationResult<SaleResponse, unknown, CreateSaleRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateSaleRequest) => saleService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateSaleQueries(queryClient);
      showSuccessToast('Sale created successfully.');
    },
  });
}

export function useUpdateSale(): UseMutationResult<
  SaleResponse,
  unknown,
  { readonly id: string; readonly request: UpdateSaleRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => saleService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateSaleQueries(queryClient);
      showSuccessToast('Sale updated successfully.');
    },
  });
}

export function useFinalizeSale(): UseMutationResult<
  SaleCompletionResponse,
  unknown,
  { readonly id: string; readonly request?: FinalizeSaleRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => saleService.finalize(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateSaleQueries(queryClient);
      showSuccessToast('Sale finalized successfully.');
    },
  });
}

export function useCancelSale(): UseMutationResult<SaleCompletionResponse, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => saleService.cancel(id),
    onSuccess: () => {
      invalidateSaleQueries(queryClient);
      showSuccessToast('Sale cancelled successfully.');
    },
  });
}
