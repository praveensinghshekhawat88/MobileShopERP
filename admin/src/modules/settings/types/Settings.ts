/** Mirrors `SettingsResponse.java` — singleton shop settings row. */
export interface SettingsResponse {
  readonly id: number;
  readonly companyName: string;
  readonly ownerName: string;
  readonly gstNumber: string | null;
  readonly mobile: string | null;
  readonly email: string | null;
  readonly address: string | null;
  readonly logo: string | null;
  readonly invoicePrefix: string | null;
}

/** Mirrors `UpdateSettingsRequest.java` — all fields optional (partial update). */
export interface UpdateSettingsRequest {
  readonly companyName?: string;
  readonly ownerName?: string;
  readonly gstNumber?: string | null;
  readonly mobile?: string | null;
  readonly email?: string | null;
  readonly address?: string | null;
  readonly logo?: string | null;
  readonly invoicePrefix?: string | null;
}
