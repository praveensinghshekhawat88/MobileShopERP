/**
 * Backend-locked payment mode enum — see AGENTS.md § Payment Engine and
 * `PaymentMode.java`. Used by the Sales module payment recording flow.
 */
export const PAYMENT_MODES = {
  CASH: 'CASH',
  UPI: 'UPI',
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  FINANCE: 'FINANCE',
  EMI: 'EMI',
} as const;

export type PaymentMode = (typeof PAYMENT_MODES)[keyof typeof PAYMENT_MODES];

export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  CASH: 'Cash',
  UPI: 'UPI',
  CARD: 'Card',
  BANK_TRANSFER: 'Bank Transfer',
  FINANCE: 'Finance',
  EMI: 'EMI',
};
