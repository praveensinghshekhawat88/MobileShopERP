import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { ProtectedRoute } from '@/auth/ProtectedRoute';
import { ROLES } from '@/common/constants/roles';
import { renderWithProviders } from '@/test/testUtils';

describe('ProtectedRoute', () => {
  it('redirects unauthenticated users to login', () => {
    const { container } = renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      { routerProps: { initialEntries: ['/dashboard'] } }
    );

    expect(container).toHaveTextContent('Login Page');
  });

  it('renders child routes for authenticated users', () => {
    const { container } = renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Route>
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      {
        routerProps: { initialEntries: ['/dashboard'] },
        preloadedState: {
          auth: {
            isAuthenticated: true,
            user: {
              id: '11111111-1111-1111-1111-111111111111',
              firstName: 'Admin',
              lastName: 'User',
              mobile: '9999999999',
              roleName: ROLES.ADMIN,
            },
          },
        },
      }
    );

    expect(container).toHaveTextContent('Dashboard');
  });
});
