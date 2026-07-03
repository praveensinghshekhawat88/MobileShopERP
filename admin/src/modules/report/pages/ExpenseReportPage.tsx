import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined';
import { FormControl, InputLabel, MenuItem, Select, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useState, type JSX } from 'react';

import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE } from '@/common/constants/pagination';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { StatCard } from '@/modules/dashboard/components/StatCard';
import { ReportDateRangeFilter } from '@/modules/report/components/ReportDateRangeFilter';
import { ReportStatGrid } from '@/modules/report/components/ReportStatGrid';
import { useExpenseReportList, useExpenseReportSummary } from '@/modules/report/hooks/useReports';
import type { ExpenseReportRow, ExpenseSummaryGroupBy } from '@/modules/report/types/Report';
import { getDefaultReportDateRange } from '@/modules/report/utils/dateRange';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

/** Expense report — see 04_TASKS.md P09-T008. */
export function ExpenseReportPage(): JSX.Element {
  const defaultRange = getDefaultReportDateRange();
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);
  const [groupBy, setGroupBy] = useState<ExpenseSummaryGroupBy>('DAY');
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(DEFAULT_PAGE_INDEX);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const range = { fromDate, toDate, groupBy };

  const summaryQuery = useExpenseReportSummary(range);
  const listQuery = useExpenseReportList({ fromDate, toDate, page, size: pageSize });

  const bucketColumns: readonly DataTableColumn<{ readonly periodStart: string; readonly expenseCount: number; readonly totalAmount: number }>[] = [
    { key: 'periodStart', header: 'Period', render: (r) => formatDate(r.periodStart) },
    { key: 'expenseCount', header: 'Count', align: 'right', render: (r) => formatNumber(r.expenseCount) },
    { key: 'totalAmount', header: 'Amount', align: 'right', render: (r) => formatCurrency(r.totalAmount) },
  ];

  const detailColumns: readonly DataTableColumn<ExpenseReportRow>[] = [
    { key: 'title', header: 'Title', render: (r) => r.title },
    { key: 'expenseDate', header: 'Date', render: (r) => formatDate(r.expenseDate) },
    { key: 'amount', header: 'Amount', align: 'right', render: (r) => formatCurrency(r.amount) },
    { key: 'remarks', header: 'Remarks', render: (r) => r.remarks ?? '—' },
  ];

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Reports', to: ROUTE_PATHS.reports }, { label: 'Expenses' }]} />
      <Typography variant="h5" fontWeight={700}>Expense Report</Typography>
      <ReportDateRangeFilter fromDate={fromDate} toDate={toDate} onFromDateChange={setFromDate} onToDateChange={setToDate} />
      <FormControl size="small" sx={{ maxWidth: 200 }}>
        <InputLabel id="expense-group-by">Group By</InputLabel>
        <Select labelId="expense-group-by" label="Group By" value={groupBy} onChange={(e) => setGroupBy(e.target.value as ExpenseSummaryGroupBy)}>
          <MenuItem value="DAY">Day</MenuItem><MenuItem value="MONTH">Month</MenuItem>
        </Select>
      </FormControl>
      <ReportStatGrid>
        <StatCard label="Expense Count" value={formatNumber(summaryQuery.data?.totalExpenseCount ?? 0)} icon={ReceiptOutlinedIcon} loading={summaryQuery.isLoading} />
        <StatCard label="Total Amount" value={formatCurrency(summaryQuery.data?.totalAmount ?? 0)} icon={MonetizationOnOutlinedIcon} loading={summaryQuery.isLoading} iconColor="error" />
      </ReportStatGrid>
      <Tabs value={tab} onChange={(_, v) => setTab(v)}><Tab label="Buckets" /><Tab label="Detail" /></Tabs>
      {tab === 0 ? (
        <DataTable columns={bucketColumns} rows={summaryQuery.data?.buckets ?? []} getRowId={(r) => r.periodStart} loading={summaryQuery.isLoading} error={summaryQuery.isError ? getApiErrorMessage(summaryQuery.error) : null} onRetry={() => void summaryQuery.refetch()} emptyTitle="No expense buckets" page={0} pageSize={summaryQuery.data?.buckets.length ?? 0} totalCount={summaryQuery.data?.buckets.length ?? 0} onPageChange={() => undefined} onPageSizeChange={() => undefined} />
      ) : (
        <DataTable columns={detailColumns} rows={listQuery.data?.content ?? []} getRowId={(r) => r.id} loading={listQuery.isLoading} error={listQuery.isError ? getApiErrorMessage(listQuery.error) : null} onRetry={() => void listQuery.refetch()} emptyTitle="No expenses in this period" page={page} pageSize={pageSize} totalCount={listQuery.data?.totalElements ?? 0} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(DEFAULT_PAGE_INDEX); }} />
      )}
    </Stack>
  );
}
