import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { Stack, Typography } from '@mui/material';
import { useState, type JSX } from 'react';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { StatCard } from '@/modules/dashboard/components/StatCard';
import { ReportDateRangeFilter } from '@/modules/report/components/ReportDateRangeFilter';
import { ReportStatGrid } from '@/modules/report/components/ReportStatGrid';
import { useProfitReportSummary } from '@/modules/report/hooks/useReports';
import { getDefaultReportDateRange } from '@/modules/report/utils/dateRange';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { formatCurrency } from '@/utils/formatCurrency';

/** Profit & Loss report — see 04_TASKS.md P09-T009. Summary-only endpoint. */
export function ProfitReportPage(): JSX.Element {
  const defaultRange = getDefaultReportDateRange();
  const [fromDate, setFromDate] = useState(defaultRange.fromDate);
  const [toDate, setToDate] = useState(defaultRange.toDate);
  const summaryQuery = useProfitReportSummary({ fromDate, toDate });
  const data = summaryQuery.data;

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Reports', to: ROUTE_PATHS.reports }, { label: 'Profit & Loss' }]} />
      <Typography variant="h5" fontWeight={700}>Profit & Loss</Typography>
      <ReportDateRangeFilter fromDate={fromDate} toDate={toDate} onFromDateChange={setFromDate} onToDateChange={setToDate} />
      <ReportStatGrid>
        <StatCard label="Total Revenue" value={formatCurrency(data?.totalRevenue ?? 0)} icon={ShoppingCartOutlinedIcon} loading={summaryQuery.isLoading} iconColor="success" />
        <StatCard label="Total COGS" value={formatCurrency(data?.totalCogs ?? 0)} icon={TrendingDownOutlinedIcon} loading={summaryQuery.isLoading} iconColor="warning" />
        <StatCard label="Total Expenses" value={formatCurrency(data?.totalExpenses ?? 0)} icon={MonetizationOnOutlinedIcon} loading={summaryQuery.isLoading} iconColor="error" />
        <StatCard label="Gross Profit" value={formatCurrency(data?.grossProfit ?? 0)} icon={TrendingUpOutlinedIcon} loading={summaryQuery.isLoading} iconColor="info" />
        <StatCard label="Net Profit" value={formatCurrency(data?.netProfit ?? 0)} icon={AccountBalanceOutlinedIcon} loading={summaryQuery.isLoading} iconColor="primary" />
      </ReportStatGrid>
    </Stack>
  );
}
