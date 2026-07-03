import { Chip, type ChipProps } from '@mui/material';
import type { JSX } from 'react';

import { REPAIR_STATUS_LABELS, type RepairStatus } from '@/common/constants/repairStatus';

const STATUS_COLOR: Record<RepairStatus, ChipProps['color']> = {
  RECEIVED: 'info',
  CHECKING: 'info',
  WAITING_PARTS: 'warning',
  REPAIRING: 'warning',
  READY: 'success',
  DELIVERED: 'default',
  CANCELLED: 'error',
};

interface RepairStatusChipProps {
  readonly status: RepairStatus;
}

/** Shared status chip for the locked `RepairStatus` enum. */
export function RepairStatusChip({ status }: RepairStatusChipProps): JSX.Element {
  return (
    <Chip
      label={REPAIR_STATUS_LABELS[status]}
      color={STATUS_COLOR[status]}
      size="small"
      variant="outlined"
    />
  );
}
