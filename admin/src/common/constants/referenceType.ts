/**
 * Backend-locked payment reference type enum — see AGENTS.md § Payment Engine
 * and `ReferenceType.java`. Used by stock movements and the stock status
 * update endpoint.
 */
export const REFERENCE_TYPES = {
  SALE: 'SALE',
  PURCHASE: 'PURCHASE',
  REPAIR: 'REPAIR',
  EXPENSE: 'EXPENSE',
} as const;

export type ReferenceType = (typeof REFERENCE_TYPES)[keyof typeof REFERENCE_TYPES];

export const REFERENCE_TYPE_LABELS: Record<ReferenceType, string> = {
  SALE: 'Sale',
  PURCHASE: 'Purchase',
  REPAIR: 'Repair',
  EXPENSE: 'Expense',
};
