import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import type { JSX } from 'react';

import { ErrorState } from '@/components/feedback/ErrorState';

interface PeriodComparisonChartProps {
  readonly title: string;
  readonly currentLabel: string;
  readonly previousLabel: string;
  readonly currentValue: number | undefined;
  readonly previousValue: number | undefined;
  readonly valueFormatter: (value: number) => string;
  readonly loading?: boolean;
  readonly error?: string | null;
  readonly onRetry?: () => void;
}

const CHART_HEIGHT = 240;

/**
 * Reduced-scope period-over-period comparison chart — see 04_TASKS.md
 * P02-T002 (Sales Chart) / P02-T003 (Revenue Chart).
 *
 * The backend only exposes single-range aggregate summaries
 * (`SalesReportSummaryDto`, `ProfitReportSummaryDto` — see
 * `SalesReportController`/`ProfitReportController`), with no day-wise
 * bucketed endpoint (unlike Expenses' `groupBy=DAY/MONTH`, see
 * `ExpenseReportController`). A real trend line is therefore not backed by
 * any single existing call, and charting one point per day would require
 * many sequential summary calls — forbidden by 09_PERFORMANCE.md's "Avoid
 * Repeated Queries" / "No N+1 Queries" rules.
 *
 * This two-bar "current period vs previous period" comparison uses exactly
 * two existing summary calls per chart and was agreed as the reduced scope
 * until the backend exposes a day-wise report endpoint (technical debt —
 * see the Phase 02 Completion Report).
 */
export function PeriodComparisonChart({
  title,
  currentLabel,
  previousLabel,
  currentValue,
  previousValue,
  valueFormatter,
  loading = false,
  error = null,
  onRetry,
}: PeriodComparisonChartProps): JSX.Element {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          {title}
        </Typography>
        {loading ? (
          <Skeleton variant="rectangular" height={CHART_HEIGHT} />
        ) : error ? (
          <ErrorState message={error} onRetry={onRetry} />
        ) : (
          <BarChart
            height={CHART_HEIGHT}
            hideLegend
            xAxis={[{ scaleType: 'band', data: [previousLabel, currentLabel] }]}
            series={[
              {
                data: [previousValue ?? 0, currentValue ?? 0],
                color: '#1976d2',
                valueFormatter: (value) => (value === null ? '' : valueFormatter(value)),
              },
            ]}
          />
        )}
      </CardContent>
    </Card>
  );
}

/** Convenience layout for two comparison charts side by side on desktop. */
export function ComparisonChartsRow({
  children,
}: {
  readonly children: readonly [JSX.Element, JSX.Element];
}): JSX.Element {
  const [first, second] = children;
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
      <Stack flex={1} minWidth={0}>
        {first}
      </Stack>
      <Stack flex={1} minWidth={0}>
        {second}
      </Stack>
    </Stack>
  );
}
