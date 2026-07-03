import { Card, CardContent, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { useState, type JSX } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ErrorState } from '@/components/feedback/ErrorState';
import { PageLoader } from '@/components/loading/PageLoader';
import { PaymentStatusChip } from '@/components/PaymentStatusChip';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { useCustomerHistoryReport } from '@/modules/report/hooks/useReports';
import type { CustomerSaleHistoryItem } from '@/modules/report/types/Report';
import { getDefaultReportDateRange } from '@/modules/report/utils/dateRange';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

/** Customer purchase history drill-down — nested sales page from report API. */
export function CustomerReportDetailPage(): JSX.Element {
  const { customerId } = useParams<{ customerId: string }>();
  const [searchParams] = useSearchParams();
  const defaultRange = getDefaultReportDateRange();
  const fromDate = searchParams.get('fromDate') ?? defaultRange.fromDate;
  const toDate = searchParams.get('toDate') ?? defaultRange.toDate;
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const query = useCustomerHistoryReport(customerId, { fromDate, toDate, page, size: pageSize });

  if (!customerId) {
    return <ErrorState message="No customer was specified." />;
  }

  if (query.isLoading) {
    return <PageLoader />;
  }

  if (query.isError || !query.data) {
    return <ErrorState message={query.isError ? getApiErrorMessage(query.error) : 'Customer history not found.'} onRetry={() => void query.refetch()} />;
  }

  const history = query.data;
  const columns: readonly DataTableColumn<CustomerSaleHistoryItem>[] = [
    { key: 'invoiceNumber', header: 'Invoice #', render: (r) => r.invoiceNumber },
    { key: 'invoiceDate', header: 'Date', render: (r) => formatDate(r.invoiceDate) },
    { key: 'totalAmount', header: 'Total', align: 'right', render: (r) => formatCurrency(r.totalAmount) },
    { key: 'paymentStatus', header: 'Payment', align: 'center', render: (r) => <PaymentStatusChip status={r.paymentStatus} /> },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Reports', to: ROUTE_PATHS.reports }, { label: 'Customers', to: ROUTE_PATHS.reportsCustomers }, { label: history.customerName }]} />
      <Typography variant="h5" fontWeight={700}>{history.customerName}</Typography>
      <Card><CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}><Typography variant="caption" color="text.secondary">Mobile</Typography><Typography>{history.customerMobile}</Typography></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><Typography variant="caption" color="text.secondary">Sales</Typography><Typography>{history.saleCount}</Typography></Grid>
          <Grid size={{ xs: 12, sm: 4 }}><Typography variant="caption" color="text.secondary">Total</Typography><Typography>{formatCurrency(history.totalAmount)}</Typography></Grid>
        </Grid>
      </CardContent></Card>
      <DataTable columns={columns} rows={history.sales.content} getRowId={(r) => r.id} loading={query.isFetching} page={page} pageSize={pageSize} totalCount={history.sales.totalElements} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(DEFAULT_PAGE_INDEX); }} emptyTitle="No sales in this period" />
    </Stack>
  );
}
