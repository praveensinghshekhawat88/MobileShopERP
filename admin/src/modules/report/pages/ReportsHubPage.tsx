import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import { Card, CardActionArea, CardContent, Stack, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2';
import type { JSX } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ROUTE_PATHS } from '@/routes/routePaths';

const REPORT_LINKS = [
  { label: 'Sales Report', path: ROUTE_PATHS.reportsSales, icon: ShoppingCartOutlinedIcon, description: 'Sales summary, line items, and totals by customer.' },
  { label: 'Purchase Report', path: ROUTE_PATHS.reportsPurchases, icon: ReceiptLongOutlinedIcon, description: 'Purchase summary, line items, and totals by supplier.' },
  { label: 'Inventory Report', path: ROUTE_PATHS.reportsInventory, icon: Inventory2OutlinedIcon, description: 'Stock snapshot, low stock, movements, and IMEI lookup.' },
  { label: 'Customer Report', path: ROUTE_PATHS.reportsCustomers, icon: PeopleOutlinedIcon, description: 'Top customers and purchase history drill-down.' },
  { label: 'Supplier Report', path: ROUTE_PATHS.reportsSuppliers, icon: LocalShippingOutlinedIcon, description: 'Supplier spend summary and purchase drill-down.' },
  { label: 'Repair Report', path: ROUTE_PATHS.reportsRepairs, icon: BuildOutlinedIcon, description: 'Open repair breakdown and repair ticket list.' },
  { label: 'Warranty Report', path: ROUTE_PATHS.reportsWarranty, icon: VerifiedUserOutlinedIcon, description: 'Active, expired, and expiring warranties.' },
  { label: 'Expense Report', path: ROUTE_PATHS.reportsExpenses, icon: MonetizationOnOutlinedIcon, description: 'Expense buckets and detail list.' },
  { label: 'Profit & Loss', path: ROUTE_PATHS.reportsProfit, icon: TrendingUpOutlinedIcon, description: 'Revenue, COGS, expenses, gross and net profit.' },
] as const;

/** Reports hub — see 04_TASKS.md Phase 09. Screen-only; no export endpoints. */
export function ReportsHubPage(): JSX.Element {
  return (
    <Stack spacing={3}>
      <Breadcrumbs items={[{ label: 'Dashboard', to: ROUTE_PATHS.dashboard }, { label: 'Reports' }]} />

      <Stack direction="row" spacing={1} alignItems="center">
        <AssessmentOutlinedIcon color="primary" />
        <Typography variant="h5" fontWeight={700}>
          Reports
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary">
        On-screen reports only. PDF, Excel, and CSV export are not available until backend export endpoints are added.
      </Typography>

      <Grid container spacing={2}>
        {REPORT_LINKS.map((report) => (
          <Grid key={report.path} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardActionArea component={RouterLink} to={report.path} sx={{ height: '100%' }}>
                <CardContent>
                  <Stack spacing={1.5}>
                    <report.icon color="primary" />
                    <Typography variant="subtitle1" fontWeight={600}>
                      {report.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {report.description}
                    </Typography>
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
