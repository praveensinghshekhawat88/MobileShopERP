import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import type { SortDirection } from '@/components/table/types';
import { STALE_TIME } from '@/config/queryClient';
import { categoryService } from '@/modules/category/services/categoryService';
import type { CategoryResponse } from '@/modules/category/types/Category';
import type { Page } from '@/types/Page';

interface UseCategoriesParams {
  readonly page: number;
  readonly size: number;
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
}

export function useCategories({
  page,
  size,
  sortKey,
  sortDirection,
}: UseCategoriesParams): UseQueryResult<Page<CategoryResponse>> {
  return useQuery({
    queryKey: ['categories', 'list', page, size, sortKey, sortDirection],
    queryFn: () => categoryService.list({ page, size, sortKey, sortDirection }),
    staleTime: STALE_TIME.default,
    placeholderData: (previousData) => previousData,
  });
}
