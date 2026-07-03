/**
 * Backend-locked enum — see `common/enums/AttributeType.java` and
 * AGENTS.md § Attribute Types. Drives the Attribute master (Phase 03) and
 * is reused by the Product module (Phase 04) when picking variant
 * attributes, so it lives here rather than inside `modules/attribute`.
 */
export const ATTRIBUTE_TYPES = {
  VARIANT: 'VARIANT',
  SPECIFICATION: 'SPECIFICATION',
  FILTER: 'FILTER',
} as const;

export type AttributeType = (typeof ATTRIBUTE_TYPES)[keyof typeof ATTRIBUTE_TYPES];

export const ATTRIBUTE_TYPE_LABELS: Record<AttributeType, string> = {
  VARIANT: 'Variant',
  SPECIFICATION: 'Specification',
  FILTER: 'Filter',
};
