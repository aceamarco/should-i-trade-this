import React, {useState} from 'react';
import './App.css';
import 'animate.css';
import Button from '@mui/material/Button';
import {Grid} from '@mui/material';

// Each question lists two choices. `yes` is the choice that supports making the trade;
// `no` is the choice that argues against it. `flag` is shown on the results screen
// when the user picks `no`.
const QUESTIONS = {
  buy: [
    {
      question: "Can I explain in one sentence why this will go up?",
      yes: "Yes, I have a clear thesis",
      no: "Not really",
      flag: "No clear thesis for the position."
    },
    {
      question: "Do I know how the company actually makes money?",
      yes: "Yes",
      no: "No",
      flag: "You don't fully understand the business."
    },
    {
      question: "Have I decided my exit, both a price target and a stop-loss?",
      yes: "Yes, both are set",
      no: "I'll figure it out later",
      flag: "No exit plan (target or stop-loss)."
    },
    {
      question: "How big would this position be relative to my portfolio?",
      yes: "Sized sensibly",
      no: "A big chunk",
      flag: "Position size is too large."
    },
    {
      question: "Is this money I won't need for the next 3 to 5 years?",
      yes: "Yes",
      no: "I might need it",
      flag: "You may need this money soon."
    },
    {
      question: "Do I have an emergency fund and no high-interest debt?",
      yes: "Yes",
      no: "No",
      flag: "Emergency fund or high-interest debt should come first."
    },
    {
      question: "Where did I hear about this?",
      yes: "My own research",
      no: "A tip, headline, or social media",
      flag: "The idea came from hype or a tip, not research."
    },
    {
      question: "Has it already run up a lot recently?",
      yes: "No, the price is reasonable",
      no: "Yes, I'd be chasing it",
      flag: "You may be chasing a run-up."
    },
    {
      question: "Have I compared its valuation to its peers?",
      yes: "Yes",
      no: "No",
      flag: "Valuation hasn't been checked against peers."
    },
    {
      question: "Does it add something new, or double down on what I already hold?",
      yes: "Adds diversification",
      no: "Doubles down",
      flag: "Adds concentration to existing holdings."
    },
    {
      question: "Is this a better use of the money than my index fund?",
      yes: "Yes, and I can say why",
      no: "Not sure",
      flag: "Not clearly better than a plain index fund."
    },
    {
      question: "How would I feel if it dropped 30% next week?",
      yes: "I'd hold or buy more",
      no: "I'd panic",
      flag: "You may not be able to stomach the volatility."
    },
    {
      question: "What is my current mental state?",
      yes: "Calm and neutral",
      no: "FOMO, excited, or trying to win back losses",
      flag: "Emotional state (FOMO or revenge trading)."
    }
  ],
  sell: [
    {
      question: "Has my original reason for owning this changed or broken?",
      yes: "Yes, the thesis is broken",
      no: "No, it still holds",
      flag: "Your original thesis still holds."
    },
    {
      question: "If I didn't own it, would I buy it today at this price?",
      yes: "No",
      no: "Yes",
      flag: "You'd still buy it today, so it may be worth holding."
    },
    {
      question: "Did it hit the target or stop-loss I set in advance?",
      yes: "Yes",
      no: "No, or I never set one",
      flag: "No pre-planned exit was triggered."
    },
    {
      question: "Has the position grown into too large a share of my portfolio?",
      yes: "Yes, I need to rebalance",
      no: "No, it's sized fine",
      flag: "No rebalancing need."
    },
    {
      question: "Do I need this cash in the near term?",
      yes: "Yes",
      no: "No",
      flag: "No near-term need for the cash."
    },
    {
      question: "Do I have a better place to put this money?",
      yes: "Yes, a specific one",
      no: "Not really",
      flag: "No better use for the capital lined up."
    },
    {
      question: "Why am I thinking about selling right now?",
      yes: "A planned, thought-out decision",
      no: "A scary headline or a red day",
      flag: "The urge to sell comes from a headline or a red day."
    },
    {
      question: "Am I trying to time the market?",
      yes: "No",
      no: "Yes",
      flag: "You may be trying to time the market."
    },
    {
      question: "Have I considered the tax hit (short vs. long-term, wash sales)?",
      yes: "Yes, I'm fine with it",
      no: "Haven't checked",
      flag: "Tax consequences haven't been checked."
    },
    {
      question: "Would I be selling just to lock in a gain or get back to break-even?",
      yes: "No, it's about the business",
      no: "Yes",
      flag: "Anchored to your purchase price instead of what the business is worth."
    },
    {
      question: "What is my current mental state?",
      yes: "Calm and neutral",
      no: "Panicked or greedy",
      flag: "Emotional state (panic or greed)."
    }
  ]
};

const VERDICTS = {
  buy: {
    go: "Buy",
    caution: "Maybe Buy, but Look at the Red Flags",
    stop: "Don't Buy"
  },
  sell: {
    go: "Sell",
    caution: "Maybe Sell, but Look at the Red Flags",
    stop: "Don't Sell"
  }
};

function getVerdict(action, score) {
  if (score >= 0.8) return VERDICTS[action].go;
  if (score >= 0.6) return VERDICTS[action].caution;
  return VERDICTS[action].stop;
}

function App() {
  const [action, setAction] = useState(null); // 'buy' | 'sell' | null
  const [answers, setAnswers] = useState([]); // true = supports the trade

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
            <Button onClick={() => setAction('buy')} variant="contained" color="success">Buying</Button>
          </Grid>
          <Grid item xs={6}>
            <Button onClick={() => setAction('sell')} variant="contained" color="error">Selling</Button>
          </Grid>
        </Grid>
      </div>
    );
  }

  const questions = QUESTIONS[action];

  // Results screen
  if (answers.length === questions.length) {
    const yesCount = answers.filter(Boolean).length;
    const score = yesCount / questions.length;
    const flags = questions.filter((q, i) => !answers[i]).map(q => q.flag);

    return (
      <div className="App">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h1 className="animate__animated animate__fadeIn">{getVerdict(action, score)}</h1>
            <p className="score">{yesCount} of {questions.length} answers support the trade.</p>
          </Grid>
          {flags.length > 0 && (
            <Grid item xs={12}>
              <h3>Red flags</h3>
              <ul className="flags">
                {flags.map((flag, i) => <li key={i}>{flag}</li>)}
              </ul>
            </Grid>
          )}
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

  return (
    <div className="App">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <p className="progress">Question {currentQ + 1} of {questions.length}</p>
          <h1 key={`${action}-${currentQ}`} className="animate__animated animate__fadeIn">{q.question}</h1>
        </Grid>
        {[{label: q.yes, value: true}, {label: q.no, value: false}].map(choice => (
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

export default App;
