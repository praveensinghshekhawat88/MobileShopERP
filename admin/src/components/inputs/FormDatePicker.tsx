import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { type Dayjs } from 'dayjs';
import type { JSX } from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

interface FormDatePickerProps<TFieldValues extends FieldValues> {
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
  readonly disabled?: boolean;
}

/**
 * Reusable date input — see 01_AGENTS.md § Input Components ("Date",
 * "DateTime"). Stores the field value as an ISO-8601 date string; display
 * formatting elsewhere uses `utils/formatDate.ts` (see 05_UI_STANDARDS.md
 * § Date Format). Requires `LocalizationProvider` (dayjs adapter) at the app
 * root — see `app/AppProviders.tsx`.
 */
export function FormDatePicker<TFieldValues extends FieldValues>({
  name,
  label,
  disabled = false,
}: FormDatePickerProps<TFieldValues>): JSX.Element {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <DatePicker
          label={label}
          disabled={disabled}
          value={field.value ? dayjs(field.value as string) : null}
          onChange={(value: Dayjs | null) => {
            field.onChange(value?.isValid() ? value.format('YYYY-MM-DD') : null);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              onBlur: field.onBlur,
              error: Boolean(fieldState.error),
              helperText: fieldState.error?.message,
            },
          }}
        />
      )}
    />
  );
}
