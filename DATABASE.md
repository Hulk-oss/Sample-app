# Database Model

MongoDB stores user, company, financial, invitation, and AI records. Financial data is isolated by user.

## User

- name
- email
- passwordHash
- profession
- role: user | company_admin
- companyId: optional
- onboardingComplete
- password reset fields
- timestamps

## Company

- name
- ownerUserId
- plan
- status
- seatLimit
- timestamps

## CompanyInvite

- companyId
- email
- invitedBy
- tokenHash
- expiresAt
- status
- timestamps

## FinancialProfile

- userId
- monthlyIncomeGoal
- monthlyExpensesBaseline
- taxReserveRate
- emergencyReserveTarget
- openingCashBalance
- taxReservedAmount
- relevantTaxIncomeBase
- timestamps

No customer financial values are seeded.

## Transaction

- userId
- date
- description
- client
- category
- type
- amount
- timestamps

## Invoice

- userId
- invoiceNumber
- client
- amount
- issueDate
- dueDate
- status
- paidAt
- timestamps

## AIConversation

- userId
- question
- calculationContext
- response
- estimated
- timestamps

## Isolation rules

- User finance routes require role=user.
- Company routes require role=company_admin.
- User finance queries always include authenticated userId.
- Company queries scope by authenticated companyId.
- Company endpoints do not expose member financial records.
