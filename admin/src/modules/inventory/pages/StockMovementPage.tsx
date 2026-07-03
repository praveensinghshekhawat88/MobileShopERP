import {
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useState, type JSX } from 'react';

import { MOVEMENT_TYPE_LABELS } from '@/common/constants/movementType';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { REFERENCE_TYPES, REFERENCE_TYPE_LABELS, type ReferenceType } from '@/common/constants/referenceType';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FilterSelect } from '@/components/inputs/FilterSelect';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { useStockMovements } from '@/modules/inventory/hooks/useStockMovements';
import type { StockMovementResponse } from '@/modules/inventory/types/Stock';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatDateTime } from '@/utils/formatDate';

/**
 * Global stock movement audit list — see 04_TASKS.md P06-T004. Supports
 * filtering by `stockId` or paired `referenceType`+`referenceId`, and
 * optional `from`/`to` date range (both required together).
 */
export function StockMovementPage(): JSX.Element {
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [stockIdFilter, setStockIdFilter] = useState('');
  const [referenceTypeFilter, setReferenceTypeFilter] = useState<ReferenceType | ''>('');
  const [referenceIdFilter, setReferenceIdFilter] = useState('');
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');

  const movementsQuery = useStockMovements({
    page,
    size: pageSize,
    stockId: stockIdFilter.trim() || undefined,
    referenceType: referenceTypeFilter || undefined,
    referenceId: referenceIdFilter.trim() || undefined,
    from: fromFilter ? `${fromFilter}T00:00:00Z` : undefined,
    to: toFilter ? `${toFilter}T23:59:59Z` : undefined,
    sortKey,
    sortDirection,
  });

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const columns: readonly DataTableColumn<StockMovementResponse>[] = [
    {
      key: 'movementType',
      header: 'Type',
      render: (row) => MOVEMENT_TYPE_LABELS[row.movementType],
    },
    {
      key: 'referenceType',
      header: 'Reference Type',
      render: (row) => REFERENCE_TYPE_LABELS[row.referenceType],
    },
    {
      key: 'referenceId',
      header: 'Reference ID',
      render: (row) => row.referenceId,
    },
    { key: 'stockId', header: 'Stock ID', render: (row) => row.stockId },
    { key: 'remarks', header: 'Remarks', render: (row) => row.remarks ?? '—' },
    {
      key: 'createdAt',
      header: 'Date',
      sortKey: 'createdAt',
      render: (row) => formatDateTime(row.createdAt),
    },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs
        items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Stock Movements' }]}
      />

      <Typography variant="h5" fontWeight={700}>
        Stock Movements
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} flexWrap="wrap">
        <TextField
          size="small"
          label="Stock ID"
          sx={{ minWidth: 280 }}
          value={stockIdFilter}
          onChange={(event) => {
            setStockIdFilter(event.target.value);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
        <FilterSelect
          id="movement-ref-type"
          label="Reference Type"
          value={referenceTypeFilter}
          emptyLabel="Any"
          minWidth={180}
          options={Object.values(REFERENCE_TYPES).map((type) => ({
            value: type,
            label: REFERENCE_TYPE_LABELS[type],
          }))}
          onChange={(value) => {
            setReferenceTypeFilter(value as ReferenceType | '');
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
        <TextField
          size="small"
          label="Reference ID"
          sx={{ minWidth: 280 }}
          value={referenceIdFilter}
          disabled={!referenceTypeFilter}
          onChange={(event) => {
            setReferenceIdFilter(event.target.value);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
        <TextField
          size="small"
          label="From Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={fromFilter}
          onChange={(event) => {
            setFromFilter(event.target.value);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
        <TextField
          size="small"
          label="To Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={toFilter}
          onChange={(event) => {
            setToFilter(event.target.value);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
      </Stack>

      <DataTable<StockMovementResponse>
        columns={columns}
        rows={movementsQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={movementsQuery.isLoading}
        error={movementsQuery.isError ? getApiErrorMessage(movementsQuery.error) : null}
        onRetry={() => void movementsQuery.refetch()}
        emptyTitle="No stock movements found"
        page={page}
        pageSize={pageSize}
        totalCount={movementsQuery.data?.totalElements ?? 0}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(DEFAULT_PAGE_INDEX);
        }}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />
    </Stack>
  );
}
