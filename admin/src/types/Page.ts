/**
 * Mirrors Spring Data's `Page<T>` JSON shape returned inside `ApiResponse<T>.data`
 * for every paginated list endpoint — see BACKEND_API_CONTRACT.md § Pagination.
 */
export interface Page<T> {
  readonly content: readonly T[];
  readonly totalElements: number;
  readonly totalPages: number;
  readonly number: number;
  readonly size: number;
  readonly first: boolean;
  readonly last: boolean;
  readonly empty: boolean;
}

/**
 * 0-based page index — first page is `page: 0` (see BACKEND_API_CONTRACT.md § Pagination).
 * `sort` combines field and direction in one string per entry, e.g. `"name,asc"`.
 */
export interface PageableRequest {
  readonly page: number;
  readonly size: number;
  readonly sort?: readonly string[];
}

export const DEFAULT_PAGEABLE: PageableRequest = {
  page: 0,
  size: 20,
};
