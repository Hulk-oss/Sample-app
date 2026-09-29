import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import FinancialProfile from "../models/FinancialProfile.js";
import Company from "../models/Company.js";
import CompanyInvite from "../models/CompanyInvite.js";
import { env } from "../config.js";
import { requireAuth } from "../middleware/auth.js";
import { parse, loginSchema, onboardingSchema, resetPasswordSchema, resetRequestSchema, signupSchema, companySignupSchema } from "../utils/validate.js";
import { unauthorized, validation } from "../utils/errors.js";

const router = express.Router();

function issueToken(user) {
  return jwt.sign({ sub: user._id.toString(), email: user.email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    profession: user.profession,
    onboardingComplete: user.onboardingComplete,
    role: user.role,
    companyId: user.companyId,
    plan: user.plan,
  };
}

router.post("/signup", async (req, res) => {
  const data = parse(signupSchema, req.body);
  const exists = await User.findOne({ email: data.email.toLowerCase() });
  if (exists) throw validation("An account with that email already exists.");

  let companyId = null;
  let invite = null;
  if (data.inviteToken) {
    const tokenHash = crypto.createHash("sha256").update(data.inviteToken).digest("hex");
    invite = await CompanyInvite.findOne({
      tokenHash,
      status: "pending",
      expiresAt: { $gt: new Date() },
      email: data.email.toLowerCase(),
    });
    if (!invite) throw validation("That company invitation is invalid or expired.");
    companyId = invite.companyId;
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    passwordHash,
    role: env.platformOwnerEmail && data.email.toLowerCase() === env.platformOwnerEmail ? "platform_owner" : "user",
    companyId,
    plan: data.plan,
  });

  if (invite) {
    invite.status = "accepted";
    await invite.save();
  }

  res.status(201).json({ token: issueToken(user), user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const data = parse(loginSchema, req.body);
  const user = await User.findOne({ email: data.email.toLowerCase() });
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) throw unauthorized("Email or password is incorrect");
  if (env.platformOwnerEmail && user.email === env.platformOwnerEmail && user.role !== "platform_owner") {
    user.role = "platform_owner";
    await user.save();
  }
  res.json({ token: issueToken(user), user: publicUser(user) });
});

router.post("/company-signup", async (req, res) => {
  const data = parse(companySignupSchema, req.body);
  const exists = await User.findOne({ email: data.email.toLowerCase() });
  if (exists) throw validation("An account with that email already exists.");

  const passwordHash = await bcrypt.hash(data.password, 12);
  const companySeatLimits = { starter: 5, growth: 25, scale: 100 };
  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    passwordHash,
    role: env.platformOwnerEmail && data.email.toLowerCase() === env.platformOwnerEmail ? "platform_owner" : "company_admin",
    onboardingComplete: true,
    plan: "free",
  });

  const company = await Company.create({
    name: data.companyName,
    ownerUserId: user._id,
    plan: data.plan,
    seatLimit: companySeatLimits[data.plan],
  });

  user.companyId = company._id;
  await user.save();

  res.status(201).json({
    token: issueToken(user),
    user: publicUser(user),
    company: { id: company._id, name: company.name, plan: company.plan, seatLimit: company.seatLimit },
  });
});

router.post("/forgot-password", async (req, res) => {
  const data = parse(resetRequestSchema, req.body);
  const user = await User.findOne({ email: data.email.toLowerCase() });
  if (user) {
    const rawToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordTokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.resetPasswordExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    await user.save();
    if (env.nodeEnv !== "production") console.log("Password reset token for " + user.email + ": " + rawToken);
  }
  res.json({ message: "If the account exists, a reset token has been created. In development it is printed by the server." });
});

router.post("/reset-password", async (req, res) => {
  const data = parse(resetPasswordSchema, req.body);
  const tokenHash = crypto.createHash("sha256").update(data.token).digest("hex");
  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() },
  });
  if (!user) throw validation("The reset token is invalid or expired.");
  user.passwordHash = await bcrypt.hash(data.password, 12);
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpiresAt = null;
  await user.save();
  res.json({ message: "Password updated. You can log in with the new password." });
});

router.get("/me", requireAuth, async (req, res) => {
  const profile = await FinancialProfile.findOne({ userId: req.user._id }).lean();
  res.json({ user: publicUser(req.user), profile });
});

router.post("/onboarding", requireAuth, async (req, res) => {
  const data = parse(onboardingSchema, req.body);
  const profile = await FinancialProfile.findOneAndUpdate(
    { userId: req.user._id },
    {
      monthlyIncomeGoal: data.monthlyIncomeGoal,
      monthlyExpensesBaseline: data.monthlyExpenses,
      taxReserveRate: data.taxReserveRate,
      emergencyReserveTarget: data.emergencyReserveTarget,
      openingCashBalance: data.currentCash,
      taxReservedAmount: 0,
      relevantTaxIncomeBase: data.monthlyIncome,
    },
    { new: true, upsert: true }
  );
  req.user.name = data.name;
  req.user.profession = data.profession;
  req.user.onboardingComplete = true;
  await req.user.save();
  res.json({ user: publicUser(req.user), profile });
});

export default router;
