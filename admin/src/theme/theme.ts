import { createTheme, type Theme } from '@mui/material/styles';

import { components } from '@/theme/components';
import { palette } from '@/theme/palette';
import { shadows } from '@/theme/shadows';
import { typography } from '@/theme/typography';

/**
 * The single MUI theme for the app — see 03_ARCHITECTURE.md § Theme
 * Architecture. Never create a second theme or override styles inline;
 * everything must flow from here.
 */
export const theme: Theme = createTheme({
  palette,
  typography,
  shadows,
  spacing: 4,
  shape: {
    borderRadius: 8,
  },
  components,
});
