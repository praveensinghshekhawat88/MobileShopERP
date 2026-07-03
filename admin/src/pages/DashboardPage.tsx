import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import PointOfSaleOutlinedIcon from '@mui/icons-material/PointOfSaleOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import { Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import dayjs from 'dayjs';
import { lazy, Suspense, type JSX } from 'react';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import {
  LOW_STOCK_LIMIT,
  LowStockCard,
  QuickActions,
  RecentPurchasesCard,
  RecentSalesCard,
  StatCard,
  useLowStock,
  useProfitSummary,
  usePurchaseSummary,
  useSalesSummary,
} from '@/modules/dashboard';
import { useAppSelector } from '@/store/hooks';
import { formatCurrency, formatNumber } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

const DashboardCharts = lazy(() =>
  import('@/modules/dashboard/components/DashboardCharts').then((module) => ({
    default: module.DashboardCharts,
  }))
);

const API_DATE_FORMAT = 'YYYY-MM-DD';
const CHART_SKELETON_HEIGHT = 240;

function ChartsFallback(): JSX.Element {
  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
      <Card variant="outlined" sx={{ flex: 1 }}>
        <CardContent>
          <Skeleton variant="rectangular" height={CHART_SKELETON_HEIGHT} />
        </CardContent>
      </Card>
      <Card variant="outlined" sx={{ flex: 1 }}>
        <CardContent>
          <Skeleton variant="rectangular" height={CHART_SKELETON_HEIGHT} />
        </CardContent>
      </Card>
    </Stack>
  );
}

/**
 * Dashboard — see 04_TASKS.md Phase 02 (P02-T001..T007). Every widget below
 * is a composed `modules/dashboard` component/hook; this page only owns
 * layout and the date ranges each stat card is evaluated against (the
 * chart date ranges live in the lazily-loaded `DashboardCharts`).
 */
export function DashboardPage(): JSX.Element {
  const user = useAppSelector((state) => state.auth.user);
  const today = dayjs();

  const todayRange = {
    fromDate: today.format(API_DATE_FORMAT),
    toDate: today.format(API_DATE_FORMAT),
  };
  const monthToDateRange = {
    fromDate: today.startOf('month').format(API_DATE_FORMAT),
    toDate: today.format(API_DATE_FORMAT),
  };

  const todaySales = useSalesSummary(todayRange);
  const todayPurchases = usePurchaseSummary(todayRange);
  const monthProfit = useProfitSummary(monthToDateRange);
  const lowStock = useLowStock(LOW_STOCK_LIMIT);

  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      <Stack spacing={0.5}>
        <Typography variant="h5" fontWeight={700}>
          Welcome{user ? `, ${user.firstName}` : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Overview for {formatDate(today.toISOString())}
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Sales Today"
            value={formatCurrency(todaySales.data?.totalAmount)}
            icon={PointOfSaleOutlinedIcon}
            iconColor="primary"
            loading={todaySales.isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Purchases Today"
            value={formatCurrency(todayPurchases.data?.totalAmount)}
            icon={LocalShippingOutlinedIcon}
            iconColor="info"
            loading={todayPurchases.isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Net Profit (This Month)"
            value={formatCurrency(monthProfit.data?.netProfit)}
            icon={TrendingUpOutlinedIcon}
            iconColor="success"
            loading={monthProfit.isLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            label="Low Stock Items"
            value={formatNumber(lowStock.data?.totalElements)}
            icon={Inventory2OutlinedIcon}
            iconColor="warning"
            loading={lowStock.isLoading}
          />
        </Grid>
      </Grid>

      <Suspense fallback={<ChartsFallback />}>
        <DashboardCharts />
      </Suspense>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentSalesCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <RecentPurchasesCard />
        </Grid>
      </Grid>

      <LowStockCard />

      <QuickActions />
    </Stack>
  );
}
