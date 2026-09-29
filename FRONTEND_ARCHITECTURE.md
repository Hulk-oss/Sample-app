# Frontend Architecture

## Scope

This document defines the frontend boundaries for Freelancer CFO. It is intentionally compatible with the existing React + Vite implementation and does not require a UI rewrite.

## Runtime structure

```
src/
├── app/
│   └── navigation.js
├── components/
│   └── ui/
│       └── Primitives.jsx
├── features/
│   ├── auth/
│   │   └── Auth.jsx
│   └── company/
│       └── CompanyPortal.jsx
├── App.jsx
├── CompanyPortal.jsx (removed; feature version is canonical)
├── LandingPage.jsx
├── api.js
├── finance.js
├── ErrorBoundary.jsx
├── main.jsx
└── styles.css
```

## Responsibilities

### App shell

`App.jsx` is the orchestration layer.

It owns:
- authenticated session state
- workspace loading
- top-level portal switching
- user finance page selection
- cross-page notifications
- existing finance CRUD/modal orchestration

It should not become the home for new reusable components.

### Feature boundaries

Each feature owns its own workflow and local UI state.

- `features/auth`: login, signup, company signup, invite signup, password reset initiation.
- `features/company`: company-admin workspace, team, invitations, company settings.
- Finance pages remain in `App.jsx` today for behavior preservation and can be extracted incrementally.

### Shared UI

`components/ui/Primitives.jsx` contains presentation-only primitives shared across features:
- Button
- Badge
- Kpi
- EmptyState
- ChartCard
- Head

These components should remain domain-agnostic.

### Navigation

`app/navigation.js` is the single metadata source for user and company navigation.

Navigation labels and icons should not be duplicated inside feature components.

### API boundary

`api.js` remains the client-side server boundary.

UI components should call API operations rather than constructing fetch requests themselves.

## State strategy

The current application intentionally uses React local state because there is no requirement for a global client-state store yet.

Use this rule:

- Local form/modal/menu state → component state.
- Authenticated identity/session → application shell.
- Finance/company records → API/server state.
- Derived finance values → server finance engine.
- Shared client state should only become Context/Zustand state when multiple distant consumers genuinely need the same mutable state.

Do not introduce Redux or another global store solely to move props around.

## Rendering

The authenticated product remains CSR because:
- data is user-specific
- every protected view requires an authenticated request
- financial values are calculated from private account data

The public landing page remains isolated from authenticated rendering.

## Extraction strategy

Future extraction should follow this order:

1. Extract reusable UI.
2. Extract feature-specific workflows.
3. Extract data hooks/services when a feature has repeated server-state behavior.
4. Only then introduce global state where duplication remains.

Each migration must preserve:
- existing route behavior
- API contracts
- visible content
- existing CSS classes
- user data isolation

## Performance principles

- Keep the initial public entry lightweight.
- Lazy-load large authenticated feature modules when the product grows.
- Avoid duplicating API requests between sibling components.
- Prefer server-derived finance values to client-side recomputation.
- Preserve stable component boundaries so future React memoization/code splitting is straightforward.

## Testing layers

### Unit
Finance calculations, formatting, validation, and API helpers.

### Integration
Authentication, onboarding, transactions, invoices, company invites and role boundaries.

### E2E
- user signup → onboarding → dashboard
- login → dashboard
- company signup → company portal
- company invite → invited user signup
- transaction creation → dashboard recalculation
- invoice status change → dashboard recalculation

## Non-goals

This architecture pass does not change:
- product content
- visual design
- API routes
- MongoDB schema
- JWT behavior
- finance formulas
- company authorization rules
