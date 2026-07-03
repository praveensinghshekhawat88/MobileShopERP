import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { RoleName } from '@/common/constants/roles';

/**
 * Authentication slice — see 01_AGENTS.md § State Management / § Redux Rules.
 *
 * Holds only the logged-in user and role. Raw JWT/refresh token bytes are
 * intentionally NOT stored here — they live in `auth/tokenStorage.ts` (see
 * 08_SECURITY.md § Token Storage: "Never expose tokens"). This slice is what
 * drives UI concerns: `ProtectedRoute`, role-based navigation, and the topbar
 * profile menu.
 *
 * The actual login/refresh network flow is implemented in Phase 01 — this
 * slice is foundation-only infrastructure for now.
 */
export interface AuthenticatedUser {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly mobile: string;
  readonly roleName: RoleName;
}

export interface AuthState {
  readonly user: AuthenticatedUser | null;
  readonly isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthenticatedUser(state, action: PayloadAction<AuthenticatedUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuthenticatedUser(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuthenticatedUser, clearAuthenticatedUser } = authSlice.actions;
export default authSlice.reducer;
