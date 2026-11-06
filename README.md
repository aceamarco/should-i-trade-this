# Should I Trade This?

A quick quiz to help decide whether to buy or sell a stock or position. It's the trading
version of [Should I Buy This?](https://github.com/aceamarco/should-i-buy-this).

Choose **Buying** or **Selling** and answer every question. Each answer adds points, and no
single question decides the outcome:

- **Foundations** (2 points each): basic footing, like not needing the money soon.
- **Reasons** (2 points each, best two count): reasons to make the trade. You don't need all of them.
- **Checks** (1 point each): how sound the decision is (emotion, taxes, overtrading, exit plan).

80%+ of the points means go, 65%+ means maybe, and below that means don't.

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
