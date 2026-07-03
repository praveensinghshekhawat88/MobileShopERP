import { TextField, type TextFieldProps } from '@mui/material';
import type { JSX } from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

interface FormTextareaProps<TFieldValues extends FieldValues> extends Omit<
  TextFieldProps,
  'name' | 'value' | 'onChange' | 'error' | 'multiline'
> {
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
  readonly rows?: number;
}

/**
 * Reusable multiline text input — see 01_AGENTS.md § Input Components
 * ("Textarea").
 */
export function FormTextarea<TFieldValues extends FieldValues>({
  name,
  label,
  rows = 4,
  ...rest
}: FormTextareaProps<TFieldValues>): JSX.Element {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...rest}
          label={label}
          multiline
          rows={rows}
          fullWidth
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? rest.helperText}
        />
      )}
    />
  );
}
