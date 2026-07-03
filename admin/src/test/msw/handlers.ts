import { http, HttpResponse } from 'msw';

import {
  buildAuthTokensResponse,
  buildSuccessEnvelope,
  loginUrl,
  refreshUrl,
} from '@/test/fixtures/authFixtures';

export const authHandlers = [
  http.post(loginUrl(), async ({ request }) => {
    const body = (await request.json()) as { mobile: string; password: string };

    if (body.mobile === '9999999999' && body.password === 'Admin@123456') {
      return HttpResponse.json(
        buildSuccessEnvelope(buildAuthTokensResponse(), '/api/v1/auth/login')
      );
    }

    return HttpResponse.json(
      {
        success: false,
        message: 'Invalid credentials',
        data: null,
        errorCode: 'UNAUTHORIZED',
        timestamp: new Date().toISOString(),
        path: '/api/v1/auth/login',
      },
      { status: 401 }
    );
  }),

  http.post(refreshUrl(), async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string };

    if (body.refreshToken === 'test-refresh-token') {
      return HttpResponse.json(
        buildSuccessEnvelope(buildAuthTokensResponse(), '/api/v1/auth/refresh')
      );
    }

    return HttpResponse.json(
      {
        success: false,
        message: 'Invalid refresh token',
        data: null,
        errorCode: 'UNAUTHORIZED',
        timestamp: new Date().toISOString(),
        path: '/api/v1/auth/refresh',
      },
      { status: 401 }
    );
  }),
];
