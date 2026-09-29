import express from "express";
import User from "../models/User.js";
import Company from "../models/Company.js";
import FinancialProfile from "../models/FinancialProfile.js";
import Transaction from "../models/Transaction.js";
import Invoice from "../models/Invoice.js";
import { requireAuth } from "../middleware/auth.js";
import { requirePlatformOwner } from "../middleware/owner.js";
import { notFound } from "../utils/errors.js";
import { calculateDashboard } from "../finance/engine.js";
import AdminAudit from "../models/AdminAudit.js";

const router = express.Router();
router.use(requireAuth, requirePlatformOwner);

router.get("/overview", async (req, res) => {
  const [users, companies, companyAdmins, transactions, invoices] = await Promise.all([
    User.countDocuments({}),
    Company.countDocuments({}),
    User.countDocuments({ role: "company_admin" }),
    Transaction.countDocuments({}),
    Invoice.countDocuments({}),
  ]);

  res.json({
    metrics: { users, companies, companyAdmins, transactions, invoices },
    access: "platform-owner",
  });
});

router.get("/users", async (req, res) => {
  const users = await User.find({})
    .select("_id name email role plan profession companyId onboardingComplete createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ users });
});

router.get("/companies", async (req, res) => {
  const companies = await Company.find({})
    .sort({ createdAt: -1 })
    .lean();

  const memberCounts = await User.aggregate([
    { $match: { companyId: { $ne: null } } },
    { $group: { _id: "$companyId", count: { $sum: 1 } } },
  ]);

  const counts = Object.fromEntries(memberCounts.map(row => [String(row._id), row.count]));
  res.json({
    companies: companies.map(company => ({
      ...company,
      memberCount: counts[String(company._id)] || 0,
    })),
  });
});

router.get("/users/:id/finance", async (req, res) => {
  await AdminAudit.create({
    actorUserId: req.user._id,
    action: "inspect_user_finance",
    targetType: "user",
    targetId: req.params.id,
  });

  const user = await User.findById(req.params.id)
    .select("_id name email role plan profession companyId onboardingComplete createdAt updatedAt")
    .lean();

  if (!user) throw notFound("User not found");

  const [profile, transactions, invoices] = await Promise.all([
    FinancialProfile.findOne({ userId: user._id }).lean(),
    Transaction.find({ userId: user._id }).sort({ date: -1 }).lean(),
    Invoice.find({ userId: user._id }).sort({ issueDate: -1 }).lean(),
  ]);

  const dashboard = profile
    ? calculateDashboard({ profile, transactions, invoices, now: new Date() })
    : null;

  res.json({
    user,
    profile,
    dashboard,
    transactions,
    invoices,
  });
});

router.get("/companies/:id/members", async (req, res) => {
  await AdminAudit.create({
    actorUserId: req.user._id,
    action: "inspect_company_members",
    targetType: "company",
    targetId: req.params.id,
  });

  const company = await Company.findById(req.params.id).lean();
  if (!company) throw notFound("Company not found");

  const members = await User.find({ companyId: company._id })
    .select("_id name email role plan profession onboardingComplete createdAt updatedAt")
    .sort({ createdAt: -1 })
    .lean();

  res.json({ company, members });
});

router.get("/audit", async (req, res) => {
  const events = await AdminAudit.find({})
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();
  res.json({ events });
});

export default router;
