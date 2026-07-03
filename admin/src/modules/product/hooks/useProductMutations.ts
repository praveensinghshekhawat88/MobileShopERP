import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { productService } from '@/modules/product/services/productService';
import type { CreateProductRequest, ProductResponse, UpdateProductRequest } from '@/modules/product/types/Product';
import { showSuccessToast } from '@/utils/toast';

function invalidateProductQueries(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['products'] });
}

export function useCreateProduct(): UseMutationResult<ProductResponse, unknown, CreateProductRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProductRequest) => productService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateProductQueries(queryClient);
      showSuccessToast('Product created successfully.');
    },
  });
}

export function useUpdateProduct(): UseMutationResult<
  ProductResponse,
  unknown,
  { readonly id: string; readonly request: UpdateProductRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => productService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateProductQueries(queryClient);
      showSuccessToast('Product updated successfully.');
    },
  });
}

export function useDeactivateProduct(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.deactivate(id),
    onSuccess: () => {
      invalidateProductQueries(queryClient);
      showSuccessToast('Product deactivated successfully.');
    },
  });
}

/** Soft delete (see `ProductService#delete`, sets `deleted_at`) — the calling page must confirm first. */
export function useDeleteProduct(): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productService.remove(id),
    onSuccess: () => {
      invalidateProductQueries(queryClient);
      showSuccessToast('Product deleted successfully.');
    },
  });
}
