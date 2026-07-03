import { Checkbox, FormControlLabel, FormHelperText, Stack } from '@mui/material';
import type { JSX } from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

interface FormCheckboxProps<TFieldValues extends FieldValues> {
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
  readonly disabled?: boolean;
}

/**
 * Reusable checkbox input — see 01_AGENTS.md § Input Components ("Checkbox").
 */
export function FormCheckbox<TFieldValues extends FieldValues>({
  name,
  label,
  disabled = false,
}: FormCheckboxProps<TFieldValues>): JSX.Element {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Stack>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(field.value)}
                onChange={(event) => field.onChange(event.target.checked)}
                onBlur={field.onBlur}
                disabled={disabled}
              />
            }
            label={label}
          />
          {fieldState.error ? (
            <FormHelperText error>{fieldState.error.message}</FormHelperText>
          ) : null}
        </Stack>
      )}
    />
  );
}
