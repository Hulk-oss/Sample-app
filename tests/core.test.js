import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateRunway,
  calculateSafeToSpend,
  calculateTaxReserve,
} from "../src/finance.js";
import { getCompanyPlan, getUserPlan } from "../server/pricing.js";

test("runway uses available cash divided by monthly expenses", () => {
  assert.equal(calculateRunway(60000, 10000), 6);
  assert.equal(calculateRunway(0, 10000), 0);
  assert.equal(calculateRunway(60000, 0), 0);
});

test("safe to spend subtracts all stored guardrails", () => {
  assert.equal(
    calculateSafeToSpend({
      cashBalance: 200000,
      taxReserve: 30000,
      upcomingExpenses: 20000,
      emergencyReserve: 50000,
    }),
    100000
  );
});

test("tax reserve applies the configured rate", () => {
  assert.equal(calculateTaxReserve(250000, 0.2), 50000);
});

test("pricing defaults safely for users and companies", () => {
  assert.equal(getUserPlan({ plan: "free" }).id, "free");
  assert.equal(getUserPlan({ plan: "pro" }).id, "pro");
  assert.equal(getCompanyPlan({ plan: "growth" }).id, "growth");
  assert.equal(getCompanyPlan({ plan: "unknown" }).id, "starter");
});
