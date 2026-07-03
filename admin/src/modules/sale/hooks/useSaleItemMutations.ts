import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { saleItemService } from '@/modules/sale/services/saleItemService';
import type { CreateSaleItemRequest, SaleItemResponse, UpdateSaleItemRequest } from '@/modules/sale/types/Sale';
import { showSuccessToast } from '@/utils/toast';

function invalidateItemQueries(queryClient: ReturnType<typeof useQueryClient>, saleId: string): void {
  void queryClient.invalidateQueries({ queryKey: ['sales', 'items', saleId] });
  void queryClient.invalidateQueries({ queryKey: ['sales', 'detail', saleId] });
  void queryClient.invalidateQueries({ queryKey: ['sales', 'list'] });
  void queryClient.invalidateQueries({ queryKey: ['payments', 'balance', saleId] });
}

export function useCreateSaleItem(): UseMutationResult<
  SaleItemResponse,
  unknown,
  { readonly saleId: string; readonly request: CreateSaleItemRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ saleId, request }) => saleItemService.create(saleId, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: (_data, { saleId }) => {
      invalidateItemQueries(queryClient, saleId);
      void queryClient.invalidateQueries({ queryKey: ['stock', 'salable-options'] });
      showSuccessToast('Line item added successfully.');
    },
  });
}

export function useUpdateSaleItem(): UseMutationResult<
  SaleItemResponse,
  unknown,
  { readonly saleId: string; readonly itemId: string; readonly request: UpdateSaleItemRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ saleId, itemId, request }) => saleItemService.update(saleId, itemId, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: (_data, { saleId }) => {
      invalidateItemQueries(queryClient, saleId);
      showSuccessToast('Line item updated successfully.');
    },
  });
}

export function useDeleteSaleItem(): UseMutationResult<
  void,
  unknown,
  { readonly saleId: string; readonly itemId: string }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ saleId, itemId }) => saleItemService.remove(saleId, itemId),
    onSuccess: (_data, { saleId }) => {
      invalidateItemQueries(queryClient, saleId);
      void queryClient.invalidateQueries({ queryKey: ['stock', 'salable-options'] });
      showSuccessToast('Line item removed successfully.');
    },
  });
}
