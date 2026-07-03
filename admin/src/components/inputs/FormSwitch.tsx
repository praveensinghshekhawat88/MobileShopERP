import { FormControlLabel, Switch } from '@mui/material';
import type { JSX } from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

interface FormSwitchProps<TFieldValues extends FieldValues> {
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
  readonly disabled?: boolean;
}

/**
 * Reusable switch input — see 01_AGENTS.md § Input Components ("Switch").
 * Typically used for boolean flags such as "Active" / "Inactive" status.
 */
export function FormSwitch<TFieldValues extends FieldValues>({
  name,
  label,
  disabled = false,
}: FormSwitchProps<TFieldValues>): JSX.Element {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControlLabel
          control={
            <Switch
              checked={Boolean(field.value)}
              onChange={(event) => field.onChange(event.target.checked)}
              onBlur={field.onBlur}
              disabled={disabled}
            />
          }
          label={label}
        />
      )}
    />
  );
}
