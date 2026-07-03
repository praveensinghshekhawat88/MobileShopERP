import type { TypographyOptions } from '@mui/material/styles/createTypography';

/**
 * Locked typography — see 05_UI_STANDARDS.md § Typography.
 * Font Family: Inter (self-hosted via @fontsource/inter — see main.tsx),
 * fallback Roboto/system fonts. Never use custom fonts elsewhere.
 */
const FONT_FAMILY = ['Inter', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(',');

export const typography: TypographyOptions = {
  fontFamily: FONT_FAMILY,
  h1: { fontWeight: 700, fontSize: '2.5rem' },
  h2: { fontWeight: 700, fontSize: '2rem' },
  h3: { fontWeight: 700, fontSize: '1.75rem' },
  h4: { fontWeight: 700, fontSize: '1.5rem' },
  h5: { fontWeight: 700, fontSize: '1.25rem' },
  h6: { fontWeight: 700, fontSize: '1.125rem' },
  subtitle1: { fontWeight: 500 },
  subtitle2: { fontWeight: 500 },
  body1: { fontWeight: 400 },
  body2: { fontWeight: 400 },
  button: { fontWeight: 500, textTransform: 'none' },
  caption: { fontWeight: 400 },
  overline: { fontWeight: 400 },
};
