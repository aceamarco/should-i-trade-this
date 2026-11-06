# Should I Trade This?

A quick quiz to help decide whether to buy or sell a stock or position. It's the trading
version of [Should I Buy This?](https://github.com/aceamarco/should-i-buy-this).

Choose **Buying** or **Selling** and answer the questions. At the end you get a verdict and
a list of the red flags from your answers.

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
