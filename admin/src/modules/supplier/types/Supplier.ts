/** Mirrors `SupplierResponse.java` — see BACKEND_API_CONTRACT.md § Business. */
export interface SupplierResponse {
  readonly id: string;
  readonly supplierName: string;
  readonly contactPerson: string | null;
  readonly mobile: string;
  readonly email: string | null;
  readonly gstNumber: string | null;
  readonly address: string | null;
}

/**
 * Mirrors `CreateSupplierRequest.java`. `supplierName`/`mobile` are
 * `@NotBlank`; `mobile` must additionally be a valid 10-digit Indian number
 * and unique (enforced server-side — see `MobileValidator`/
 * `DuplicateSupplierMobileException`). Create/Update are `hasRole('ADMIN')`
 * only (see `SupplierController`).
 */
export interface CreateSupplierRequest {
  readonly supplierName: string;
  readonly contactPerson?: string | null;
  readonly mobile: string;
  readonly email?: string | null;
  readonly gstNumber?: string | null;
  readonly address?: string | null;
}

/** Mirrors `UpdateSupplierRequest.java`. All fields optional (partial update). */
export interface UpdateSupplierRequest {
  readonly supplierName?: string;
  readonly contactPerson?: string | null;
  readonly mobile?: string;
  readonly email?: string | null;
  readonly gstNumber?: string | null;
  readonly address?: string | null;
}
