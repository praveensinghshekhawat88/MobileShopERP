import { TextField, type TextFieldProps } from '@mui/material';
import type { JSX } from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

interface FormTextFieldProps<TFieldValues extends FieldValues> extends Omit<
  TextFieldProps,
  'name' | 'value' | 'onChange' | 'error'
> {
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
}

/**
 * Reusable text input bound to React Hook Form — see 01_AGENTS.md § Input
 * Components: "Never use raw Material UI TextField directly inside pages.
 * Always wrap it." Displays the field's Zod/RHF validation error inline
 * below the field (see 05_UI_STANDARDS.md § Forms).
 */
export function FormTextField<TFieldValues extends FieldValues>({
  name,
  label,
  ...rest
}: FormTextFieldProps<TFieldValues>): JSX.Element {
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
          fullWidth
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? rest.helperText}
        />
      )}
    />
  );
}
