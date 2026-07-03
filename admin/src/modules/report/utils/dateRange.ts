import dayjs from 'dayjs';

export const REPORT_API_DATE_FORMAT = 'YYYY-MM-DD';

/** Default report window: month-to-date through today. */
export function getDefaultReportDateRange(): { readonly fromDate: string; readonly toDate: string } {
  const today = dayjs();
  return {
    fromDate: today.startOf('month').format(REPORT_API_DATE_FORMAT),
    toDate: today.format(REPORT_API_DATE_FORMAT),
  };
}
