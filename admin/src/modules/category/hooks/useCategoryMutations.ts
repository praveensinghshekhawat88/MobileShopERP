import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';

import { categoryService } from '@/modules/category/services/categoryService';
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/modules/category/types/Category';
import { showSuccessToast } from '@/utils/toast';

/** Invalidates both the paginated list and the tree (parent picker + lookups depend on the tree). */
function invalidateCategoryQueries(queryClient: ReturnType<typeof useQueryClient>): void {
  void queryClient.invalidateQueries({ queryKey: ['categories', 'list'] });
  void queryClient.invalidateQueries({ queryKey: ['categories', 'tree'] });
}

export function useCreateCategory(): UseMutationResult<CategoryResponse, unknown, CreateCategoryRequest> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateCategoryRequest) => categoryService.create(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateCategoryQueries(queryClient);
      showSuccessToast('Category created successfully.');
    },
  });
}

export function useUpdateCategory(): UseMutationResult<
  CategoryResponse,
  unknown,
  { readonly id: number; readonly request: UpdateCategoryRequest }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => categoryService.update(id, request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: () => {
      invalidateCategoryQueries(queryClient);
      showSuccessToast('Category updated successfully.');
    },
  });
}

export function useDeactivateCategory(): UseMutationResult<void, unknown, number> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => categoryService.deactivate(id),
    onSuccess: () => {
      invalidateCategoryQueries(queryClient);
      showSuccessToast('Category deactivated successfully.');
    },
  });
}
