# Database Model

The MVP uses browser memory. A production database can use these entities.

## User

id, name, email, profession, passwordHash, createdAt

## FinancialProfile

userId, monthlyIncomeGoal, taxReserveRate, emergencyReserveTarget, createdAt, updatedAt

## Transaction

id, userId, date, description, client, category, type, amount, createdAt, updatedAt

## Invoice

id, userId, client, invoiceNumber, amount, issueDate, dueDate, status, createdAt, updatedAt

## FinanceSnapshot

userId, cashBalance, taxReserve, upcomingExpenses, emergencyReserve, safeToSpend, runwayMonths, calculatedAt

## AIConversation

id, userId, question, calculationContext, response, estimated, createdAt

Critical financial values should be derived from authoritative records rather than trusted from client-submitted values.
