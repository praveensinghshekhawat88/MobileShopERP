/** Mirrors `CustomerResponse.java` — see BACKEND_API_CONTRACT.md § Business. */
export interface CustomerResponse {
  readonly id: string;
  readonly name: string;
  readonly mobile: string;
  readonly email: string | null;
  readonly address: string | null;
  readonly gstNumber: string | null;
}

/**
 * Mirrors `CreateCustomerRequest.java`. `name`/`mobile` are `@NotBlank`;
 * `mobile` must additionally be a valid 10-digit Indian number and unique
 * (enforced server-side — see `MobileValidator`/`DuplicateCustomerMobileException`).
 */
export interface CreateCustomerRequest {
  readonly name: string;
  readonly mobile: string;
  readonly email?: string | null;
  readonly address?: string | null;
  readonly gstNumber?: string | null;
}

/** Mirrors `UpdateCustomerRequest.java`. All fields optional (partial update). */
export interface UpdateCustomerRequest {
  readonly name?: string;
  readonly mobile?: string;
  readonly email?: string | null;
  readonly address?: string | null;
  readonly gstNumber?: string | null;
}
