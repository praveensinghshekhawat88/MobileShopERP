import type { PaletteOptions } from '@mui/material/styles';

/**
 * Locked color palette — see 05_UI_STANDARDS.md § Color Palette.
 * Never hardcode these hex values anywhere else; always read from
 * `theme.palette`.
 */
export const palette: PaletteOptions = {
  mode: 'light',
  primary: {
    main: '#2563EB',
    light: '#60A5FA',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#64748B',
    light: '#94A3B8',
    dark: '#475569',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#16A34A',
    light: '#4ADE80',
    dark: '#15803D',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F97316',
    light: '#FB923C',
    dark: '#C2410C',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#DC2626',
    light: '#F87171',
    dark: '#B91C1C',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#0EA5E9',
    light: '#38BDF8',
    dark: '#0284C7',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F8FAFC',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#1E293B',
    secondary: '#64748B',
  },
  divider: '#E2E8F0',
};
