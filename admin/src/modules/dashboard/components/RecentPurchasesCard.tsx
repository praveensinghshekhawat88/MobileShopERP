import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
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
import { useRecentPurchases } from '@/modules/dashboard/hooks/useRecentPurchases';
import { getApiErrorMessage } from '@/utils/apiError';
import { formatCurrency } from '@/utils/formatCurrency';
import { formatDate } from '@/utils/formatDate';

const RECENT_PURCHASES_LIMIT = 5;

/** See 04_TASKS.md P02-T005 (Recent Purchases). */
export function RecentPurchasesCard(): JSX.Element {
  const { data, isLoading, isError, error, refetch } = useRecentPurchases(RECENT_PURCHASES_LIMIT);
  const purchases = data?.content ?? [];

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Recent Purchases
        </Typography>
        {isLoading ? <SectionLoader label="Loading recent purchases…" minHeight={160} /> : null}
        {!isLoading && isError ? (
          <ErrorState message={getApiErrorMessage(error)} onRetry={() => void refetch()} />
        ) : null}
        {!isLoading && !isError && purchases.length === 0 ? (
          <EmptyState
            title="No purchases yet"
            description="Purchases made in the last 90 days will appear here."
          />
        ) : null}
        {!isLoading && !isError && purchases.length > 0 ? (
          <List disablePadding>
            {purchases.map((purchase) => (
              <ListItem key={purchase.id} disableGutters divider>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'secondary.light' }}>
                    <LocalShippingOutlinedIcon fontSize="small" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={purchase.supplierName}
                  secondary={`${purchase.invoiceNumber} • ${formatDate(purchase.invoiceDate)}`}
                />
                <Stack alignItems="flex-end" spacing={0.5}>
                  <Typography variant="body2" fontWeight={600}>
                    {formatCurrency(purchase.totalAmount)}
                  </Typography>
                  <PaymentStatusChip status={purchase.paymentStatus} />
                </Stack>
              </ListItem>
            ))}
          </List>
        ) : null}
      </CardContent>
    </Card>
  );
}
