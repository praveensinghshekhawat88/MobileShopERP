import { z } from 'zod';

/** Mirrors backend `GstValidator` (`common/validation/GstValidator.java`) — 15-char GSTIN format. */
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

/**
 * Client-side validation only — final authority is backend Jakarta
 * Validation and the imperative `MobileValidator`/`GstValidator` checks in
 * `SupplierService` (see 08_SECURITY.md § Input Validation). Mirrors
 * `CreateSupplierRequest`/`UpdateSupplierRequest` exactly.
 */
export const supplierFormSchema = z.object({
  supplierName: z
    .string()
    .trim()
    .min(1, 'Supplier name is required')
    .max(200, 'Supplier name must be at most 200 characters'),
  contactPerson: z
    .string()
    .trim()
    .max(150, 'Contact person must be at most 150 characters')
    .optional(),
  mobile: z
    .string()
    .trim()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  email: z.union([
    z.literal(''),
    z
      .string()
      .trim()
      .max(150, 'Email must be at most 150 characters')
      .email('Enter a valid email address'),
  ]),
  gstNumber: z
    .string()
    .trim()
    .max(20, 'GST number must be at most 20 characters')
    .refine((value) => value === '' || GST_REGEX.test(value.toUpperCase()), {
      message: 'Enter a valid GST number (e.g. 22AAAAA0000A1Z5)',
    }),
  address: z.string().trim().optional(),
});

export type SupplierFormValues = z.infer<typeof supplierFormSchema>;

export const SUPPLIER_FORM_DEFAULT_VALUES: SupplierFormValues = {
  supplierName: '',
  contactPerson: '',
  mobile: '',
  email: '',
  gstNumber: '',
  address: '',
};
