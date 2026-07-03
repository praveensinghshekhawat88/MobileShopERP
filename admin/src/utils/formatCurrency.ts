import { CURRENCY_CODE, CURRENCY_LOCALE, NUMBER_LOCALE } from '@/common/constants/format';

/**
 * Formats a numeric amount as Indian Rupees using the locked locale
 * (see 05_UI_STANDARDS.md § Date Format / Currency: Indian Rupee ₹, Indian Locale).
 */
export function formatCurrency(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return '—';
  }
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: 'currency',
    currency: CURRENCY_CODE,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—';
  }
  return new Intl.NumberFormat(NUMBER_LOCALE).format(value);
}
