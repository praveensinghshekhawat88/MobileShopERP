import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import {
  Avatar,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import type { JSX } from 'react';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { SectionLoader } from '@/components/loading/SectionLoader';
import { PaymentStatusChip } from '@/components/PaymentStatusChip';
import { useRecentSales } from '@/modules/dashboard/hooks/useRecentSales';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

const RECENT_SALES_LIMIT = 5;

/** See 04_TASKS.md P02-T004 (Recent Sales). */
export function RecentSalesCard(): JSX.Element {
  const { data, isLoading, isError, error, refetch } = useRecentSales(RECENT_SALES_LIMIT);
  const sales = data?.content ?? [];

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Recent Sales
        </Typography>
        {isLoading ? <SectionLoader label="Loading recent sales…" minHeight={160} /> : null}
        {!isLoading && isError ? (
          <ErrorState message={getApiErrorMessage(error)} onRetry={() => void refetch()} />
        ) : null}
        {!isLoading && !isError && sales.length === 0 ? (
          <EmptyState
            title="No sales yet"
            description="Sales made in the last 90 days will appear here."
          />
        ) : null}
        {!isLoading && !isError && sales.length > 0 ? (
          <List disablePadding>
            {sales.map((sale) => (
              <ListItem key={sale.id} disableGutters divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.light' }}>
                    <ReceiptLongOutlinedIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={sale.customerName}
                  secondary={`${sale.invoiceNumber} • ${formatDate(sale.invoiceDate)}`}
                />
                <Stack alignItems="flex-end" spacing={0.5}>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(sale.totalAmount)}
                  </Typography>
                  <PaymentStatusChip status={sale.paymentStatus} />
                </Stack>
              </ListItem>
            ))}
          </List>
        ) : null}
      </CardContent>
    </Card>
  );
}
