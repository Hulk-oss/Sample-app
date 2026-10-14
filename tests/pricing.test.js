import test from "node:test";
import assert from "node:assert/strict";
import { filterUserNavigation, getRequiredPlanName, isUserFeatureEnabled } from "../src/pricing.js";
import { userNavigation } from "../src/app/navigation.js";

test("Individual Free only receives core workspace features", () => {
  const user = { plan: "free" };
  assert.equal(isUserFeatureEnabled(user, "dashboard"), true);
  assert.equal(isUserFeatureEnabled(user, "transactions"), true);
  assert.equal(isUserFeatureEnabled(user, "invoices"), true);
  assert.equal(isUserFeatureEnabled(user, "cashflow"), false);
  assert.equal(isUserFeatureEnabled(user, "tax"), false);
  assert.equal(isUserFeatureEnabled(user, "runway"), false);
  assert.equal(isUserFeatureEnabled(user, "ai"), false);
  const visible = filterUserNavigation(userNavigation, user).map(([key]) => key);
  assert.equal(visible.includes("cashflow"), false);
  assert.equal(visible.includes("ai"), false);
});

test("Individual Pro includes forecasting, reserve planning, runway and AI CFO", () => {
  const user = { plan: "pro" };
  for (const feature of ["cashflow", "tax", "runway", "ai"]) {
    assert.equal(isUserFeatureEnabled(user, feature), true, feature + " should be enabled");
  }
});

test("Organization feature access follows the stored company plan", () => {
  const starter = { companyId: "company-1", companyPlan: "starter", plan: "free" };
  const growth = { companyId: "company-1", companyPlan: "growth", plan: "free" };
  const scale = { companyId: "company-1", companyPlan: "scale", plan: "free" };

  assert.equal(isUserFeatureEnabled(starter, "transactions"), true);
  assert.equal(isUserFeatureEnabled(starter, "cashflow"), false);
  assert.equal(isUserFeatureEnabled(growth, "cashflow"), true);
  assert.equal(isUserFeatureEnabled(growth, "tax"), true);
  assert.equal(isUserFeatureEnabled(growth, "runway"), true);
  assert.equal(isUserFeatureEnabled(growth, "ai"), false);
  assert.equal(isUserFeatureEnabled(scale, "ai"), true);
});

test("Premium feature locks explain the plan tier that includes them", () => {
  assert.equal(getRequiredPlanName({ plan: "free" }, "cashflow"), "Individual Pro");
  assert.equal(getRequiredPlanName({ companyId: "company-1", companyPlan: "growth" }, "ai"), "Organization Scale");
});
