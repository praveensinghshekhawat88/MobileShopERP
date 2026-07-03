import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import type { JSX } from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

export interface FormSelectOption {
  readonly value: string;
  readonly label: string;
}

interface FormSelectProps<TFieldValues extends FieldValues> {
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
  readonly options: readonly FormSelectOption[];
  readonly fullWidth?: boolean;
  readonly disabled?: boolean;
}

/**
 * Reusable select input — see 01_AGENTS.md § Input Components ("Select").
 */
export function FormSelect<TFieldValues extends FieldValues>({
  name,
  label,
  options,
  fullWidth = true,
  disabled = false,
}: FormSelectProps<TFieldValues>): JSX.Element {
  const { control } = useFormContext<TFieldValues>();
  const labelId = `${name}-label`;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl fullWidth={fullWidth} error={Boolean(fieldState.error)} disabled={disabled}>
          <InputLabel id={labelId}>{label}</InputLabel>
          <Select {...field} labelId={labelId} label={label} value={field.value ?? ''}>
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {fieldState.error ? <FormHelperText>{fieldState.error.message}</FormHelperText> : null}
        </FormControl>
      )}
    />
  );
}
