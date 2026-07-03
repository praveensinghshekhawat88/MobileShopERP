import { Chip, type ChipProps } from '@mui/material';
import type { JSX } from 'react';

import { type PaymentStatus } from '@/common/constants/paymentStatus';

const STATUS_COLOR: Record<PaymentStatus, ChipProps['color']> = {
  PENDING: 'warning',
  PARTIAL: 'info',
  PAID: 'success',
  REFUNDED: 'default',
  CANCELLED: 'error',
};

interface PaymentStatusChipProps {
  readonly status: PaymentStatus;
}

/**
 * Shared status chip for the locked `PaymentStatus` enum — see
 * 01_AGENTS.md § Payment Engine. Used wherever a sale/purchase/payment row
 * is displayed (Dashboard recent lists now; Sales/Purchases/Payments module
 * screens in later phases), so the color mapping is defined exactly once.
 */
export function PaymentStatusChip({ status }: PaymentStatusChipProps): JSX.Element {
  return <Chip label={status} color={STATUS_COLOR[status]} size="small" variant="outlined" />;
}
