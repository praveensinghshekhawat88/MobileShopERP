import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

/**
 * Global application settings slice — see 01_AGENTS.md § Redux Rules.
 *
 * Mirrors the backend `settings` singleton (company profile, invoice prefix,
 * currency, timezone). Fetching/updating settings is implemented by the
 * `settings` module (Phase 10) — this slice only defines the shape and holds
 * whatever the app has currently loaded, so the topbar/sidebar/invoice
 * screens can read it without prop drilling.
 */
export interface ApplicationSettings {
  readonly companyName: string;
  readonly invoicePrefix: string;
  readonly currency: string;
  readonly timezone: string;
  readonly logoUrl: string | null;
}

export interface SettingsState {
  readonly settings: ApplicationSettings | null;
}

const initialState: SettingsState = {
  settings: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setApplicationSettings(state, action: PayloadAction<ApplicationSettings>) {
      state.settings = action.payload;
    },
    clearApplicationSettings(state) {
      state.settings = null;
    },
  },
});

export const { setApplicationSettings, clearApplicationSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
