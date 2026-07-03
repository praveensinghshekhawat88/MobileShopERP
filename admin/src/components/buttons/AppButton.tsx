import { Button, CircularProgress, type ButtonProps } from '@mui/material';
import type { JSX } from 'react';

export type AppButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning';

interface AppButtonProps extends Omit<ButtonProps, 'variant' | 'color'> {
  readonly appVariant?: AppButtonVariant;
  readonly loading?: boolean;
}

const VARIANT_MAP: Record<AppButtonVariant, Pick<ButtonProps, 'variant' | 'color'>> = {
  primary: { variant: 'contained', color: 'primary' },
  secondary: { variant: 'outlined', color: 'secondary' },
  danger: { variant: 'contained', color: 'error' },
  success: { variant: 'contained', color: 'success' },
  warning: { variant: 'contained', color: 'warning' },
};

/**
 * The one reusable button — see 01_AGENTS.md § Button Rules: Primary
 * (Contained), Secondary (Outlined), Danger/Success/Warning, Loading,
 * Disabled. "Every button must support loading." Never use a raw MUI
 * `Button` for these variants directly inside pages.
 */
export function AppButton({
  appVariant = 'primary',
  loading = false,
  disabled,
  children,
  startIcon,
  ...rest
}: AppButtonProps): JSX.Element {
  const { variant, color } = VARIANT_MAP[appVariant];

  return (
    <Button
      variant={variant}
      color={color}
      disabled={disabled ?? loading}
      startIcon={loading ? undefined : startIcon}
      {...rest}
    >
      {loading ? <CircularProgress size={20} color="inherit" aria-label="Loading" /> : children}
    </Button>
  );
}
