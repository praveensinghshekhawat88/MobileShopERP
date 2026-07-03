import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import type { JSX } from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

export interface FormRadioOption {
  readonly value: string;
  readonly label: string;
}

interface FormRadioGroupProps<TFieldValues extends FieldValues> {
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
  readonly options: readonly FormRadioOption[];
  readonly row?: boolean;
}

/**
 * Reusable radio group input — see 01_AGENTS.md § Input Components ("Radio").
 */
export function FormRadioGroup<TFieldValues extends FieldValues>({
  name,
  label,
  options,
  row = true,
}: FormRadioGroupProps<TFieldValues>): JSX.Element {
  const { control } = useFormContext<TFieldValues>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormControl error={Boolean(fieldState.error)}>
          <FormLabel>{label}</FormLabel>
          <RadioGroup {...field} row={row}>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
          {fieldState.error ? <FormHelperText>{fieldState.error.message}</FormHelperText> : null}
        </FormControl>
      )}
    />
  );
}
