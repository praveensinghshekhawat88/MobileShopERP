import { z } from 'zod';

/**
 * Client-side validation only — final authority is backend Jakarta
 * Validation (see 08_SECURITY.md § Input Validation). Mirrors the exact
 * `POST /auth/login` request shape (BACKEND_API_CONTRACT.md § Authentication
 * Endpoints).
 */
export const loginSchema = z.object({
  mobile: z
    .string()
    .min(1, 'Mobile number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
