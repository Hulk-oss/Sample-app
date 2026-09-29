# Database Model

MongoDB is the persistence layer. Each user's financial data is isolated by userId.

## User

User stores identity and authentication state.

- name
- email
- passwordHash
- profession
- onboardingComplete
- resetPasswordTokenHash
- resetPasswordExpiresAt
- timestamps

## FinancialProfile

FinancialProfile is created during onboarding and contains only the signed-in user's assumptions.

- userId
- monthlyIncomeGoal
- monthlyExpensesBaseline
- taxReserveRate
- emergencyReserveTarget
- openingCashBalance
- taxReservedAmount
- relevantTaxIncomeBase
- timestamps

No preset financial values are inserted for new accounts.

## Transaction

- userId
- date
- description
- client
- category
- type: Income | Expense
- amount
- timestamps

## Invoice

- userId
- invoiceNumber
- client
- amount
- issueDate
- dueDate
- status: Paid | Due | Overdue
- paidAt
- timestamps

## AIConversation

- userId
- question
- calculationContext
- response
- estimated
- timestamps

## Source-of-truth rule

The client never supplies trusted totals. The server derives safe-to-spend, runway, tax reserve, receivables, and cash-flow values from persisted records and the user's explicit assumptions.

Every financial query is scoped to the authenticated user's userId.
