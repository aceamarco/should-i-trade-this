import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('asks whether you are buying or selling', () => {
  render(<App />);
  expect(screen.getByText(/buying or selling/i)).toBeInTheDocument();
});

test('counts the final answer and shows a verdict', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Selling'));
  // Answer "yes" to all 11 sell questions: the first button in each pair supports the trade
  for (let i = 0; i < 11; i++) {
    fireEvent.click(screen.getAllByRole('button')[0]);
  }
  expect(screen.getByText('Sell')).toBeInTheDocument();
  expect(screen.getByText(/11 of 11/)).toBeInTheDocument();
});
