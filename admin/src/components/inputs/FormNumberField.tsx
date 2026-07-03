import { TextField, type TextFieldProps } from '@mui/material';
import type { JSX } from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

interface FormNumberFieldProps<TFieldValues extends FieldValues> extends Omit<
  TextFieldProps,
  'name' | 'value' | 'onChange' | 'error' | 'type'
> {
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
}

/**
 * Reusable numeric input — see 01_AGENTS.md § Input Components ("Number",
 * "Currency"). A currency-formatted variant can wrap this component with
 * `formatCurrency`/Intl display logic once a module first needs it.
 */
export function FormNumberField<TFieldValues extends FieldValues>({
  name,
  label,
  ...rest
}: FormNumberFieldProps<TFieldValues>): JSX.Element {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...rest}
          value={field.value ?? ''}
          onChange={(event) => {
            const rawValue = event.target.value;
            field.onChange(rawValue === '' ? null : Number(rawValue));
          }}
          label={label}
          type="number"
          fullWidth
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? rest.helperText}
        />
      )}
    />
  );
}
