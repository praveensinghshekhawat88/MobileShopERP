import { useNavigate } from 'react-router-dom';

import { tokenStorage } from '@/auth/tokenStorage';
import { queryClient } from '@/config/queryClient';
import { ROUTE_PATHS } from '@/routes/routePaths';
import { useAppDispatch } from '@/store/hooks';
import { clearAuthenticatedUser } from '@/store/slices/authSlice';

/**
 * Logout — see 08_SECURITY.md § Logout: "Clear Redux, React Query Cache,
 * Storage, Session. Redirect Login." No backend logout endpoint exists (see
 * BACKEND_API_CONTRACT.md § Authentication Endpoints — only login/refresh
 * are documented), so this is a pure client-side state reset.
 */
export function useLogout(): () => void {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (): void => {
    tokenStorage.clear();
    dispatch(clearAuthenticatedUser());
    queryClient.clear();
    navigate(ROUTE_PATHS.login, { replace: true });
  };
}
