/**
 * Backend-locked stock status enum — see AGENTS.md § Stock Rule and
 * `StockStatus.java`. Used by the Inventory module (Stock list/detail and
 * the dedicated status transition endpoint).
 */
export const STOCK_STATUSES = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
  REPAIR: 'REPAIR',
  RETURNED: 'RETURNED',
  DAMAGED: 'DAMAGED',
  LOST: 'LOST',
} as const;

export type StockStatus = (typeof STOCK_STATUSES)[keyof typeof STOCK_STATUSES];

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  AVAILABLE: 'Available',
  RESERVED: 'Reserved',
  SOLD: 'Sold',
  REPAIR: 'In Repair',
  RETURNED: 'Returned',
  DAMAGED: 'Damaged',
  LOST: 'Lost',
};

/** Allowed transitions per `StockStatusService` — used by the status-change dialog. */
export const ALLOWED_STOCK_TRANSITIONS: Readonly<Record<StockStatus, readonly StockStatus[]>> = {
  AVAILABLE: [STOCK_STATUSES.RESERVED, STOCK_STATUSES.SOLD, STOCK_STATUSES.DAMAGED, STOCK_STATUSES.LOST],
  RESERVED: [STOCK_STATUSES.AVAILABLE, STOCK_STATUSES.SOLD],
  SOLD: [STOCK_STATUSES.RETURNED, STOCK_STATUSES.REPAIR],
  REPAIR: [STOCK_STATUSES.AVAILABLE, STOCK_STATUSES.DAMAGED],
  RETURNED: [STOCK_STATUSES.AVAILABLE, STOCK_STATUSES.DAMAGED],
  DAMAGED: [],
  LOST: [],
};
