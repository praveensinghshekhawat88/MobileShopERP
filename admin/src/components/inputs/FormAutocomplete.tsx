import { Autocomplete, TextField } from '@mui/material';
import type { JSX } from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

export interface FormAutocompleteOption {
  readonly value: string;
  readonly label: string;
}

interface FormAutocompleteProps<TFieldValues extends FieldValues> {
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
  readonly options: readonly FormAutocompleteOption[];
  readonly loading?: boolean;
  readonly disabled?: boolean;
}

/**
 * Reusable autocomplete/combobox input — see 01_AGENTS.md § Input Components
 * ("Autocomplete"). Intended for large master-data pickers (brand, category,
 * customer, supplier) once those modules exist.
 */
export function FormAutocomplete<TFieldValues extends FieldValues>({
  name,
  label,
  options,
  loading = false,
  disabled = false,
}: FormAutocompleteProps<TFieldValues>): JSX.Element {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Autocomplete
          options={options}
          loading={loading}
          disabled={disabled}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          value={options.find((option) => option.value === field.value) ?? null}
          onChange={(_event, selected) => field.onChange(selected?.value ?? null)}
          onBlur={field.onBlur}
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              error={Boolean(fieldState.error)}
              helperText={fieldState.error?.message}
            />
          )}
        />
      )}
    />
  );
}
