import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  IconButton,
  Link as MuiLink,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useState, type JSX } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { STOCK_STATUSES, STOCK_STATUS_LABELS, type StockStatus } from '@/common/constants/stockStatus';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FilterSelect } from '@/components/inputs/FilterSelect';
import { StockStatusChip } from '@/components/StockStatusChip';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn, SortDirection } from '@/components/table/types';
import { useStockList } from '@/modules/inventory/hooks/useStock';
import type { StockResponse } from '@/modules/inventory/types/Stock';
import { useProductVariantOptions } from '@/modules/product';
import { buildStockDetailPath, ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';

/** Stock list — see 04_TASKS.md P06-T003. Filterable by variant and status. */
export function StockPage(): JSX.Element {
  const navigate = useNavigate();
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState<string | undefined>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [variantFilter, setVariantFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<StockStatus | ''>('');

  const { options: variantOptions, skuById } = useProductVariantOptions();
  const stockQuery = useStockList({
    page,
    size: pageSize,
    variantId: variantFilter || undefined,
    status: statusFilter || undefined,
    sortKey,
    sortDirection,
  });

  const handleSortChange = (key: string, direction: SortDirection): void => {
    setSortKey(key);
    setSortDirection(direction);
    setPage(DEFAULT_PAGE_INDEX);
  };

  const columns: readonly DataTableColumn<StockResponse>[] = [
    {
      key: 'imei',
      header: 'IMEI',
      render: (row) =>
        row.imei ? (
          <MuiLink component={RouterLink} to={buildStockDetailPath(row.id)} underline="hover" fontWeight={600}>
            {row.imei}
          </MuiLink>
        ) : (
          <MuiLink component={RouterLink} to={buildStockDetailPath(row.id)} underline="hover" fontWeight={600}>
            (No IMEI)
          </MuiLink>
        ),
    },
    { key: 'variant', header: 'SKU', render: (row) => skuById.get(row.variantId) ?? row.variantId },
    { key: 'serialNumber', header: 'Serial #', render: (row) => row.serialNumber ?? '—' },
    {
      key: 'stockStatus',
      header: 'Status',
      align: 'center',
      render: (row) => <StockStatusChip status={row.stockStatus} />,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (row: StockResponse) => (
        <Tooltip title="View stock">
          <IconButton size="small" onClick={() => navigate(buildStockDetailPath(row.id))}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Stock' }]} />

      <Typography variant="h5" fontWeight={700}>
        Stock
      </Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FilterSelect
          id="stock-variant-filter"
          label="Filter by Variant"
          value={variantFilter}
          emptyLabel="All Variants"
          options={variantOptions}
          onChange={(value) => {
            setVariantFilter(value);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
        <FilterSelect
          id="stock-status-filter"
          label="Filter by Status"
          value={statusFilter}
          emptyLabel="All Statuses"
          options={Object.values(STOCK_STATUSES).map((status) => ({
            value: status,
            label: STOCK_STATUS_LABELS[status],
          }))}
          onChange={(value) => {
            setStatusFilter(value as StockStatus | '');
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
      </Stack>

      <DataTable<StockResponse>
        columns={columns}
        rows={stockQuery.data?.content ?? []}
        getRowId={(row) => row.id}
        loading={stockQuery.isLoading}
        error={stockQuery.isError ? getApiErrorMessage(stockQuery.error) : null}
        onRetry={() => void stockQuery.refetch()}
        emptyTitle="No stock records found"
        page={page}
        pageSize={pageSize}
        totalCount={stockQuery.data?.totalElements ?? 0}
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
