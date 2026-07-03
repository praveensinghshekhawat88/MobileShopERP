import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { brandService } from '@/modules/brand/services/brandService';
import type { BrandResponse, CreateBrandRequest, UpdateBrandRequest } from '@/modules/brand/types/Brand';
import { showSuccessToast } from '@/utils/toast';

/**
 * Create/update mutations suppress the global error toast — see
 * `modules/auth/hooks/useLogin.ts` for the established pattern. The calling
 * dialog applies server-side `VALIDATION_FAILED` field errors first and
 * falls back to a toast for anything else (e.g. `CONFLICT` on duplicate
 * name).
 */
export function useCreateBrand(): UseMutationResult<BrandResponse, unknown, CreateBrandRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateBrandRequest) => brandService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['brands', 'list'] });
      showSuccessToast('Brand created successfully.');
    },
  });
}

export function useUpdateBrand(): UseMutationResult<
  BrandResponse,
  unknown,
  { readonly id: number; readonly request: UpdateBrandRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => brandService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['brands', 'list'] });
      showSuccessToast('Brand updated successfully.');
    },
  });
}

export function useDeactivateBrand(): UseMutationResult<void, unknown, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => brandService.deactivate(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['brands', 'list'] });
      showSuccessToast('Brand deactivated successfully.');
    },
  });
}
