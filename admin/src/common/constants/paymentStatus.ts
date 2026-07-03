/**
 * Backend-locked payment status enum — see 01_AGENTS.md § Payment Engine
 * ("Payment Modes (Locked Enum)") and the `payment_status` column shared by
 * `sales` and `purchases`. Placed in `common/` (not a single module) because
 * it is used across Sales, Purchases, Payments, and the Dashboard reports.
 */
export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED',
} as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES];
