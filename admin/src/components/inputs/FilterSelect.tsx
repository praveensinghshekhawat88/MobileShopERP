import { FormControl, MenuItem, Select, Typography, type SelectChangeEvent } from '@mui/material';
import type { JSX } from 'react';

export interface FilterSelectOption {
  readonly value: string;
  readonly label: string;
}

interface FilterSelectProps {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly emptyLabel: string;
  readonly emptyValue?: string;
  readonly options: readonly FilterSelectOption[];
  readonly onChange: (value: string) => void;
  readonly minWidth?: number;
  readonly disabled?: boolean;
}

function resolveDisplayLabel(
  value: string,
  emptyValue: string,
  emptyLabel: string,
  options: readonly FilterSelectOption[]
): string {
  if (value === emptyValue || value === '') {
    return emptyLabel;
  }
  return options.find((option) => option.value === value)?.label ?? value;
}

/**
 * List-page filter dropdown with an "all" option.
 * Uses a static caption label (not MUI floating InputLabel) to avoid overlap
 * when `displayEmpty` renders "All …" while the outlined field value is empty.
 */
export function FilterSelect({
  id,
  label,
  value,
  emptyLabel,
  emptyValue = '',
  options,
  onChange,
  minWidth = 220,
  disabled = false,
}: FilterSelectProps): JSX.Element {
  const labelId = `${id}-label`;

  const handleChange = (event: SelectChangeEvent<string>): void => {
    onChange(event.target.value);
  };

  return (
    <FormControl size="small" sx={{ minWidth }} disabled={disabled}>
      <Typography
        component="label"
        htmlFor={id}
        id={labelId}
        variant="caption"
        color="text.secondary"
        fontWeight={600}
        sx={{ display: 'block', mb: 0.5, lineHeight: 1.4 }}
      >
        {label}
      </Typography>
      <Select
        id={id}
        labelId={labelId}
        value={value}
        displayEmpty
        onChange={handleChange}
        renderValue={(selected) =>
          resolveDisplayLabel(String(selected), emptyValue, emptyLabel, options)
        }
      >
        <MenuItem value={emptyValue}>{emptyLabel}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
