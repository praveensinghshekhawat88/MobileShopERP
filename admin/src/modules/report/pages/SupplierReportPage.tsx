import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { ReportDateRangeFilter } from '@/modules/report/components/ReportDateRangeFilter';
import { useSupplierSummaryReport } from '@/modules/report/hooks/useReports';
import type { SupplierSummaryRow } from '@/modules/report/types/Report';
import { getDefaultReportDateRange } from '@/modules/report/utils/dateRange';
import { buildSupplierReportDetailPath, ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';

/** Supplier report — see 04_TASKS.md P09-T005. */
export function SupplierReportPage(): JSX.Element {
  const navigate = useNavigate();
  const defaultRange = getDefaultReportDateRange();
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const query = useSupplierSummaryReport({ fromDate, toDate, page, size: pageSize });

  const columns: readonly DataTableColumn<SupplierSummaryRow>[] = [
    { key: 'supplierName', header: 'Supplier', render: (r) => r.supplierName },
    { key: 'purchaseCount', header: 'Purchases', align: 'right', render: (r) => formatNumber(r.purchaseCount) },
    { key: 'totalSpend', header: 'Total Spend', align: 'right', render: (r) => formatCurrency(r.totalSpend) },
    { key: 'paidAmount', header: 'Paid', align: 'right', render: (r) => formatCurrency(r.paidAmount) },
    { key: 'outstandingAmount', header: 'Outstanding', align: 'right', render: (r) => formatCurrency(r.outstandingAmount) },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (r) => (
        <Tooltip title="View purchases">
          <IconButton size="small" onClick={() => navigate(buildSupplierReportDetailPath(r.supplierId, fromDate, toDate))}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Reports', to: ROUTE_PATHS.reports }, { label: 'Suppliers' }]} />
      <Typography variant="h5" fontWeight={700}>Supplier Report</Typography>
      <ReportDateRangeFilter fromDate={fromDate} toDate={toDate} onFromDateChange={setFromDate} onToDateChange={setToDate} />
      <DataTable columns={columns} rows={query.data?.content ?? []} getRowId={(r) => r.supplierId} loading={query.isLoading} error={query.isError ? getApiErrorMessage(query.error) : null} onRetry={() => void query.refetch()} emptyTitle="No supplier data" page={page} pageSize={pageSize} totalCount={query.data?.totalElements ?? 0} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(DEFAULT_PAGE_INDEX); }} />
    </Stack>
  );
}
