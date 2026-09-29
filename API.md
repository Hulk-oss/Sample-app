# API Contract

The current MVP is frontend-only. These routes define a clean future backend boundary.

## Authentication

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`

## Financial data

- `GET /api/dashboard`
- `GET /api/transactions`
- `POST /api/transactions`
- `PATCH /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `GET /api/invoices`
- `POST /api/invoices`
- `PATCH /api/invoices/:id`
- `POST /api/invoices/:id/mark-paid`
- `POST /api/invoices/:id/reminder-draft`

Reminder drafting must not send an email in this MVP.

## Analytics

- `GET /api/cash-flow`
- `GET /api/runway`
- `GET /api/tax-reserve`

## AI CFO

`POST /api/ai/ask`

The server should calculate trusted financial context before calling an AI provider.

```json
{
  "question": "Can I spend ₹150000?",
  "context": {
    "safeToSpend": 332000,
    "runwayMonths": 3.39,
    "receivables": 320000
  }
}
```

Expected response:

```json
{
  "answer": "Direct answer",
  "keyNumbers": [],
  "explanation": "Short explanation",
  "nextAction": "Suggested next action",
  "estimated": true
}
```

Tax and regulated financial topics must be clearly labeled as estimates and not presented as professional advice.

## Error shape

```json
{"error":{"code":"VALIDATION_ERROR","message":"Human-readable message"}}
```
