import HomePage from 'pages/HomePage';
import { render, screen } from './setupTests';

test('renders welcome message', () => {
  render(<HomePage />);
  const linkElement = screen.getByText(/Welcome to React Redux Base/i);
  expect(linkElement).toBeInTheDocument();
});
