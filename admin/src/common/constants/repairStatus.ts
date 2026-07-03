/**
 * Backend-locked repair status enum — see `RepairStatus.java` and
 * `RepairService#updateStatus`. Used by the Repair module list/detail and
 * the dedicated status transition dialog.
 */
export const REPAIR_STATUSES = {
  RECEIVED: 'RECEIVED',
  CHECKING: 'CHECKING',
  WAITING_PARTS: 'WAITING_PARTS',
  REPAIRING: 'REPAIRING',
  READY: 'READY',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type RepairStatus = (typeof REPAIR_STATUSES)[keyof typeof REPAIR_STATUSES];

export const REPAIR_STATUS_LABELS: Record<RepairStatus, string> = {
  RECEIVED: 'Received',
  CHECKING: 'Checking',
  WAITING_PARTS: 'Waiting for Parts',
  REPAIRING: 'Repairing',
  READY: 'Ready',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

/** Terminal statuses — no detail edits or further status changes in the UI. */
export const TERMINAL_REPAIR_STATUSES: readonly RepairStatus[] = [
  REPAIR_STATUSES.DELIVERED,
  REPAIR_STATUSES.CANCELLED,
];

/** Allowed transitions per `RepairService` — used by the status-change dialog. */
export const ALLOWED_REPAIR_TRANSITIONS: Readonly<Record<RepairStatus, readonly RepairStatus[]>> = {
  RECEIVED: [REPAIR_STATUSES.CHECKING, REPAIR_STATUSES.CANCELLED],
  CHECKING: [REPAIR_STATUSES.WAITING_PARTS, REPAIR_STATUSES.REPAIRING, REPAIR_STATUSES.CANCELLED],
  WAITING_PARTS: [REPAIR_STATUSES.REPAIRING, REPAIR_STATUSES.CANCELLED],
  REPAIRING: [REPAIR_STATUSES.READY, REPAIR_STATUSES.WAITING_PARTS, REPAIR_STATUSES.CANCELLED],
  READY: [REPAIR_STATUSES.DELIVERED, REPAIR_STATUSES.REPAIRING],
  DELIVERED: [],
  CANCELLED: [],
};
