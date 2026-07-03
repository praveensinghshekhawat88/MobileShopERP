import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { IconButton, InputAdornment, TextField, type TextFieldProps } from '@mui/material';
import { useState, type JSX } from 'react';
import { Controller, useFormContext, type FieldPath, type FieldValues } from 'react-hook-form';

interface FormPasswordFieldProps<TFieldValues extends FieldValues> extends Omit<
  TextFieldProps,
  'name' | 'value' | 'onChange' | 'error' | 'type'
> {
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
}

/**
 * Reusable password input with a show/hide toggle — see 01_AGENTS.md
 * § Input Components ("Password") and 08_SECURITY.md § Login: "Clear
 * password after submission" is the caller's responsibility via
 * `methods.reset()` after a successful submit.
 */
export function FormPasswordField<TFieldValues extends FieldValues>({
  name,
  label,
  ...rest
}: FormPasswordFieldProps<TFieldValues>): JSX.Element {
  const { control } = useFormContext<TFieldValues>();
  const [visible, setVisible] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          {...rest}
          label={label}
          type={visible ? 'text' : 'password'}
          fullWidth
          autoComplete="current-password"
          error={Boolean(fieldState.error)}
          helperText={fieldState.error?.message ?? rest.helperText}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={visible ? 'Hide password' : 'Show password'}
                    onClick={() => setVisible((current) => !current)}
                    edge="end"
                    tabIndex={-1}
                  >
                    {visible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  );
}
