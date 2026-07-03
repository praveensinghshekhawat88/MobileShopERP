import type { RoleName } from '@/common/constants/roles';

/**
 * Auth module DTOs — mirror `POST /auth/login` and `POST /auth/refresh`
 * exactly as documented in BACKEND_API_CONTRACT.md § Authentication
 * Endpoints. Field names and shape must never drift from that contract.
 */
export interface LoginRequest {
  readonly mobile: string;
  readonly password: string;
}

export interface RefreshRequest {
  readonly refreshToken: string;
}

export interface AuthenticatedUserDto {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly mobile: string;
  readonly roleName: RoleName;
}

/**
 * Response `data` shape for both `/auth/login` and `/auth/refresh` — the
 * contract documents them as identical.
 */
export interface AuthTokensResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly tokenType: string;
  readonly expiresIn: number;
  readonly user: AuthenticatedUserDto;
}
