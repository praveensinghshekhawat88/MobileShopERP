import { useEffect, useState } from 'react';

import { tokenStorage } from '@/auth/tokenStorage';
import { authService } from '@/modules/auth/services/authService';
import { useAppDispatch } from '@/store/hooks';
import { clearAuthenticatedUser, setAuthenticatedUser } from '@/store/slices/authSlice';
import { logger } from '@/utils/logger';

export interface UseSessionBootstrapResult {
  readonly isBootstrapping: boolean;
}

/**
 * Restores a session on full page reload — see 03_ARCHITECTURE.md §
 * Authentication Architecture and 04_TASKS.md P01-T002 (Refresh Token). The
 * access token lives in memory only (see 08_SECURITY.md § Token Storage) so
 * it is lost on reload; if a refresh token survives in `sessionStorage`,
 * this silently exchanges it for a new token pair — via `POST /auth/refresh`,
 * whose response carries the full user object identically to `/auth/login`
 * (see BACKEND_API_CONTRACT.md § Authentication Endpoints) — before the app
 * renders any route. Without this, `ProtectedRoute` would incorrectly
 * redirect an already-logged-in user to `/login` on every refresh.
 */
export function useSessionBootstrap(): UseSessionBootstrapResult {
  const dispatch = useAppDispatch();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap(): Promise<void> {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        const data = await authService.refresh({ refreshToken });
        if (cancelled) {
          return;
        }
        tokenStorage.setTokens(data.accessToken, data.refreshToken);
        dispatch(setAuthenticatedUser(data.user));
      } catch (error) {
        logger.warn('Session restore failed, clearing stale session', error);
        tokenStorage.clear();
        if (!cancelled) {
          dispatch(clearAuthenticatedUser());
        }
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return { isBootstrapping };
}
