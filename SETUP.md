# Setup

## Requirements

- Node.js 18+
- npm 9+
- MongoDB 6+ or MongoDB Atlas
- Modern browser

## Install

    git clone https://github.com/Hulk-oss/Sample-app.git
    cd Sample-app
    npm install

Create .env from .env.example.

## Development

Start frontend and API together:

    npm run dev:full

Or separately:

    npm run dev
    npm run dev:server

## Build and test

    npm test
    npm run build

## First-user flow

1. Create a new account.
2. Complete the four onboarding steps with your own financial information.
3. Add your own transactions.
4. Add your own invoices.
5. Review Safe to Spend, Cash Flow, Tax Reserve, and Runway.
6. Ask AI CFO questions about your stored numbers.

There is no demo account and there is no seed command. A new account starts without customer financial records.

## Environment

    PORT=5000
    MONGODB_URI=mongodb://127.0.0.1:27017/freelancer_cfo
    JWT_SECRET=replace-with-a-long-random-secret
    JWT_EXPIRES_IN=7d
    CLIENT_ORIGIN=http://localhost:5173

## Project map

- src/App.jsx: product screens, entry forms, empty states, responsive shell
- src/styles.css: reference-inspired visual system and responsive behavior
- src/api.js: frontend API client
- server/routes: auth, financial, analytics, AI
- server/finance/engine.js: trusted calculations
- server/models: MongoDB models
- tests/finance.test.js: finance formula tests
