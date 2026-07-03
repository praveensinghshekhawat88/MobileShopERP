import {
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { JSX } from 'react';

import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { SectionLoader } from '@/components/loading/SectionLoader';
import { useLowStock } from '@/modules/dashboard/hooks/useLowStock';
import { getApiErrorMessage } from '@/utils/apiError';

/** Exported so `DashboardPage`'s stat card can share this query's cache entry. */
export const LOW_STOCK_LIMIT = 10;

/**
 * See 04_TASKS.md P02-T006 (Low Stock). A compact, non-paginated preview —
 * the full paginated inventory report is out of scope for this dashboard
 * widget (see 05_UI_STANDARDS.md § Dashboard: "No CRUD actions").
 */
export function LowStockCard(): JSX.Element {
  const { data, isLoading, isError, error, refetch } = useLowStock(LOW_STOCK_LIMIT);
  const items = data?.content ?? [];

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Low Stock
        </Typography>
        {isLoading ? <SectionLoader label="Loading low stock…" minHeight={160} /> : null}
        {!isLoading && isError ? (
          <ErrorState message={getApiErrorMessage(error)} onRetry={() => void refetch()} />
        ) : null}
        {!isLoading && !isError && items.length === 0 ? (
          <EmptyState
            title="Stock levels are healthy"
            description="No variants are at or below their low-stock threshold."
          />
        ) : null}
        {!isLoading && !isError && items.length > 0 ? (
          <TableContainer>
            <Table size="small" aria-label="Low stock variants">
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell align="right">Available</TableCell>
                  <TableCell align="right">Threshold</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.variantId} hover>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.variantSku}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={item.availableCount}
                        size="small"
                        color={item.availableCount === 0 ? 'error' : 'warning'}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">{item.threshold}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </CardContent>
    </Card>
  );
}
