import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';

/**
 * Column definition for `DataTable<T>` — see 01_AGENTS.md § Table Rules.
 * `sortKey` maps to the backend `sort=field,direction` query param
 * (see BACKEND_API_CONTRACT.md § Pagination); omit it for non-sortable columns.
 */
export interface DataTableColumn<T> {
  readonly key: string;
  readonly header: string;
  readonly sortKey?: string;
  readonly align?: 'left' | 'right' | 'center';
  readonly width?: number | string;
  readonly render: (row: T) => ReactNode;
}
