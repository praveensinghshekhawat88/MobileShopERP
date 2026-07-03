import { describe, expect, it } from 'vitest';

import { loginSchema } from '@/modules/auth/validation/authValidation';

describe('loginSchema', () => {
  it('accepts a valid Indian mobile number and password', () => {
    const result = loginSchema.safeParse({
      mobile: '9999999999',
      password: 'Admin@123456',
    });

    expect(result.success).toBe(true);
  });

  it('rejects an invalid mobile number', () => {
    const result = loginSchema.safeParse({
      mobile: '12345',
      password: 'secret',
    });

    expect(result.success).toBe(false);
  });

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({
      mobile: '9999999999',
      password: '',
    });

    expect(result.success).toBe(false);
  });
});
