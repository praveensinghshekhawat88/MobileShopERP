/**
 * Backend-locked enum — see `common/enums/PriceType.java` and AGENTS.md §
 * Product Price Rule ("Never overwrite prices. Always create new record.").
 * Placed in `common/` (not `modules/product`) because Sales/Purchases will
 * also read price history once those modules exist.
 */
export const PRICE_TYPES = {
  MRP: 'MRP',
  RETAIL: 'RETAIL',
  WHOLESALE: 'WHOLESALE',
  DEALER: 'DEALER',
  OFFER: 'OFFER',
} as const;

export type PriceType = (typeof PRICE_TYPES)[keyof typeof PRICE_TYPES];

export const PRICE_TYPE_LABELS: Record<PriceType, string> = {
  MRP: 'MRP',
  RETAIL: 'Retail',
  WHOLESALE: 'Wholesale',
  DEALER: 'Dealer',
  OFFER: 'Offer',
};
