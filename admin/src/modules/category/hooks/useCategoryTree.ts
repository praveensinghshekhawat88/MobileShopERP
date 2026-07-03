import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { STALE_TIME } from '@/config/queryClient';
import { categoryService } from '@/modules/category/services/categoryService';
import type { CategoryTreeNode } from '@/modules/category/types/Category';

/**
 * Full active-category hierarchy — see `CategoryController#getTree`. Backs
 * the "Parent Category" picker and the parent-name lookup shown in the flat
 * paginated table (see `useCategoryOptions.ts`).
 */
export function useCategoryTree(): UseQueryResult<readonly CategoryTreeNode[]> {
  return useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: () => categoryService.getTree(),
    staleTime: STALE_TIME.default,
  });
}
