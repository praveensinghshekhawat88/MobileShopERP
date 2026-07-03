/**
 * Backend-locked stock movement type enum — see AGENTS.md § Stock Movement Rule
 * and `MovementType.java`.
 */
export const MOVEMENT_TYPES = {
  PURCHASE: 'PURCHASE',
  SALE: 'SALE',
  RETURN: 'RETURN',
  REPAIR: 'REPAIR',
  ADJUSTMENT: 'ADJUSTMENT',
} as const;

export type MovementType = (typeof MOVEMENT_TYPES)[keyof typeof MOVEMENT_TYPES];

export const MOVEMENT_TYPE_LABELS: Record<MovementType, string> = {
  PURCHASE: 'Purchase',
  SALE: 'Sale',
  RETURN: 'Return',
  REPAIR: 'Repair',
  ADJUSTMENT: 'Adjustment',
};
