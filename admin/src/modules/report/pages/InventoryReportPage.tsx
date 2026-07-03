import { Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useState, type JSX } from 'react';

import { MOVEMENT_TYPE_LABELS } from '@/common/constants/movementType';
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { REFERENCE_TYPE_LABELS } from '@/common/constants/referenceType';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { StockStatusChip } from '@/components/StockStatusChip';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import {
  useLowStockReport,
  useStockByImeiReport,
  useStockMovementReport,
  useStockSnapshotReport,
} from '@/modules/report/hooks/useReports';
import type { LowStockReportRow, StockMovementReportRow, StockSnapshotRow, StockUnitRow } from '@/modules/report/types/Report';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatNumber } from '@/utils/formatCurrency';
import { formatDateTime } from '@/utils/formatDate';

/** Inventory report — see 04_TASKS.md P09-T003. */
export function InventoryReportPage(): JSX.Element {
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [imei, setImei] = useState('');
  const [threshold, setThreshold] = useState(5);

  const snapshotQuery = useStockSnapshotReport({ page, size: pageSize });
  const lowStockQuery = useLowStockReport({ page, size: pageSize, threshold });
  const movementQuery = useStockMovementReport({ page, size: pageSize });
  const imeiQuery = useStockByImeiReport({ imei, page, size: pageSize });

  const snapshotColumns: readonly DataTableColumn<StockSnapshotRow>[] = [
    { key: 'productName', header: 'Product', render: (r) => r.productName },
    { key: 'variantSku', header: 'SKU', render: (r) => r.variantSku },
    { key: 'stockStatus', header: 'Status', render: (r) => <StockStatusChip status={r.stockStatus} /> },
    { key: 'quantity', header: 'Qty', align: 'right', render: (r) => formatNumber(r.quantity) },
  ];

  const lowColumns: readonly DataTableColumn<LowStockReportRow>[] = [
    { key: 'productName', header: 'Product', render: (r) => r.productName },
    { key: 'variantSku', header: 'SKU', render: (r) => r.variantSku },
    { key: 'availableCount', header: 'Available', align: 'right', render: (r) => formatNumber(r.availableCount) },
    { key: 'threshold', header: 'Threshold', align: 'right', render: (r) => formatNumber(r.threshold) },
  ];

  const movementColumns: readonly DataTableColumn<StockMovementReportRow>[] = [
    { key: 'productName', header: 'Product', render: (r) => r.productName },
    { key: 'imei', header: 'IMEI', render: (r) => r.imei ?? '—' },
    { key: 'movementType', header: 'Type', render: (r) => MOVEMENT_TYPE_LABELS[r.movementType] },
    { key: 'referenceType', header: 'Reference', render: (r) => REFERENCE_TYPE_LABELS[r.referenceType] },
    { key: 'createdAt', header: 'When', render: (r) => formatDateTime(r.createdAt) },
  ];

  const imeiColumns: readonly DataTableColumn<StockUnitRow>[] = [
    { key: 'productName', header: 'Product', render: (r) => r.productName },
    { key: 'variantSku', header: 'SKU', render: (r) => r.variantSku },
    { key: 'imei', header: 'IMEI', render: (r) => r.imei ?? '—' },
    { key: 'stockStatus', header: 'Status', render: (r) => <StockStatusChip status={r.stockStatus} /> },
  ];

  const resetPage = (): void => setPage(DEFAULT_PAGE_INDEX);

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Reports', to: ROUTE_PATHS.reports }, { label: 'Inventory' }]} />
      <Typography variant="h5" fontWeight={700}>Inventory Report</Typography>
      <Tabs value={tab} onChange={(_, v) => { setTab(v); resetPage(); }}>
        <Tab label="Snapshot" /><Tab label="Low Stock" /><Tab label="Movements" /><Tab label="IMEI Lookup" />
      </Tabs>

      {tab === 1 ? (
        <TextField size="small" label="Low Stock Threshold" type="number" value={threshold} onChange={(e) => { setThreshold(Number(e.target.value)); resetPage(); }} sx={{ maxWidth: 200 }} />
      ) : null}
      {tab === 3 ? (
        <TextField size="small" label="IMEI" value={imei} onChange={(e) => { setImei(e.target.value); resetPage(); }} sx={{ maxWidth: 280 }} />
      ) : null}

      {tab === 0 ? (
        <DataTable columns={snapshotColumns} rows={snapshotQuery.data?.content ?? []} getRowId={(r) => `${r.variantId}-${r.stockStatus}`} loading={snapshotQuery.isLoading} error={snapshotQuery.isError ? getApiErrorMessage(snapshotQuery.error) : null} onRetry={() => void snapshotQuery.refetch()} emptyTitle="No stock snapshot data" page={page} pageSize={pageSize} totalCount={snapshotQuery.data?.totalElements ?? 0} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); resetPage(); }} />
      ) : null}
      {tab === 1 ? (
        <DataTable columns={lowColumns} rows={lowStockQuery.data?.content ?? []} getRowId={(r) => r.variantId} loading={lowStockQuery.isLoading} error={lowStockQuery.isError ? getApiErrorMessage(lowStockQuery.error) : null} onRetry={() => void lowStockQuery.refetch()} emptyTitle="No low stock items" page={page} pageSize={pageSize} totalCount={lowStockQuery.data?.totalElements ?? 0} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); resetPage(); }} />
      ) : null}
      {tab === 2 ? (
        <DataTable columns={movementColumns} rows={movementQuery.data?.content ?? []} getRowId={(r) => r.id} loading={movementQuery.isLoading} error={movementQuery.isError ? getApiErrorMessage(movementQuery.error) : null} onRetry={() => void movementQuery.refetch()} emptyTitle="No stock movements" page={page} pageSize={pageSize} totalCount={movementQuery.data?.totalElements ?? 0} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); resetPage(); }} />
      ) : null}
      {tab === 3 ? (
        <DataTable columns={imeiColumns} rows={imeiQuery.data?.content ?? []} getRowId={(r) => r.id} loading={imeiQuery.isLoading} error={imeiQuery.isError ? getApiErrorMessage(imeiQuery.error) : null} onRetry={() => void imeiQuery.refetch()} emptyTitle={imei ? 'No stock found for this IMEI' : 'Enter an IMEI to search'} page={page} pageSize={pageSize} totalCount={imeiQuery.data?.totalElements ?? 0} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); resetPage(); }} />
      ) : null}
    </Stack>
  );
}
