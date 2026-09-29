# Freelancer CFO

A user-owned finance workspace for independent professionals, redesigned around the calm editorial structure and whitespace of the Flowbase Cooking Template reference. The reference is visual inspiration only; all content and workflows are purpose-built for freelancer finance.

## User data model

There is no demo account, seeded customer, preset transaction history, preset invoices, or hardcoded financial profile in the application.

Every user's numbers come from:
- account signup/login
- financial onboarding
- their own transactions
- their own invoices
- their own financial assumptions

The application starts empty for each new account.

## Features

- Sign up and login
- Password reset API
- Multi-step onboarding for user financial assumptions
- Safe to Spend
- Transactions with real entry form and CRUD API
- Invoices with real creation, payment status, and reminder draft flow
- Cash-flow actual/forecast analytics
- Tax reserve planning
- Runway scenarios
- AI CFO backed by the signed-in user's deterministic finance context
- Settings for user-specific assumptions
- Responsive editorial UI

## Stack

React + Vite + Recharts + Lucide React + CSS

Express + MongoDB/Mongoose + JWT + bcryptjs + Zod + Helmet + rate limiting

## Run

    npm install

Create .env from .env.example, start MongoDB, then run:

    npm run dev:full

Frontend: http://localhost:5173
API: http://localhost:5000

## Data ownership

Every financial document includes userId and every protected route queries by the authenticated user's ID. No shared financial records are used.

## Core formulas

safe_to_spend = cash_balance - tax_reserve - upcoming_expenses - emergency_reserve

runway_months = available_cash / average_monthly_expenses

tax_reserve = relevant_income × configurable_tax_rate

Critical values are calculated by the server-side finance engine.

## UI direction

The reference-inspired visual system uses a warm light canvas, white rounded cards, large editorial headings, pill controls, simple navigation, and generous whitespace. Financial numbers remain the primary visual content rather than copying the source template's cooking content.

## Documentation

- Architecture: ARCHITECTURE.md
- API contract: API.md
- Setup: SETUP.md
- Database model: DATABASE.md
- Deployment: DEPLOYMENT.md
- Contributing: CONTRIBUTING.md


## Frontend architecture

The frontend uses explicit boundaries for shared UI, navigation, authentication, and the company workspace:

- `src/app/` — application-level metadata and navigation
- `src/components/ui/` — reusable presentation primitives
- `src/features/auth/` — authentication workflow
- `src/features/company/` — company-admin workspace
- `src/App.jsx` — top-level orchestration and user finance workflow

See `FRONTEND_ARCHITECTURE.md` and `DESIGN_SYSTEM.md` for the architectural rules.
