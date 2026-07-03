import dayjs from 'dayjs';

import { DATE_DISPLAY_FORMAT, DATE_TIME_DISPLAY_FORMAT } from '@/common/constants/format';

/**
 * Formats an ISO-8601 instant/date string using the locked display format
 * (see 05_UI_STANDARDS.md § Date Format). Returns an em dash for empty input.
 */
export function formatDate(value: string | Date | null | undefined): string {
  if (!value) {
    return '—';
  }
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format(DATE_DISPLAY_FORMAT) : '—';
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) {
    return '—';
  }
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format(DATE_TIME_DISPLAY_FORMAT) : '—';
}
