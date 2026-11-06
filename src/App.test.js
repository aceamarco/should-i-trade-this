import { render, screen, fireEvent } from '@testing-library/react';
import App, { QUESTIONS, evaluate } from './App';

// Answer the quiz by clicking the button text, so the shuffled button order doesn't matter.
function answer(action, answers) {
  answers.forEach((favors, i) => {
    const q = QUESTIONS[action][i];
    fireEvent.click(screen.getByRole('button', { name: favors ? q.yes : q.no }));
  });
}

// Build an answer list: `fail` maps a question type to how many of that type get a "no".
function answersWith(questions, fail = {}) {
  const seen = {};
  return questions.map(q => {
    seen[q.type] = (seen[q.type] || 0) + 1;
    return seen[q.type] > (fail[q.type] || 0);
  });
}

test('asks whether you are buying or selling', () => {
  render(<App />);
  expect(screen.getByText(/buying or selling/i)).toBeInTheDocument();
});

test('every question is asked, even after a foundation concern', () => {
  render(<App />);
  fireEvent.click(screen.getByText('Buying'));
  const answers = answersWith(QUESTIONS.buy, { foundation: 1 });
  answer('buy', answers);
  expect(screen.getByText('Buy')).toBeInTheDocument();
  expect(screen.getByText(/need this money soon/i)).toBeInTheDocument();
});

test('no single question decides the outcome', () => {
  for (const action of ['buy', 'sell']) {
    const qs = QUESTIONS[action];
    const perfect = qs.map(() => true);
    qs.forEach((_, i) => {
      const flipped = [...perfect];
      flipped[i] = false;
      // Flipping any one answer from a perfect quiz still gives at least a "maybe".
      expect(evaluate(action, qs, flipped).tone).not.toBe('stop');
    });
  }
});

test('you do not need every sell reason', () => {
  const qs = QUESTIONS.sell;
  const reasonCount = qs.filter(q => q.type === 'reason').length;
  expect(evaluate('sell', qs, answersWith(qs, { reason: reasonCount - 2 })).tone).toBe('go');
});

test('verdict gets more cautious as concerns add up', () => {
  const qs = QUESTIONS.buy;
  expect(evaluate('buy', qs, answersWith(qs)).tone).toBe('go');
  expect(evaluate('buy', qs, answersWith(qs, { check: 5 })).tone).toBe('caution');
  expect(evaluate('buy', qs, answersWith(qs, { foundation: 2, check: 4 })).tone).toBe('stop');
});
