import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { purchaseService } from '@/modules/purchase/services/purchaseService';
import type {
  CreatePurchaseRequest,
  PurchaseResponse,
  ReceivePurchaseRequest,
  UpdatePurchaseRequest,
} from '@/modules/purchase/types/Purchase';
import { showSuccessToast } from '@/utils/toast';

function invalidatePurchaseQueries(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['purchases'] });
  void queryClient.invalidateQueries({ queryKey: ['stock'] });
  void queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
}

export function useCreatePurchase(): UseMutationResult<PurchaseResponse, unknown, CreatePurchaseRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreatePurchaseRequest) => purchaseService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidatePurchaseQueries(queryClient);
      showSuccessToast('Purchase created successfully.');
    },
  });
}

export function useUpdatePurchase(): UseMutationResult<
  PurchaseResponse,
  unknown,
  { readonly id: string; readonly request: UpdatePurchaseRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => purchaseService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidatePurchaseQueries(queryClient);
      showSuccessToast('Purchase updated successfully.');
    },
  });
}

export function useReceivePurchase(): UseMutationResult<
  PurchaseResponse,
  unknown,
  { readonly id: string; readonly request: ReceivePurchaseRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => purchaseService.receive(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidatePurchaseQueries(queryClient);
      showSuccessToast('Purchase received successfully. Stock records created.');
    },
  });
}

export function useCancelPurchase(): UseMutationResult<PurchaseResponse, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => purchaseService.cancel(id),
    onSuccess: () => {
      invalidatePurchaseQueries(queryClient);
      showSuccessToast('Purchase cancelled successfully.');
    },
  });
}
