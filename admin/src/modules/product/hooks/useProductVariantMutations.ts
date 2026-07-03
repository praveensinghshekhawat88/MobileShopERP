import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { productVariantService } from '@/modules/product/services/productVariantService';
import type {
  CreateProductVariantRequest,
  ProductVariantResponse,
  UpdateProductVariantRequest,
} from '@/modules/product/types/Product';
import { showSuccessToast } from '@/utils/toast';

function invalidateVariantQueries(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['product-variants'] });
}

export function useCreateProductVariant(): UseMutationResult<
  ProductVariantResponse,
  unknown,
  CreateProductVariantRequest
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProductVariantRequest) => productVariantService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateVariantQueries(queryClient);
      showSuccessToast('Variant created successfully.');
    },
  });
}

export function useUpdateProductVariant(): UseMutationResult<
  ProductVariantResponse,
  unknown,
  { readonly id: string; readonly request: UpdateProductVariantRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => productVariantService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateVariantQueries(queryClient);
      showSuccessToast('Variant updated successfully.');
    },
  });
}

export function useDeactivateProductVariant(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productVariantService.deactivate(id),
    onSuccess: () => {
      invalidateVariantQueries(queryClient);
      showSuccessToast('Variant deactivated successfully.');
    },
  });
}

/** Soft delete (see `ProductVariantService#delete`, sets `deleted_at`) — the calling page must confirm first. */
export function useDeleteProductVariant(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productVariantService.remove(id),
    onSuccess: () => {
      invalidateVariantQueries(queryClient);
      showSuccessToast('Variant deleted successfully.');
    },
  });
}
