/**
 * Backend-locked warranty claim status enum — see `ClaimStatus.java`.
 * Expiry is a separate computed `expired` boolean on `WarrantyResponse`.
 */
export const CLAIM_STATUSES = {
  ACTIVE: 'ACTIVE',
  CLAIMED: 'CLAIMED',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CLOSED: 'CLOSED',
} as const;

export type ClaimStatus = (typeof CLAIM_STATUSES)[keyof typeof CLAIM_STATUSES];

export const CLAIM_STATUS_LABELS: Record<ClaimStatus, string> = {
  ACTIVE: 'Active',
  CLAIMED: 'Claimed',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CLOSED: 'Closed',
};
