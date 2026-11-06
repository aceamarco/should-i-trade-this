import { render, screen, fireEvent } from '@testing-library/react';
import App, { QUESTIONS, evaluate } from './App';

// Answer the quiz by clicking the button text, so the shuffled button order doesn't matter.
function answer(action, answers) {
  answers.forEach((favors, i) => {
    const q = QUESTIONS[action][i];
    fireEvent.click(screen.getByRole('button', { name: favors ? q.yes : q.no }));
  });
}

function startQuiz(action) {
  render(<App />);
  fireEvent.click(screen.getByText(action === 'buy' ? 'Buying' : 'Selling'));
}

test('asks whether you are buying or selling', () => {
  render(<App />);
  expect(screen.getByText(/buying or selling/i)).toBeInTheDocument();
});

test('a failed dealbreaker ends the buy quiz right away', () => {
  startQuiz('buy');
  answer('buy', [false]);
  expect(screen.getByText("Don't Buy")).toBeInTheDocument();
  expect(screen.getByText(/need this money soon/i)).toBeInTheDocument();
});

test('one solid reason is enough to sell', () => {
  startQuiz('sell');
  const sell = QUESTIONS.sell;
  // Only the first reason (broken thesis) applies; every check passes.
  answer('sell', sell.map((q, i) => (q.type === 'reason' ? i === 0 : true)));
  expect(screen.getByText('Sell')).toBeInTheDocument();
  expect(screen.getByText(/thesis is broken/i)).toBeInTheDocument();
});

test('no reasons ends the sell quiz with a hold verdict', () => {
  startQuiz('sell');
  const reasonCount = QUESTIONS.sell.filter(q => q.type === 'reason').length;
  answer('sell', Array(reasonCount).fill(false));
  expect(screen.getByText(/Hold/)).toBeInTheDocument();
});

test('verdict gets more cautious as red flags add up', () => {
  const qs = QUESTIONS.buy;
  const withFailedChecks = (n) => {
    let failed = 0;
    return qs.map(q => {
      if (q.type !== 'check') return true;
      failed += 1;
      return failed > n;
    });
  };
  expect(evaluate('buy', qs, withFailedChecks(0)).tone).toBe('go');
  expect(evaluate('buy', qs, withFailedChecks(2)).tone).toBe('caution');
  expect(evaluate('buy', qs, withFailedChecks(3)).tone).toBe('stop');
});
