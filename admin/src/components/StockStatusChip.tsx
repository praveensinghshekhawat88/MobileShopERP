import { Chip, type ChipProps } from '@mui/material';
import type { JSX } from 'react';

import { STOCK_STATUS_LABELS, type StockStatus } from '@/common/constants/stockStatus';

const STATUS_COLOR: Record<StockStatus, ChipProps['color']> = {
  AVAILABLE: 'success',
  RESERVED: 'info',
  SOLD: 'default',
  REPAIR: 'warning',
  RETURNED: 'secondary',
  DAMAGED: 'error',
  LOST: 'error',
};

interface StockStatusChipProps {
  readonly status: StockStatus;
}

/** Shared status chip for the locked `StockStatus` enum — see AGENTS.md § Stock Rule. */
export function StockStatusChip({ status }: StockStatusChipProps): JSX.Element {
  return (
    <Chip label={STOCK_STATUS_LABELS[status]} color={STATUS_COLOR[status]} size="small" variant="outlined" />
  );
}
