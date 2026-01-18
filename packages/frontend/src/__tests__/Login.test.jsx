import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import Login from '../pages/Login';
import { loginUser } from '../services/api';

jest.mock('../services/api', () => ({
  loginUser: jest.fn(),
}));

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('lets user type username and password', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    const username = screen.getByPlaceholderText(/username/i);
    const password = screen.getByPlaceholderText(/password/i);

    await user.type(username, 'bapti');
    await user.type(password, 'secret');

    expect(username).toHaveValue('bapti');
    expect(password).toHaveValue('secret');
  });

  test('submits form, calls loginUser, calls onLogin and navigates to /products', async () => {
    const user = userEvent.setup();
    const onLogin = jest.fn();

    loginUser.mockResolvedValue({ token: 't' });

    render(
      <MemoryRouter>
        <Login onLogin={onLogin} />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), 'bapti');
    await user.type(screen.getByPlaceholderText(/password/i), 'secret');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(loginUser).toHaveBeenCalledWith('bapti', 'secret');
    expect(onLogin).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/products');
  });

  test('shows error message when login fails', async () => {
    const user = userEvent.setup();

    loginUser.mockRejectedValue({ error: 'Bad credentials' });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), 'bad');
    await user.type(screen.getByPlaceholderText(/password/i), 'wrong');
    await user.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/bad credentials/i)).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
