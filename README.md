# Should I Trade This?

A quick quiz to help decide whether to buy or sell a stock or position. It's the trading
version of [Should I Buy This?](https://github.com/aceamarco/should-i-buy-this).

Choose **Buying** or **Selling** and answer three kinds of questions:

1. **Dealbreakers**: any one ends the quiz with a "don't" (e.g. you'll need the money soon).
2. **Reasons**: you need at least one solid reason to make the trade.
3. **Checks**: how sound the decision is (emotion, taxes, overtrading, exit plan). Each
   failed check is a red flag; three or more means wait.

Live at https://aceamarco.github.io/should-i-trade-this

> This quiz is a gut check, not financial advice.

## Development

```bash
npm install
npm start          # dev server at http://localhost:3000
npm test           # run tests
npm run deploy     # build and publish to GitHub Pages (gh-pages branch)
```

The questions are in `src/App.js` (`QUESTIONS.buy` and `QUESTIONS.sell`).
