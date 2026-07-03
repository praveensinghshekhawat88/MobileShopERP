import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PaymentStatusChip } from '@/components/PaymentStatusChip';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { StatCard } from '@/modules/dashboard/components/StatCard';
import { ReportDateRangeFilter } from '@/modules/report/components/ReportDateRangeFilter';
import { ReportStatGrid } from '@/modules/report/components/ReportStatGrid';
import {
  usePurchaseReportList,
  usePurchaseReportSummary,
  usePurchasesBySupplierReport,
} from '@/modules/report/hooks/useReports';
import type { PurchaseBySupplierRow, PurchaseReportRow } from '@/modules/report/types/Report';
import { getDefaultReportDateRange } from '@/modules/report/utils/dateRange';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

/** Purchase report — see 04_TASKS.md P09-T002. */
export function PurchaseReportPage(): JSX.Element {
  const defaultRange = getDefaultReportDateRange();
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const range = { fromDate, toDate };

  const summaryQuery = usePurchaseReportSummary(range);
  const listQuery = usePurchaseReportList({ ...range, page, size: pageSize });
  const bySupplierQuery = usePurchasesBySupplierReport({ ...range, page, size: pageSize });

  const detailColumns: readonly DataTableColumn<PurchaseReportRow>[] = [
    { key: 'invoiceNumber', header: 'Invoice #', render: (row) => row.invoiceNumber },
    { key: 'invoiceDate', header: 'Date', render: (row) => formatDate(row.invoiceDate) },
    { key: 'supplierName', header: 'Supplier', render: (row) => row.supplierName },
    { key: 'totalAmount', header: 'Total', align: 'right', render: (row) => formatCurrency(row.totalAmount) },
    { key: 'paymentStatus', header: 'Payment', align: 'center', render: (row) => <PaymentStatusChip status={row.paymentStatus} /> },
  ];

  const bySupplierColumns: readonly DataTableColumn<PurchaseBySupplierRow>[] = [
    { key: 'supplierName', header: 'Supplier', render: (row) => row.supplierName },
    { key: 'purchaseCount', header: 'Purchases', align: 'right', render: (row) => formatNumber(row.purchaseCount) },
    { key: 'totalAmount', header: 'Total', align: 'right', render: (row) => formatCurrency(row.totalAmount) },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Reports', to: ROUTE_PATHS.reports }, { label: 'Purchases' }]} />
      <Typography variant="h5" fontWeight={700}>Purchase Report</Typography>
      <ReportDateRangeFilter fromDate={fromDate} toDate={toDate} onFromDateChange={setFromDate} onToDateChange={setToDate} />
      <ReportStatGrid>
        <StatCard label="Purchase Count" value={formatNumber(summaryQuery.data?.purchaseCount ?? 0)} icon={ReceiptOutlinedIcon} loading={summaryQuery.isLoading} />
        <StatCard label="Total Amount" value={formatCurrency(summaryQuery.data?.totalAmount ?? 0)} icon={AttachMoneyOutlinedIcon} loading={summaryQuery.isLoading} iconColor="warning" />
      </ReportStatGrid>
      <Tabs value={tab} onChange={(_, v) => { setTab(v); setPage(DEFAULT_PAGE_INDEX); }}>
        <Tab label="Purchase Detail" /><Tab label="By Supplier" />
      </Tabs>
      {tab === 0 ? (
        <DataTable columns={detailColumns} rows={listQuery.data?.content ?? []} getRowId={(r) => r.id} loading={listQuery.isLoading} error={listQuery.isError ? getApiErrorMessage(listQuery.error) : null} onRetry={() => void listQuery.refetch()} emptyTitle="No purchases in this period" page={page} pageSize={pageSize} totalCount={listQuery.data?.totalElements ?? 0} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(DEFAULT_PAGE_INDEX); }} />
      ) : (
        <DataTable columns={bySupplierColumns} rows={bySupplierQuery.data?.content ?? []} getRowId={(r) => r.supplierId} loading={bySupplierQuery.isLoading} error={bySupplierQuery.isError ? getApiErrorMessage(bySupplierQuery.error) : null} onRetry={() => void bySupplierQuery.refetch()} emptyTitle="No supplier totals in this period" page={page} pageSize={pageSize} totalCount={bySupplierQuery.data?.totalElements ?? 0} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(DEFAULT_PAGE_INDEX); }} />
      )}
    </Stack>
  );
}
