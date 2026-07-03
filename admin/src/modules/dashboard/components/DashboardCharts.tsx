import dayjs from 'dayjs';
import type { JSX } from 'react';

import {
  ComparisonChartsRow,
  PeriodComparisonChart,
} from '@/modules/dashboard/components/PeriodComparisonChart';
import { useProfitSummary } from '@/modules/dashboard/hooks/useProfitSummary';
import { useSalesSummary } from '@/modules/dashboard/hooks/useSalesSummary';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';

const API_DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Isolates the `@mui/x-charts` bundle behind its own lazy-loaded chunk (see
 * 09_PERFORMANCE.md § Lazy Loading: "Charts — Lazy") so it never blocks the
 * rest of the dashboard (stat cards, recent lists) from rendering. Imported
 * via `React.lazy` in `DashboardPage`.
 */
export function DashboardCharts(): JSX.Element {
  const today = dayjs();

  const last7DaysRange = {
    fromDate: today.subtract(6, 'day').format(API_DATE_FORMAT),
    toDate: today.format(API_DATE_FORMAT),
  };
  const previous7DaysRange = {
    fromDate: today.subtract(13, 'day').format(API_DATE_FORMAT),
    toDate: today.subtract(7, 'day').format(API_DATE_FORMAT),
  };
  const monthToDateRange = {
    fromDate: today.startOf('month').format(API_DATE_FORMAT),
    toDate: today.format(API_DATE_FORMAT),
  };
  const previousMonth = today.subtract(1, 'month');
  const previousMonthRange = {
    fromDate: previousMonth.startOf('month').format(API_DATE_FORMAT),
    toDate: previousMonth.endOf('month').format(API_DATE_FORMAT),
  };

  const currentWeekSales = useSalesSummary(last7DaysRange);
  const previousWeekSales = useSalesSummary(previous7DaysRange);
  const currentMonthProfit = useProfitSummary(monthToDateRange);
  const previousMonthProfit = useProfitSummary(previousMonthRange);

  return (
    <ComparisonChartsRow>
      <PeriodComparisonChart
        title="Sales — This Week vs Last Week"
        currentLabel="This Week"
        previousLabel="Last Week"
        currentValue={currentWeekSales.data?.saleCount}
        previousValue={previousWeekSales.data?.saleCount}
        valueFormatter={(value) => `${formatNumber(value)} sale(s)`}
        loading={currentWeekSales.isLoading || previousWeekSales.isLoading}
        error={
          currentWeekSales.isError
            ? getApiErrorMessage(currentWeekSales.error)
            : previousWeekSales.isError
              ? getApiErrorMessage(previousWeekSales.error)
              : null
        }
        onRetry={() => {
          void currentWeekSales.refetch();
          void previousWeekSales.refetch();
        }}
      />
      <PeriodComparisonChart
        title="Net Profit — This Month vs Last Month"
        currentLabel="This Month"
        previousLabel="Last Month"
        currentValue={currentMonthProfit.data?.netProfit}
        previousValue={previousMonthProfit.data?.netProfit}
        valueFormatter={(value) => formatCurrency(value)}
        loading={currentMonthProfit.isLoading || previousMonthProfit.isLoading}
        error={
          currentMonthProfit.isError
            ? getApiErrorMessage(currentMonthProfit.error)
            : previousMonthProfit.isError
              ? getApiErrorMessage(previousMonthProfit.error)
              : null
        }
        onRetry={() => {
          void currentMonthProfit.refetch();
          void previousMonthProfit.refetch();
        }}
      />
    </ComparisonChartsRow>
  );
}
