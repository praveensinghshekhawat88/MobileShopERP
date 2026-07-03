import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';

import { LoginPage } from '@/pages/LoginPage';
import { renderWithProviders } from '@/test/testUtils';

vi.mock('@/utils/toast', () => ({
  showErrorToast: vi.fn(),
  showSuccessToast: vi.fn(),
}));

describe('LoginPage', () => {
  it('blocks submission when the mobile number is invalid', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>,
      { routerProps: { initialEntries: ['/login'] } }
    );

    await user.type(screen.getByLabelText('Mobile Number'), '12345');
    await user.type(screen.getByLabelText('Password'), 'secret');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(await screen.findByText('Enter a valid 10-digit mobile number')).toBeInTheDocument();
  });

  it('redirects to the dashboard after a successful login', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>,
      { routerProps: { initialEntries: ['/login'] } }
    );

    await user.type(screen.getByLabelText('Mobile Number'), '9999999999');
    await user.type(screen.getByLabelText('Password'), 'Admin@123456');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });
});
