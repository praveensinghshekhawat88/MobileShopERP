import { Stack, TextField } from '@mui/material';
import type { JSX } from 'react';

interface ReportDateRangeFilterProps {
  readonly fromDate: string;
  readonly toDate: string;
  readonly onFromDateChange: (value: string) => void;
  readonly onToDateChange: (value: string) => void;
}

/** Shared from/to date filter for report pages — both dates required for ranged reports. */
export function ReportDateRangeFilter({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
}: ReportDateRangeFilterProps): JSX.Element {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
      <TextField
        size="small"
        label="From Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={fromDate}
        onChange={(event) => onFromDateChange(event.target.value)}
      />
      <TextField
        size="small"
        label="To Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={toDate}
        onChange={(event) => onToDateChange(event.target.value)}
      />
    </Stack>
  );
}
