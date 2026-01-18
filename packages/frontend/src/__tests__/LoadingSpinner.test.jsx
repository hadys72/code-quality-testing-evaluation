import { render } from '@testing-library/react';

import LoadingSpinner from '../components/LoadingSpinner';

test('renders spinner element', () => {
  const { container } = render(<LoadingSpinner />);

  // Le 1er div = container, le 2e div = le spinner (celui avec borderTop)
  const divs = container.querySelectorAll('div');
  expect(divs.length).toBeGreaterThanOrEqual(2);

  const spinner = divs[1];
  expect(spinner).toHaveStyle('border-top: 5px solid #3498db');
});
