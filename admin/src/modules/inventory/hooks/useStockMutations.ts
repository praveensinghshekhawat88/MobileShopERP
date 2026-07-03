import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { stockService } from '@/modules/inventory/services/stockService';
import type {
  StockResponse,
  StockStatusUpdateRequest,
  UpdateStockRequest,
} from '@/modules/inventory/types/Stock';
import { showSuccessToast } from '@/utils/toast';

function invalidateStockQueries(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['stock'] });
  void queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
}

/** ADMIN only — metadata update (IMEI/serial). Status uses `useUpdateStockStatus`. */
export function useUpdateStockMetadata(): UseMutationResult<
  StockResponse,
  unknown,
  { readonly id: string; readonly request: UpdateStockRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => stockService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateStockQueries(queryClient);
      showSuccessToast('Stock metadata updated successfully.');
    },
  });
}

/** ADMIN only — dedicated status transition endpoint (see P06-T005). */
export function useUpdateStockStatus(): UseMutationResult<
  StockResponse,
  unknown,
  { readonly id: string; readonly request: StockStatusUpdateRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => stockService.updateStatus(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateStockQueries(queryClient);
      showSuccessToast('Stock status updated successfully.');
    },
  });
}
