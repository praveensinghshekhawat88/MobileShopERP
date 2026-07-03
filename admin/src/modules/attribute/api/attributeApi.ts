/**
 * Raw endpoint paths backing the Attribute Engine (Attribute Group →
 * Attribute → Attribute Value, see AGENTS.md § Attribute Engine) — see
 * `AttributeGroupController.java`, `AttributeController.java`,
 * `AttributeValueController.java`. All three sub-resources are grouped in
 * this single `attribute` module (see 01_AGENTS.md § Module Structure).
 */
export const ATTRIBUTE_GROUP_API = {
  base: '/attribute-groups',
  byId: (id: number) => `/attribute-groups/${id}`,
} as const;

export const ATTRIBUTE_API = {
  base: '/attributes',
  byId: (id: number) => `/attributes/${id}`,
} as const;

export const ATTRIBUTE_VALUE_API = {
  base: '/attribute-values',
  byId: (id: number) => `/attribute-values/${id}`,
  deactivate: (id: number) => `/attribute-values/${id}/deactivate`,
} as const;
