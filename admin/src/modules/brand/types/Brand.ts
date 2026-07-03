/** Mirrors `BrandResponse.java` — see BACKEND_API_CONTRACT.md § Masters. */
export interface BrandResponse {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  readonly active: boolean;
}

/** Mirrors `CreateBrandRequest.java`. `name` is required (`@NotBlank`, max 100). */
export interface CreateBrandRequest {
  readonly name: string;
  readonly description?: string | null;
  readonly active?: boolean;
}

/** Mirrors `UpdateBrandRequest.java`. All fields optional (partial update). */
export interface UpdateBrandRequest {
  readonly name?: string;
  readonly description?: string | null;
  readonly active?: boolean;
}
