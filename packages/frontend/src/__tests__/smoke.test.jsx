import { render, screen } from '@testing-library/react';

import App from '../App';

test('renders App and shows Login when not authenticated', () => {
  localStorage.removeItem('token');

  render(<App />);

  expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
});
