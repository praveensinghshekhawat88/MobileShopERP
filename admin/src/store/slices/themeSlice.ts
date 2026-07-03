import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Global theme slice — see 01_AGENTS.md § State Management.
 * Light theme only today; dark mode is a documented future enhancement
 * (see 05_UI_STANDARDS.md § Theme). The mode/sidebar state is global UI
 * state, not server data, so it belongs in Redux rather than React Query.
 */
export type ThemeMode = 'light' | 'dark';

export interface ThemeState {
  readonly mode: ThemeMode;
  readonly sidebarCollapsed: boolean;
}

const initialState: ThemeState = {
  mode: 'light',
  sidebarCollapsed: false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action: PayloadAction<boolean>) {
      state.sidebarCollapsed = action.payload;
    },
  },
});

export const { setThemeMode, toggleSidebar, setSidebarCollapsed } = themeSlice.actions;
export default themeSlice.reducer;
