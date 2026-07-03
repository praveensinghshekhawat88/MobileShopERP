import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { productImageService } from '@/modules/product/services/productImageService';
import type {
  CreateProductImageRequest,
  ProductImageResponse,
  UpdateProductImageRequest,
} from '@/modules/product/types/Product';
import { showSuccessToast } from '@/utils/toast';

export function useCreateProductImage(
  variantId: string
): UseMutationResult<ProductImageResponse, unknown, CreateProductImageRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateProductImageRequest) => productImageService.create(variantId, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['product-images', variantId] });
      showSuccessToast('Image added successfully.');
    },
  });
}

export function useUpdateProductImage(
  variantId: string
): UseMutationResult<
  ProductImageResponse,
  unknown,
  { readonly imageId: string; readonly request: UpdateProductImageRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ imageId, request }) => productImageService.update(variantId, imageId, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['product-images', variantId] });
      showSuccessToast('Image updated successfully.');
    },
  });
}

/** Deletes an image (soft delete server-side, hidden from all subsequent reads) — caller must confirm first. */
export function useDeleteProductImage(variantId: string): UseMutationResult<void, unknown, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) => productImageService.remove(variantId, imageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['product-images', variantId] });
      showSuccessToast('Image deleted successfully.');
    },
  });
}
