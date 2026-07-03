import type { SortDirection } from '@/components/table/types';

/**
 * Builds the `sort` query param array expected by Spring `Pageable` — see
 * BACKEND_API_CONTRACT.md § Pagination: "sort=field,direction". Axios's
 * default param serializer turns a single-element array into one repeated
 * `sort` query param, which is exactly the shape Spring Data expects.
 */
export function toSortParam(sortKey?: string, sortDirection: SortDirection = 'asc'): string[] | undefined {
  return sortKey ? [`${sortKey},${sortDirection}`] : undefined;
}
