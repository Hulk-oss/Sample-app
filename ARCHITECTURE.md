# Architecture

## Product flow

```mermaid
flowchart TB
 UI[React UI] --> P[Product pages]
 P --> C[Reusable components]
 P --> F[Deterministic finance engine]
 F --> R[Finance results]
 R --> AI[AI explanation layer]
 AI --> UI
 D[Demo or future persisted data] --> F
```

## Responsibilities

- App shell: navigation, auth/onboarding state, modals and notifications.
- Product pages: financial workflows and decision-oriented views.
- Components: KPI cards, charts, tables, badges, buttons, alerts, forms and AI messages.
- Finance engine: trusted deterministic formulas.
- Data layer: demo records now; API/database later.
- AI layer: explanation only, using trusted calculation results.

## AI safety boundary

```mermaid
sequenceDiagram
 participant U as User
 participant UI as Web UI
 participant F as Finance Engine
 participant A as AI Service
 U->>UI: Ask question
 UI->>F: Request current finance context
 F-->>UI: Structured calculation results
 UI->>A: Question + trusted results
 A-->>UI: Explanation + next action
 UI-->>U: Clearly labeled response
```

## Production evolution

1. Authenticated API
2. Persistent database
3. Server-side finance engine
4. AI gateway receiving structured results only
5. Audit logs for financial mutations and calculations
6. Server-side authorization and rate limiting

## Design tokens

| Token | Value |
|---|---|
| Background | #070709 |
| Surface | #111216 |
| Surface 2 | #181A20 |
| Border | #3C414C |
| Text | #D9D8DC |
| Muted | #858995 |
| Primary | #6065FA |
| Accent | #585999 |
| Warning | #D75A35 |

The interface avoids decorative gradients, excessive glassmorphism, and unnecessary motion.
