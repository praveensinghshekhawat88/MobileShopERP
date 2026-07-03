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
import { useSalesByCustomerReport, useSalesReportList, useSalesReportSummary } from '@/modules/report/hooks/useReports';
import type { SalesByCustomerRow, SalesReportRow } from '@/modules/report/types/Report';
import { getDefaultReportDateRange } from '@/modules/report/utils/dateRange';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

/** Sales report — see 04_TASKS.md P09-T001. */
export function SalesReportPage(): JSX.Element {
  const defaultRange = getDefaultReportDateRange();
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const range = { fromDate, toDate };
  const summaryQuery = useSalesReportSummary(range);
  const listQuery = useSalesReportList({ ...range, page, size: pageSize });
  const byCustomerQuery = useSalesByCustomerReport({ ...range, page, size: pageSize });

  const detailColumns: readonly DataTableColumn<SalesReportRow>[] = [
    { key: 'invoiceNumber', header: 'Invoice #', render: (row) => row.invoiceNumber },
    { key: 'invoiceDate', header: 'Date', render: (row) => formatDate(row.invoiceDate) },
    { key: 'customerName', header: 'Customer', render: (row) => row.customerName },
    { key: 'customerMobile', header: 'Mobile', render: (row) => row.customerMobile },
    { key: 'totalAmount', header: 'Total', align: 'right', render: (row) => formatCurrency(row.totalAmount) },
    {
      key: 'paymentStatus',
      header: 'Payment',
      align: 'center',
      render: (row) => <PaymentStatusChip status={row.paymentStatus} />,
    },
  ];

  const byCustomerColumns: readonly DataTableColumn<SalesByCustomerRow>[] = [
    { key: 'customerName', header: 'Customer', render: (row) => row.customerName },
    { key: 'customerMobile', header: 'Mobile', render: (row) => row.customerMobile },
    { key: 'saleCount', header: 'Sales', align: 'right', render: (row) => formatNumber(row.saleCount) },
    { key: 'totalAmount', header: 'Total', align: 'right', render: (row) => formatCurrency(row.totalAmount) },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs
        items={[
          { label: 'Dashboard', to: ROUTE_PATHS.dashboard },
          { label: 'Reports', to: ROUTE_PATHS.reports },
          { label: 'Sales' },
        ]}
      />
      <Typography variant="h5" fontWeight={700}>
        Sales Report
      </Typography>
      <ReportDateRangeFilter
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
      />

      <ReportStatGrid>
        <StatCard
          label="Sale Count"
          value={formatNumber(summaryQuery.data?.saleCount ?? 0)}
          icon={ReceiptOutlinedIcon}
          loading={summaryQuery.isLoading}
        />
        <StatCard
          label="Total Amount"
          value={formatCurrency(summaryQuery.data?.totalAmount ?? 0)}
          icon={AttachMoneyOutlinedIcon}
          loading={summaryQuery.isLoading}
          iconColor="success"
        />
      </ReportStatGrid>

      <Tabs
        value={tab}
        onChange={(_, value: number) => {
          setTab(value);
          setPage(DEFAULT_PAGE_INDEX);
        }}
      >
        <Tab label="Sales Detail" />
        <Tab label="By Customer" />
      </Tabs>

      {tab === 0 ? (
        <DataTable<SalesReportRow>
          columns={detailColumns}
          rows={listQuery.data?.content ?? []}
          getRowId={(row) => row.id}
          loading={listQuery.isLoading}
          error={listQuery.isError ? getApiErrorMessage(listQuery.error) : null}
          onRetry={() => void listQuery.refetch()}
          emptyTitle="No sales in this period"
          page={page}
          pageSize={pageSize}
          totalCount={listQuery.data?.totalElements ?? 0}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
      ) : (
        <DataTable<SalesByCustomerRow>
          columns={byCustomerColumns}
          rows={byCustomerQuery.data?.content ?? []}
          getRowId={(row) => row.customerId}
          loading={byCustomerQuery.isLoading}
          error={byCustomerQuery.isError ? getApiErrorMessage(byCustomerQuery.error) : null}
          onRetry={() => void byCustomerQuery.refetch()}
          emptyTitle="No customer totals in this period"
          page={page}
          pageSize={pageSize}
          totalCount={byCustomerQuery.data?.totalElements ?? 0}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(DEFAULT_PAGE_INDEX);
          }}
        />
      )}
    </Stack>
  );
}
