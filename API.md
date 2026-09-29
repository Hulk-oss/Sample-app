# API Contract

## Authentication

- POST /api/auth/signup
- POST /api/auth/login
- POST /api/auth/company-signup
- POST /api/auth/forgot-password
- POST /api/auth/reset-password
- GET /api/auth/me
- POST /api/auth/onboarding

A normal signup creates a user account with no financial records. Company signup creates a company_admin account and a company workspace.

## User portal

Protected by user role:

- GET /api/dashboard
- GET /api/transactions
- POST /api/transactions
- PATCH /api/transactions/:id
- DELETE /api/transactions/:id
- GET /api/invoices
- POST /api/invoices
- PATCH /api/invoices/:id
- DELETE /api/invoices/:id
- POST /api/invoices/:id/mark-paid
- POST /api/invoices/:id/reminder-draft
- GET /api/cash-flow
- GET /api/runway
- GET /api/tax-reserve
- PATCH /api/profile
- PATCH /api/assumptions
- POST /api/ai/ask
- GET /api/ai/history

## Company portal

Protected by company_admin role:

- GET /api/company/overview
- POST /api/company/invites
- DELETE /api/company/invites/:id
- DELETE /api/company/members/:id
- PATCH /api/company/profile

Company APIs do not return member financial transactions or invoices. They manage company membership and workspace operations.

## AI CFO contract

POST /api/ai/ask

Request body:

    {
      "question": "Can I spend 150000?"
    }

The server builds trusted financial context from the authenticated user's records before generating the explanation.

## Error shape

    {
      "error": {
        "code": "VALIDATION_ERROR",
        "message": "Human-readable message"
      }
    }

Financial calculations are never accepted from client totals as a source of truth.


## Pricing enforcement

Individual accounts use `free` or `pro`. Analytics and AI endpoints enforce these entitlements server-side.

Organization employees inherit feature access from their organization's `starter`, `growth`, or `scale` plan. Seat limits are enforced when creating invitations.

## Platform owner

Protected by the `platform_owner` role:

- GET /api/admin/overview
- GET /api/admin/users
- GET /api/admin/companies
- GET /api/admin/users/:id/finance
- GET /api/admin/companies/:id/members
- GET /api/admin/audit

Finance inspection is restricted to the platform owner role and recorded in `AdminAudit`.
