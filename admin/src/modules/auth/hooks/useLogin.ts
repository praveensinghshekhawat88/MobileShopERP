import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { tokenStorage } from '@/auth/tokenStorage';
import { authService } from '@/modules/auth/services/authService';
import type { LoginRequest } from '@/modules/auth/types/Auth';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAppDispatch } from '@/store/hooks';
import { setAuthenticatedUser } from '@/store/slices/authSlice';

interface LoginLocationState {
  readonly from?: { readonly pathname: string };
}

/**
 * `POST /auth/login` mutation — see BACKEND_API_CONTRACT.md § Authentication
 * Endpoints. On success: persists both tokens (see 08_SECURITY.md § Token
 * Storage), populates the auth slice, and redirects back to the page the
 * user was originally trying to reach (see `auth/ProtectedRoute.tsx`),
 * falling back to the dashboard.
 *
 * `suppressGlobalErrorToast` is set because `LoginPage` handles the error
 * itself: field-level `VALIDATION_FAILED` errors are applied to the form
 * (see `utils/formErrors.ts`), and invalid-credentials `UNAUTHORIZED`
 * responses get a login-specific message instead of the generic "session
 * expired" copy from `utils/apiError.ts`.
 */
export function useLogin(): UseMutationResult<
  Awaited<ReturnType<typeof authService.login>>,
  unknown,
  LoginRequest
> {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  return useMutation({
    mutationFn: (request: LoginRequest) => authService.login(request),
    meta: { suppressGlobalErrorToast: true },
    onSuccess: (data) => {
      tokenStorage.setTokens(data.accessToken, data.refreshToken);
      dispatch(setAuthenticatedUser(data.user));

      const state = location.state as LoginLocationState | null;
      const redirectTo = state?.from?.pathname ?? ROUTE_PATHS.dashboard;
      navigate(redirectTo, { replace: true });
    },
  });
}
