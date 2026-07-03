import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Chip, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import { useState, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { ReportDateRangeFilter } from '@/modules/report/components/ReportDateRangeFilter';
import { useTopCustomersReport } from '@/modules/report/hooks/useReports';
import type { TopCustomerRow } from '@/modules/report/types/Report';
import { getDefaultReportDateRange } from '@/modules/report/utils/dateRange';
import { buildCustomerReportDetailPath, ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';

/** Customer report — see 04_TASKS.md P09-T004. */
export function CustomerReportPage(): JSX.Element {
  const navigate = useNavigate();
  const defaultRange = getDefaultReportDateRange();
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const query = useTopCustomersReport({ page, size: pageSize, fromDate, toDate });

  const columns: readonly DataTableColumn<TopCustomerRow>[] = [
    { key: 'customerName', header: 'Customer', render: (r) => r.customerName },
    { key: 'customerMobile', header: 'Mobile', render: (r) => r.customerMobile },
    { key: 'saleCount', header: 'Sales', align: 'right', render: (r) => formatNumber(r.saleCount) },
    { key: 'totalRevenue', header: 'Revenue', align: 'right', render: (r) => formatCurrency(r.totalRevenue) },
    {
      key: 'customerDeleted',
      header: 'Status',
      render: (r) =>
        r.customerDeleted ? (
          <Chip label="Deleted" size="small" color="error" variant="outlined" />
        ) : (
          <Chip label="Active" size="small" color="success" variant="outlined" />
        ),
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (r) => (
        <Tooltip title="View purchase history">
          <IconButton size="small" onClick={() => navigate(buildCustomerReportDetailPath(r.customerId, fromDate, toDate))}>
            <ChevronRightIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Reports', to: ROUTE_PATHS.reports }, { label: 'Customers' }]} />
      <Typography variant="h5" fontWeight={700}>Customer Report</Typography>
      <ReportDateRangeFilter fromDate={fromDate} toDate={toDate} onFromDateChange={setFromDate} onToDateChange={setToDate} />
      <DataTable columns={columns} rows={query.data?.content ?? []} getRowId={(r) => r.customerId} loading={query.isLoading} error={query.isError ? getApiErrorMessage(query.error) : null} onRetry={() => void query.refetch()} emptyTitle="No customer data" page={page} pageSize={pageSize} totalCount={query.data?.totalElements ?? 0} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(DEFAULT_PAGE_INDEX); }} />
    </Stack>
  );
}
