/**
 * Public exports of the auth module — see 01_AGENTS.md § Module Structure:
 * "index.ts (public exports of the module)". Other modules/pages must import
 * from `@/modules/auth`, never reach into `@/modules/auth/hooks/...` etc.
 * directly.
 */
export { useAuth } from '@/modules/auth/hooks/useAuth';
export type { UseAuthResult } from '@/modules/auth/hooks/useAuth';
export { useLogin } from '@/modules/auth/hooks/useLogin';
export { useLogout } from '@/modules/auth/hooks/useLogout';
export { useSessionBootstrap } from '@/modules/auth/hooks/useSessionBootstrap';
export type { UseSessionBootstrapResult } from '@/modules/auth/hooks/useSessionBootstrap';
export { authService } from '@/modules/auth/services/authService';
export type {
  AuthenticatedUserDto,
  AuthTokensResponse,
  LoginRequest,
  RefreshRequest,
} from '@/modules/auth/types/Auth';
export { loginSchema } from '@/modules/auth/validation/authValidation';
export type { LoginFormValues } from '@/modules/auth/validation/authValidation';
