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

## Local development

    npm run dev:full

Frontend: http://localhost:5173

API: http://localhost:5000

## Account flows

### User side

1. Create a user account.
2. Complete personal financial onboarding.
3. Add your own transactions and invoices.
4. Review Safe to Spend, Cash Flow, Tax Reserve, Runway, and AI CFO.

### Company side

1. Choose Company on the authentication screen.
2. Create the company workspace.
3. Open the Company Portal.
4. Invite users by email.
5. Share the generated invitation link with the intended user.
6. The invited user signs up through that link and remains the owner of their own private financial records.

There is no demo account and no seed command. New accounts start without sample customer data.

## Commands

    npm run dev
    npm run dev:server
    npm run dev:full
    npm test
    npm run build

## Environment

    PORT=5000
    MONGODB_URI=mongodb://127.0.0.1:27017/freelancer_cfo
    JWT_SECRET=replace-with-a-long-random-secret
    JWT_EXPIRES_IN=7d
    CLIENT_ORIGIN=http://localhost:5173

## Project map

- src/App.jsx: user portal and authentication flow
- src/CompanyPortal.jsx: company admin portal
- src/styles.css: shared editorial UI
- src/api.js: frontend API client
- server/app.js: Express app
- server/routes/auth.js: authentication and signup
- server/routes/company.js: company administration
- server/finance/engine.js: deterministic finance calculations
- api/[...path].js: Vercel serverless API entrypoint
- tests/finance.test.js: finance formula tests
