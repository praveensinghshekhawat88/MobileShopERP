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
import { useSupplierPurchasesReport } from '@/modules/report/hooks/useReports';
import type { SupplierPurchaseItem } from '@/modules/report/types/Report';
import { getDefaultReportDateRange } from '@/modules/report/utils/dateRange';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

/** Supplier purchase drill-down from report API. */
export function SupplierReportDetailPage(): JSX.Element {
  const { supplierId } = useParams<{ supplierId: string }>();
  const [searchParams] = useSearchParams();
  const defaultRange = getDefaultReportDateRange();
  const fromDate = searchParams.get('fromDate') ?? defaultRange.fromDate;
  const toDate = searchParams.get('toDate') ?? defaultRange.toDate;
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const query = useSupplierPurchasesReport(supplierId, { fromDate, toDate, page, size: pageSize });

  if (!supplierId) {
    return <ErrorState message="No supplier was specified." />;
  }
  if (query.isLoading) {
    return <PageLoader />;
  }
  if (query.isError || !query.data) {
    return <ErrorState message={query.isError ? getApiErrorMessage(query.error) : 'Supplier report not found.'} onRetry={() => void query.refetch()} />;
  }

  const report = query.data;
  const columns: readonly DataTableColumn<SupplierPurchaseItem>[] = [
    { key: 'invoiceNumber', header: 'Invoice #', render: (r) => r.invoiceNumber },
    { key: 'invoiceDate', header: 'Date', render: (r) => formatDate(r.invoiceDate) },
    { key: 'totalAmount', header: 'Total', align: 'right', render: (r) => formatCurrency(r.totalAmount) },
    { key: 'paymentStatus', header: 'Payment', align: 'center', render: (r) => <PaymentStatusChip status={r.paymentStatus} /> },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Reports', to: ROUTE_PATHS.reports }, { label: 'Suppliers', to: ROUTE_PATHS.reportsSuppliers }, { label: report.supplierName }]} />
      <Typography variant="h5" fontWeight={700}>{report.supplierName}</Typography>
      <Card><CardContent><Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 3 }}><Typography variant="caption" color="text.secondary">Purchases</Typography><Typography>{report.purchaseCount}</Typography></Grid>
        <Grid size={{ xs: 12, sm: 3 }}><Typography variant="caption" color="text.secondary">Total Spend</Typography><Typography>{formatCurrency(report.totalSpend)}</Typography></Grid>
        <Grid size={{ xs: 12, sm: 3 }}><Typography variant="caption" color="text.secondary">Paid</Typography><Typography>{formatCurrency(report.paidAmount)}</Typography></Grid>
        <Grid size={{ xs: 12, sm: 3 }}><Typography variant="caption" color="text.secondary">Outstanding</Typography><Typography>{formatCurrency(report.outstandingAmount)}</Typography></Grid>
      </Grid></CardContent></Card>
      <DataTable columns={columns} rows={report.purchases.content} getRowId={(r) => r.id} loading={query.isFetching} page={page} pageSize={pageSize} totalCount={report.purchases.totalElements} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(DEFAULT_PAGE_INDEX); }} emptyTitle="No purchases in this period" />
    </Stack>
  );
}
