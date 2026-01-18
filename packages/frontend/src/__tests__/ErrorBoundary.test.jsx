import { render, screen } from '@testing-library/react';

import ErrorBoundary from '../components/ErrorBoundary';

function Boom() {
  throw new Error('boom');
}

test('shows fallback UI when child crashes', () => {
  // Silence console.error React (normal quand un composant crash)
  jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>
  );

  expect(screen.getByText(/something went wrong|error/i)).toBeInTheDocument();

  console.error.mockRestore();
});
