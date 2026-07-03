import { configureStore } from '@reduxjs/toolkit';

import authReducer from '@/store/slices/authSlice';
import settingsReducer from '@/store/slices/settingsSlice';
import themeReducer from '@/store/slices/themeSlice';

/**
 * Redux Toolkit store — see 01_AGENTS.md § State Management.
 * Scope is locked to Authentication, Theme, and Application Settings only.
 * Never store API list/detail data here — that belongs to TanStack Query.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    settings: settingsReducer,
  },
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
