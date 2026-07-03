import { Chip, type ChipProps } from '@mui/material';
import type { JSX } from 'react';

import { CLAIM_STATUS_LABELS, type ClaimStatus } from '@/common/constants/claimStatus';

const STATUS_COLOR: Record<ClaimStatus, ChipProps['color']> = {
  ACTIVE: 'success',
  CLAIMED: 'warning',
  APPROVED: 'info',
  REJECTED: 'error',
  CLOSED: 'default',
};

interface ClaimStatusChipProps {
  readonly status: ClaimStatus;
}

/** Shared status chip for the locked `ClaimStatus` enum. */
export function ClaimStatusChip({ status }: ClaimStatusChipProps): JSX.Element {
  return (
    <Chip label={CLAIM_STATUS_LABELS[status]} color={STATUS_COLOR[status]} size="small" variant="outlined" />
  );
}
