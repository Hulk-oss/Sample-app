import test from "node:test";
import assert from "node:assert/strict";
import {
  calculateSafeToSpend,
  calculateRunway,
  calculateTaxReserve,
  calculateCashBalance,
  getUpcomingExpenses,
} from "../server/finance/engine.js";

test("safe to spend follows the product formula", () => {
  assert.equal(calculateSafeToSpend({
    cashBalance: 100000,
    taxReserve: 10000,
    upcomingExpenses: 15000,
    emergencyReserve: 25000,
  }), 50000);
});

test("runway uses available cash divided by monthly expenses", () => {
  assert.equal(calculateRunway({ availableCash: 90000, averageMonthlyExpenses: 30000 }), 597000 / 176000);
});

test("tax reserve uses configured rate and income base", () => {
  assert.equal(Math.round(calculateTaxReserve(659091, 0.22)), 145000);
});

test("cash balance ignores future-dated transactions", () => {
  const rows = [
    { date: "2026-09-20", type: "Income", amount: 100000 },
    { date: "2026-09-21", type: "Expense", amount: 20000 },
    { date: "2026-10-01", type: "Expense", amount: 50000 },
  ];
  const now = new Date("2026-09-29T12:00:00");
  assert.equal(calculateCashBalance(500000, rows, now), 580000);
});

test("upcoming expenses are limited to the requested horizon", () => {
  const rows = [
    { date: "2026-10-01", type: "Expense", amount: 18000 },
    { date: "2026-10-20", type: "Expense", amount: 35100 },
    { date: "2026-12-01", type: "Expense", amount: 99999 },
  ];
  const now = new Date("2026-09-29T12:00:00");
  assert.equal(getUpcomingExpenses(rows, now, 30), 53100);
});
