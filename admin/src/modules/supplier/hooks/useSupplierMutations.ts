import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { supplierService } from '@/modules/supplier/services/supplierService';
import type {
  CreateSupplierRequest,
  SupplierResponse,
  UpdateSupplierRequest,
} from '@/modules/supplier/types/Supplier';
import { showSuccessToast } from '@/utils/toast';

function invalidateSupplierQueries(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['suppliers'] });
}

/** ADMIN only (see `SupplierController#create`). */
export function useCreateSupplier(): UseMutationResult<
  SupplierResponse,
  unknown,
  CreateSupplierRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateSupplierRequest) => supplierService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateSupplierQueries(queryClient);
      showSuccessToast('Supplier created successfully.');
    },
  });
}

/** ADMIN only (see `SupplierController#update`). */
export function useUpdateSupplier(): UseMutationResult<
  SupplierResponse,
  unknown,
  { readonly id: string; readonly request: UpdateSupplierRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => supplierService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateSupplierQueries(queryClient);
      showSuccessToast('Supplier updated successfully.');
    },
  });
}

/** Soft delete (see `SupplierService#softDelete`) — the calling page must confirm first; ADMIN only. */
export function useDeleteSupplier(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => supplierService.remove(id),
    onSuccess: () => {
      invalidateSupplierQueries(queryClient);
      showSuccessToast('Supplier deleted successfully.');
    },
  });
}
