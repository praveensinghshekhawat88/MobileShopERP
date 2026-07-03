import { describe, expect, it } from 'vitest';

import { authService } from '@/modules/auth/services/authService';
import { buildAuthTokensResponse } from '@/test/fixtures/authFixtures';

describe('authService', () => {
  it('posts credentials to /auth/login and returns token data', async () => {
    const response = await authService.login({
      mobile: '9999999999',
      password: 'Admin@123456',
    });

    expect(response.accessToken).toBe(buildAuthTokensResponse().accessToken);
    expect(response.user.roleName).toBe('ADMIN');
  });

  it('throws when login credentials are invalid', async () => {
    await expect(
      authService.login({ mobile: '9999999999', password: 'wrong-password' })
    ).rejects.toMatchObject({
      response: { status: 401 },
    });
  });

  it('posts refresh token to /auth/refresh and returns new tokens', async () => {
    const response = await authService.refresh({ refreshToken: 'test-refresh-token' });

    expect(response.refreshToken).toBe(buildAuthTokensResponse().refreshToken);
  });
});
