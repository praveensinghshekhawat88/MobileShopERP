/** Mirrors `UserResponse.java`. */
export interface UserResponse {
  readonly id: string;
  readonly roleId: number;
  readonly roleName: string;
  readonly firstName: string;
  readonly lastName: string | null;
  readonly mobile: string;
  readonly email: string | null;
  readonly active: boolean;
  readonly lastLogin: string | null;
}

/** Mirrors `CreateUserRequest.java`. */
export interface CreateUserRequest {
  readonly roleId: number;
  readonly firstName: string;
  readonly lastName?: string | null;
  readonly mobile: string;
  readonly email?: string | null;
  readonly password: string;
}

/** Mirrors `UpdateUserRequest.java` — all fields optional. */
export interface UpdateUserRequest {
  readonly roleId?: number;
  readonly firstName?: string;
  readonly lastName?: string | null;
  readonly mobile?: string;
  readonly email?: string | null;
  readonly password?: string;
  readonly active?: boolean;
}
