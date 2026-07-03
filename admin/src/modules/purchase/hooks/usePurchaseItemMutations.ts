import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { purchaseItemService } from '@/modules/purchase/services/purchaseItemService';
import type {
  CreatePurchaseItemRequest,
  PurchaseItemResponse,
  UpdatePurchaseItemRequest,
} from '@/modules/purchase/types/Purchase';
import { showSuccessToast } from '@/utils/toast';

function invalidateItemQueries(queryClient: ReturnType<typeof useQueryClient>, purchaseId: string): void {
  void queryClient.invalidateQueries({ queryKey: ['purchases', 'items', purchaseId] });
  void queryClient.invalidateQueries({ queryKey: ['purchases', 'detail', purchaseId] });
  void queryClient.invalidateQueries({ queryKey: ['purchases', 'list'] });
}

export function useCreatePurchaseItem(): UseMutationResult<
  PurchaseItemResponse,
  unknown,
  { readonly purchaseId: string; readonly request: CreatePurchaseItemRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ purchaseId, request }) => purchaseItemService.create(purchaseId, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: (_data, { purchaseId }) => {
      invalidateItemQueries(queryClient, purchaseId);
      showSuccessToast('Line item added successfully.');
    },
  });
}

export function useUpdatePurchaseItem(): UseMutationResult<
  PurchaseItemResponse,
  unknown,
  { readonly purchaseId: string; readonly itemId: string; readonly request: UpdatePurchaseItemRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ purchaseId, itemId, request }) =>
      purchaseItemService.update(purchaseId, itemId, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: (_data, { purchaseId }) => {
      invalidateItemQueries(queryClient, purchaseId);
      showSuccessToast('Line item updated successfully.');
    },
  });
}

export function useDeletePurchaseItem(): UseMutationResult<
  void,
  unknown,
  { readonly purchaseId: string; readonly itemId: string }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ purchaseId, itemId }) => purchaseItemService.remove(purchaseId, itemId),
    onSuccess: (_data, { purchaseId }) => {
      invalidateItemQueries(queryClient, purchaseId);
      showSuccessToast('Line item removed successfully.');
    },
  });
}
