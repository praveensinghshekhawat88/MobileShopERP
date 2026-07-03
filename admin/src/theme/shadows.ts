import type { Shadows } from '@mui/material/styles';
import defaultShadows from '@mui/material/styles/shadows';

/**
 * Shadows — see 05_UI_STANDARDS.md § Shadows: "Use Material UI elevations.
 * Avoid custom shadows." This file intentionally re-exports MUI's default
 * elevation scale rather than inventing a custom one.
 */
export const shadows: Shadows = defaultShadows;
