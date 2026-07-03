/** Mirrors `RoleResponse.java`. */
export interface RoleResponse {
  readonly id: number;
  readonly name: string;
  readonly description: string | null;
  readonly active: boolean;
}
