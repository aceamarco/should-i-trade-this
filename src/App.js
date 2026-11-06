import React, {useState} from 'react';
import './App.css';
import 'animate.css';
import Button from '@mui/material/Button';
import {Grid} from '@mui/material';

// The quiz has three kinds of questions, asked in this order:
//
//   dealbreaker: any one "no" ends the quiz with a don't-trade verdict.
//   reason:      a reason to make the trade. You need at least one.
//   check:       how sound the decision is. Each "no" adds a red flag.
//
// For every question, `yes` is the answer that favors the trade and `no` is the
// one that argues against it. `note` is what the results screen shows: a reason
// found, a dealbreaker hit, or a red flag.
const QUESTIONS = {
  buy: [
    {
      type: 'dealbreaker',
      question: "Will I need this money in the next 3 to 5 years?",
      yes: "No, it's long-term money",
      no: "I might need it",
      note: "You may need this money soon. Keep it somewhere safer."
    },
    {
      type: 'dealbreaker',
      question: "Do I have an emergency fund in place?",
      yes: "Yes",
      no: "No",
      note: "Build an emergency fund before investing."
    },
    {
      type: 'dealbreaker',
      question: "Do I have any high-interest debt, like credit card balances?",
      yes: "No",
      no: "Yes",
      note: "Paying off high-interest debt is a guaranteed return that's hard to beat."
    },
    {
      type: 'reason',
      question: "Can I explain why this will go up, based on my own research and not a tip or headline?",
      yes: "Yes, I have a thesis",
      no: "Not really",
      note: "You have a thesis from your own research."
    },
    {
      type: 'reason',
      question: "Does it fill a planned gap in my portfolio, like a sector or asset class I'm missing?",
      yes: "Yes",
      no: "No",
      note: "It fills a planned gap in your portfolio."
    },
    {
      type: 'check',
      question: "Do I understand how the company actually makes money?",
      yes: "Yes",
      no: "No",
      note: "You don't fully understand the business."
    },
    {
      type: 'check',
      question: "Have I decided my exit, both a price target and a stop-loss?",
      yes: "Yes, both are set",
      no: "I'll figure it out later",
      note: "No exit plan (target or stop-loss)."
    },
    {
      type: 'check',
      question: "Would this position be a sensible size, around 5% of my portfolio or less?",
      yes: "Yes",
      no: "It'd be a big chunk",
      note: "Position size is too large."
    },
    {
      type: 'check',
      question: "Am I buying because the price just ran up?",
      yes: "No",
      no: "Honestly, yes",
      note: "You may be chasing a run-up."
    },
    {
      type: 'check',
      question: "Have I compared its valuation to its peers?",
      yes: "Yes",
      no: "No",
      note: "Valuation hasn't been checked against peers."
    },
    {
      type: 'check',
      question: "Can I say why this beats putting the money in an index fund?",
      yes: "Yes",
      no: "Not really",
      note: "Not clearly better than an index fund. Most professional fund managers don't beat the index."
    },
    {
      type: 'check',
      question: "How would I react if it dropped 30% next week?",
      yes: "Hold or buy more",
      no: "Panic",
      note: "You may not be able to stomach the volatility."
    },
    {
      type: 'check',
      question: "Am I using margin, options, or leverage for this?",
      yes: "No, just cash",
      no: "Yes",
      note: "Leverage magnifies losses and can force you to sell at the worst time."
    },
    {
      type: 'check',
      question: "How many trades have I made in the past month?",
      yes: "Few or none",
      no: "More than I planned",
      note: "Overtrading. Frequent traders tend to earn less because of costs and overconfidence."
    },
    {
      type: 'check',
      question: "What is my current mental state?",
      yes: "Calm and neutral",
      no: "FOMO, excited, or trying to win back losses",
      note: "Emotional state (FOMO or revenge trading)."
    }
  ],
  sell: [
    {
      type: 'reason',
      question: "Has my original reason for owning this changed or broken?",
      yes: "Yes, the thesis is broken",
      no: "No, it still holds",
      note: "Your original thesis is broken."
    },
    {
      type: 'reason',
      question: "If I didn't own it, would I buy it today at this price?",
      yes: "No",
      no: "Yes",
      note: "You wouldn't buy it today at this price."
    },
    {
      type: 'reason',
      question: "Did it hit the target or stop-loss I set in advance?",
      yes: "Yes",
      no: "No, or I never set one",
      note: "It hit your pre-planned exit."
    },
    {
      type: 'reason',
      question: "Has the position grown into too large a share of my portfolio?",
      yes: "Yes, I need to rebalance",
      no: "No, it's sized fine",
      note: "Rebalancing an oversized position."
    },
    {
      type: 'reason',
      question: "Do I need this cash in the near term?",
      yes: "Yes",
      no: "No",
      note: "You need the cash."
    },
    {
      type: 'reason',
      question: "Do I have a specific, better place to put this money?",
      yes: "Yes",
      no: "Not really",
      note: "You have a better use for the capital."
    },
    {
      type: 'check',
      question: "Why am I thinking about selling right now?",
      yes: "A planned, thought-out decision",
      no: "A scary headline or a red day",
      note: "The urge to sell comes from a headline or a red day."
    },
    {
      type: 'check',
      question: "Am I trying to time the market?",
      yes: "No",
      no: "Yes",
      note: "You may be trying to time the market."
    },
    {
      type: 'check',
      question: "Would I be selling a winner just to lock in the gain?",
      yes: "No, it's about the business",
      no: "Yes",
      note: "Selling winners just to lock in a gain is a common mistake. Winners people sell often keep outperforming."
    },
    {
      type: 'check',
      question: "Have I checked the tax hit (short-term vs. long-term gains)?",
      yes: "Yes, I'm fine with it",
      no: "Haven't checked",
      note: "Tax consequences haven't been checked."
    },
    {
      type: 'check',
      question: "Am I selling at a loss and planning to buy it back within 30 days?",
      yes: "No",
      no: "Yes",
      note: "Wash sale: buying it back within 30 days means you can't claim the loss."
    },
    {
      type: 'check',
      question: "How many trades have I made in the past month?",
      yes: "Few or none",
      no: "More than I planned",
      note: "Overtrading. Frequent traders tend to earn less because of costs and overconfidence."
    },
    {
      type: 'check',
      question: "What is my current mental state?",
      yes: "Calm and neutral",
      no: "Panicked or greedy",
      note: "Emotional state (panic or greed)."
    }
  ]
};

const VERBS = {buy: "Buy", sell: "Sell"};

// Returns true when the quiz should stop early and show results.
function isFinished(questions, answers) {
  if (answers.length === questions.length) return true;
  const last = answers.length - 1;
  if (last < 0) return false;
  // A failed dealbreaker ends the quiz right away.
  if (questions[last].type === 'dealbreaker' && !answers[last]) return true;
  // After the last reason question, stop if no reason applied.
  const lastReason = questions.map(q => q.type).lastIndexOf('reason');
  if (last === lastReason) {
    return !questions.some((q, i) => q.type === 'reason' && answers[i]);
  }
  return false;
}

export function evaluate(action, questions, answers) {
  const pick = (type, value) =>
    questions.filter((q, i) => q.type === type && i < answers.length && answers[i] === value).map(q => q.note);

  const dealbreakers = pick('dealbreaker', false);
  const reasons = pick('reason', true);
  const flags = pick('check', false);
  const verb = VERBS[action];

  let verdict;
  let tone;
  if (dealbreakers.length > 0) {
    verdict = `Don't ${verb}`;
    tone = 'stop';
  } else if (reasons.length === 0) {
    verdict = action === 'buy' ? "Don't Buy: There's No Real Reason To" : "Hold: There's No Solid Reason to Sell";
    tone = 'stop';
  } else if (flags.length === 0) {
    verdict = verb;
    tone = 'go';
  } else if (flags.length <= 2) {
    verdict = `${verb}, but Deal With the Red Flags First`;
    tone = 'caution';
  } else {
    verdict = "Wait: Too Many Red Flags";
    tone = 'stop';
  }

  return {verdict, tone, dealbreakers, reasons, flags};
}

function NoteList({title, items, className}) {
  if (items.length === 0) return null;
  return (
    <Grid item xs={12}>
      <h3>{title}</h3>
      <ul className={`notes ${className}`}>
        {items.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    </Grid>
  );
}

function App() {
  const [action, setAction] = useState(null); // 'buy' | 'sell' | null
  const [answers, setAnswers] = useState([]); // true = favors the trade
  const [swapped, setSwapped] = useState([]); // per question: show the "no" button first?

  const start = (newAction) => {
    setAction(newAction);
    setAnswers([]);
    // Shuffle button order so the answer that favors the trade isn't always on the same side.
    setSwapped(QUESTIONS[newAction].map(() => Math.random() < 0.5));
  };

  const reset = () => {
    setAction(null);
    setAnswers([]);
  };

  // Start screen: pick buy or sell
  if (action === null) {
    return (
      <div className="App">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h1 className="animate__animated animate__fadeIn">Are you thinking about buying or selling?</h1>
          </Grid>
          <Grid item xs={6}>
            <Button onClick={() => start('buy')} variant="contained" color="success">Buying</Button>
          </Grid>
          <Grid item xs={6}>
            <Button onClick={() => start('sell')} variant="contained" color="error">Selling</Button>
          </Grid>
        </Grid>
      </div>
    );
  }

  const questions = QUESTIONS[action];

  // Results screen
  if (isFinished(questions, answers)) {
    const {verdict, tone, dealbreakers, reasons, flags} = evaluate(action, questions, answers);

    return (
      <div className="App">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h1 className={`animate__animated animate__fadeIn verdict ${tone}`}>{verdict}</h1>
          </Grid>
          <NoteList title="Dealbreakers" items={dealbreakers} className="bad" />
          <NoteList title={`Reasons to ${action}`} items={reasons} className="good" />
          <NoteList title="Red flags" items={flags} className="bad" />
          <Grid item xs={12}>
            <Button onClick={reset} variant="contained">Start Over</Button>
          </Grid>
          <Grid item xs={12}>
            <p className="disclaimer">This quiz is a gut check, not financial advice.</p>
          </Grid>
        </Grid>
      </div>
    );
  }

  // Question screen
  const currentQ = answers.length;
  const q = questions[currentQ];
  const choices = [{label: q.yes, value: true}, {label: q.no, value: false}];
  if (swapped[currentQ]) choices.reverse();

  return (
    <div className="App">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <p className="progress">Question {currentQ + 1} of {questions.length}</p>
          <h1 key={`${action}-${currentQ}`} className="animate__animated animate__fadeIn">{q.question}</h1>
        </Grid>
        {choices.map(choice => (
          <Grid item xs={6} key={choice.label}>
            <Button onClick={() => setAnswers([...answers, choice.value])} variant="contained">{choice.label}</Button>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button onClick={() => setAnswers(answers.slice(0, -1))} disabled={currentQ === 0}>Back</Button>
          <Button onClick={reset}>Start Over</Button>
        </Grid>
      </Grid>
    </div>
  );
}

export {QUESTIONS};
export default App;
