import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Navigation from '../components/Navigation';

test('renders navigation links', () => {
  render(
    <MemoryRouter>
      <Navigation />
    </MemoryRouter>
  );

  expect(screen.getByText(/products/i)).toBeInTheDocument();
});

test('calls onLogout when logout button clicked', async () => {
  const user = userEvent.setup();
  const onLogout = jest.fn();

  render(
    <MemoryRouter>
      <Navigation onLogout={onLogout} />
    </MemoryRouter>
  );

  // adapte si le bouton ne s'appelle pas "Logout"
  const btn = screen.getByRole('button', { name: /logout/i });
  await user.click(btn);

  expect(onLogout).toHaveBeenCalled();
});
