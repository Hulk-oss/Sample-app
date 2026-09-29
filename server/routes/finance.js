import express from "express";
import FinancialProfile from "../models/FinancialProfile.js";
import Transaction from "../models/Transaction.js";
import Invoice from "../models/Invoice.js";
import { requireAuth } from "../middleware/auth.js";
import { requireUserPortal } from "../middleware/user.js";
import { calculateDashboard, buildMonthlyCashFlow, buildForecast, calculateRunway, calculateTaxReserve, getAverageMonthlyExpenses, getAverageMonthlyIncome } from "../finance/engine.js";
import { parse, profileSchema } from "../utils/validate.js";
import { validation } from "../utils/errors.js";

const router = express.Router();
router.use(requireAuth, requireUserPortal);

async function getContext(userId, now = new Date()) {
  const [profile, transactions, invoices] = await Promise.all([
    FinancialProfile.findOne({ userId }).lean(),
    Transaction.find({ userId }).lean(),
    Invoice.find({ userId }).lean(),
  ]);
  if (!profile) throw validation("Complete onboarding before opening financial analytics.");
  return { profile, transactions, invoices, now };
}

router.get("/dashboard", async (req, res) => {
  const context = await getContext(req.user._id);
  res.json({
    dashboard: calculateDashboard(context),
    profile: context.profile,
  });
});

router.get("/cash-flow", async (req, res) => {
  const context = await getContext(req.user._id);
  const actual = buildMonthlyCashFlow(context.transactions, context.profile.openingCashBalance, 6, context.now);
  const dashboard = calculateDashboard(context);
  const averageIncome = getAverageMonthlyIncome(context.transactions, context.profile.monthlyIncomeGoal, 3, context.now);
  const averageExpenses = getAverageMonthlyExpenses(context.transactions, context.profile.monthlyExpensesBaseline, 3, context.now);
  const forecast = buildForecast(dashboard.cashBalance, averageIncome, averageExpenses, 3);
  res.json({
    actual,
    forecast,
    metrics: {
      netCashFlow: averageIncome - averageExpenses,
      projectedEndingBalance: forecast[forecast.length - 1]?.balance ?? dashboard.cashBalance,
      lowestProjectedBalance: Math.min(...forecast.map(x => x.balance), dashboard.cashBalance),
      reserveTarget: dashboard.emergencyReserve,
    },
  });
});

router.get("/runway", async (req, res) => {
  const context = await getContext(req.user._id);
  const dashboard = calculateDashboard(context);
  const scenarios = [
    { name: "Normal income", months: dashboard.runwayMonths, note: "Current stored income and expense assumptions" },
    { name: "Income −30%", months: calculateRunway({ availableCash: dashboard.cashBalance - dashboard.taxReserve, averageMonthlyExpenses: dashboard.averageMonthlyExpenses + context.profile.monthlyIncomeGoal * 0.3 }), note: "Conservative planning scenario" },
    { name: "Income = 0", months: calculateRunway({ availableCash: dashboard.cashBalance - dashboard.taxReserve, averageMonthlyExpenses: dashboard.averageMonthlyExpenses }), note: "Expenses-only runway" },
  ];
  res.json({
    currentRunway: dashboard.runwayMonths,
    targetRunway: 6,
    averageMonthlyExpenses: dashboard.averageMonthlyExpenses,
    availableCash: dashboard.cashBalance - dashboard.taxReserve,
    scenarios,
  });
});

router.get("/tax-reserve", async (req, res) => {
  const context = await getContext(req.user._id);
  const estimate = calculateTaxReserve(context.profile.relevantTaxIncomeBase, context.profile.taxReserveRate);
  res.json({
    estimatedTaxReserve: estimate,
    alreadyReserved: context.profile.taxReservedAmount,
    additionalNeeded: Math.max(0, estimate - context.profile.taxReservedAmount),
    rate: context.profile.taxReserveRate,
    relevantIncomeBase: context.profile.relevantTaxIncomeBase,
    disclaimer: "Estimate only — not tax advice.",
  });
});

router.get("/profile", async (req, res) => {
  const profile = await FinancialProfile.findOne({ userId: req.user._id }).lean();
  res.json({ profile });
});

router.patch("/profile", async (req, res) => {
  const data = parse(profileSchema, req.body);
  const profile = await FinancialProfile.findOneAndUpdate(
    { userId: req.user._id },
    data,
    { new: true, upsert: true, runValidators: true }
  );
  if (typeof data.profession === "string") {
    req.user.profession = data.profession;
    await req.user.save();
  }
  res.json({ profile });
});

router.patch("/assumptions", async (req, res) => {
  const data = parse(profileSchema.pick({ taxReserveRate: true, emergencyReserveTarget: true, monthlyIncomeGoal: true, monthlyExpensesBaseline: true }), req.body);
  if (!Object.keys(data).length) throw validation("At least one assumption is required.");
  const profile = await FinancialProfile.findOneAndUpdate({ userId: req.user._id }, data, { new: true, upsert: true, runValidators: true });
  res.json({ profile });
});

export default router;
