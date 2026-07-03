import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import type { JSX } from 'react';

import { PAGE_SIZE_OPTIONS } from '@/common/constants/pagination';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { TableSkeleton } from '@/components/table/TableSkeleton';
import type { DataTableColumn, SortDirection } from '@/components/table/types';

interface DataTableProps<T> {
  readonly columns: readonly DataTableColumn<T>[];
  readonly rows: readonly T[];
  readonly getRowId: (row: T) => string;
  readonly loading?: boolean;
  readonly error?: string | null;
  readonly onRetry?: () => void;
  readonly emptyTitle?: string;
  readonly emptyDescription?: string;
  /** Server-side pagination — see 01_AGENTS.md § Table Rules: "No table should directly call APIs." */
  readonly page: number;
  readonly pageSize: number;
  readonly totalCount: number;
  readonly onPageChange: (page: number) => void;
  readonly onPageSizeChange: (pageSize: number) => void;
  /** Server-side sorting (see BACKEND_API_CONTRACT.md § Pagination: `sort=field,direction`). */
  readonly sortKey?: string;
  readonly sortDirection?: SortDirection;
  readonly onSortChange?: (sortKey: string, direction: SortDirection) => void;
  /** Row selection (see 01_AGENTS.md § Table Rules: "Row Selection"). */
  readonly selectable?: boolean;
  readonly selectedIds?: readonly string[];
  readonly onSelectionChange?: (ids: readonly string[]) => void;
}

/**
 * The one reusable data table — see 01_AGENTS.md § Table Rules and
 * 03_ARCHITECTURE.md § Table Architecture. Every ERP module's list screen
 * must compose this component with its own columns rather than building a
 * bespoke `<Table>`. Search/Filters/Toolbar are module-level concerns that
 * live above this component (see Table Architecture: Toolbar → Filters →
 * Search → Table → Pagination).
 */
export function DataTable<T>({
  columns,
  rows,
  getRowId,
  loading = false,
  error = null,
  onRetry,
  emptyTitle = 'No records found',
  emptyDescription,
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  sortKey,
  sortDirection = 'asc',
  onSortChange,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
}: DataTableProps<T>): JSX.Element {
  const allRowIds = rows.map(getRowId);
  const selectedSet = new Set(selectedIds);
  const allSelected = allRowIds.length > 0 && allRowIds.every((id) => selectedSet.has(id));
  const someSelected = !allSelected && allRowIds.some((id) => selectedSet.has(id));

  const handleSelectAll = (checked: boolean): void => {
    onSelectionChange?.(checked ? allRowIds : []);
  };

  const handleSelectRow = (rowId: string, checked: boolean): void => {
    if (!onSelectionChange) {
      return;
    }
    onSelectionChange(checked ? [...selectedIds, rowId] : selectedIds.filter((id) => id !== rowId));
  };

  const handleSort = (column: DataTableColumn<T>): void => {
    if (!column.sortKey || !onSortChange) {
      return;
    }
    const nextDirection: SortDirection =
      sortKey === column.sortKey && sortDirection === 'asc' ? 'desc' : 'asc';
    onSortChange(column.sortKey, nextDirection);
  };

  const columnCount = columns.length + (selectable ? 1 : 0);
  const showEmptyState = !loading && !error && rows.length === 0;

  return (
    <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
      <Table stickyHeader size="medium" aria-label="Data table">
        <TableHead>
          <TableRow>
            {selectable ? (
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={someSelected}
                  checked={allSelected}
                  onChange={(event) => handleSelectAll(event.target.checked)}
                  inputProps={{ 'aria-label': 'Select all rows' }}
                />
              </TableCell>
            ) : null}
            {columns.map((column) => (
              <TableCell key={column.key} align={column.align} width={column.width}>
                {column.sortKey ? (
                  <TableSortLabel
                    active={sortKey === column.sortKey}
                    direction={sortKey === column.sortKey ? sortDirection : 'asc'}
                    onClick={() => handleSort(column)}
                  >
                    {column.header}
                  </TableSortLabel>
                ) : (
                  column.header
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? <TableSkeleton columnCount={columnCount} /> : null}
          {!loading && error ? (
            <TableRow>
              <TableCell colSpan={columnCount}>
                <ErrorState message={error} onRetry={onRetry} />
              </TableCell>
            </TableRow>
          ) : null}
          {showEmptyState ? (
            <TableRow>
              <TableCell colSpan={columnCount}>
                <EmptyState title={emptyTitle} description={emptyDescription} />
              </TableCell>
            </TableRow>
          ) : null}
          {!loading && !error
            ? rows.map((row) => {
                const rowId = getRowId(row);
                return (
                  <TableRow key={rowId} hover selected={selectedSet.has(rowId)}>
                    {selectable ? (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selectedSet.has(rowId)}
                          onChange={(event) => handleSelectRow(rowId, event.target.checked)}
                          inputProps={{ 'aria-label': `Select row ${rowId}` }}
                        />
                      </TableCell>
                    ) : null}
                    {columns.map((column) => (
                      <TableCell key={column.key} align={column.align}>
                        {column.render(row)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            : null}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[...PAGE_SIZE_OPTIONS]}
        onPageChange={(_event, newPage) => onPageChange(newPage)}
        onRowsPerPageChange={(event) => onPageSizeChange(Number(event.target.value))}
        sx={{
          '.MuiTablePagination-toolbar': {
            flexWrap: 'wrap',
            gap: 1,
            px: { xs: 1, sm: 2 },
          },
        }}
      />
    </TableContainer>
  );
}
