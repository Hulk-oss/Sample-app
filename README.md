# Freelancer CFO

A premium dark SaaS/fintech MVP for independent professionals who need a clear view of cash, reserves, receivables, runway, and next actions.

## Scope

- Sign up, login, forgot password, demo account
- Multi-step financial onboarding
- Safe to Spend dashboard
- Transactions and invoice workflows
- Cash-flow analytics with estimated forecasts
- Tax reserve planning estimate
- Runway scenarios
- AI CFO conversation UI
- Settings and responsive mobile navigation
- Attention states for overdue invoices, low runway, and negative-pressure scenarios

The MVP intentionally excludes banking, UPI, lending, investments, insurance, GST filing, payment processing, and other out-of-scope financial services.

## Stack

React + Vite + Recharts + Lucide React + CSS.

## Run

```bash
npm install
npm run dev
```

## Core formula

`safe_to_spend = cash_balance - tax_reserve - upcoming_expenses - emergency_reserve`

Demo:

- Cash ₹7.42L
- Tax reserve ₹1.45L
- Upcoming expenses ₹1.15L
- Emergency reserve ₹1.50L
- Safe to spend ₹3.32L
- Receivables ₹3.20L
- Overdue invoices ₹2.10L across 3 invoices

## AI boundary

```mermaid
flowchart LR
 U[User question] --> D[Stored user data]
 D --> F[Deterministic finance engine]
 F --> R[Trusted calculation results]
 R --> A[AI explanation layer]
 A --> O[Answer + key numbers + next action]
```

Critical numbers come from deterministic calculations. The AI layer explains stored results and must not invent data or independently replace critical calculations.

## Documentation

- [Architecture](ARCHITECTURE.md)
- [API contract](API.md)
- [Setup](SETUP.md)
- [Database model](DATABASE.md)
- [Deployment](DEPLOYMENT.md)
- [Contributing](CONTRIBUTING.md)

## Navigation

Dashboard → Transactions → Invoices → Cash Flow → Tax Reserve → Runway → AI CFO → Settings
