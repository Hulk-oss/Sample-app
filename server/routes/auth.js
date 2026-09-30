import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import rateLimit from "express-rate-limit";
import User from "../models/User.js";
import FinancialProfile from "../models/FinancialProfile.js";
import Company from "../models/Company.js";
import CompanyInvite from "../models/CompanyInvite.js";
import { env } from "../config.js";
import { requireAuth } from "../middleware/auth.js";
import { parse, loginSchema, onboardingSchema, resetPasswordSchema, resetRequestSchema, signupSchema, companySignupSchema } from "../utils/validate.js";
import { conflict, serviceUnavailable, unauthorized, validation } from "../utils/errors.js";

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 25,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: {
        code: "TOO_MANY_REQUESTS",
        message: "Too many authentication attempts. Please try again after 15 minutes."
      }
    });
  }
});

function issueToken(user) {
  try {
    if (!env.jwtSecret) throw new Error("JWT_SECRET is missing.");
    return jwt.sign({ sub: user._id.toString(), email: user.email }, String(env.jwtSecret), { expiresIn: env.jwtExpiresIn });
  } catch (error) {
    console.error("JWT issue failed", error);
    throw serviceUnavailable("Authentication service is not configured correctly.", "AUTH_SERVICE_UNAVAILABLE");
  }
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
    lastLoginAt: user.lastLoginAt,
  };
}

router.post("/signup", authLimiter, async (req, res) => {
  const data = parse(signupSchema, req.body);
  const exists = await User.findOne({ email: data.email.toLowerCase() });
  if (exists) throw conflict("An account with that email already exists.", "USER_ALREADY_EXISTS");

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
    if (!invite) throw validation("That company invitation is invalid or expired.", { code: "INVALID_INVITE_TOKEN" });
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

router.post("/login", authLimiter, async (req, res) => {
  const data = parse(loginSchema, req.body);
  const user = await User.findOne({ email: data.email.toLowerCase() });
  if (!user) {
    throw unauthorized("Email or password is incorrect", "INVALID_CREDENTIALS");
  }

  let passwordMatches = false;
  try {
    passwordMatches = await bcrypt.compare(data.password, user.passwordHash);
  } catch (error) {
    console.error("Password verification failed", error);
  }

  if (!passwordMatches) {
    throw unauthorized("Email or password is incorrect", "INVALID_CREDENTIALS");
  }

  if (env.platformOwnerEmail && user.email === env.platformOwnerEmail) {
    user.role = "platform_owner";
  }

  const token = issueToken(user);

  User.updateOne(
    { _id: user._id },
    {
      $set: {
        lastLoginAt: new Date(),
        ...(env.platformOwnerEmail && user.email === env.platformOwnerEmail
          ? { role: "platform_owner" }
          : {}),
      },
    }
  ).catch(error => console.error("Login activity update failed", error));

  res.json({ token, user: publicUser(user) });
});

router.post("/company-signup", authLimiter, async (req, res) => {
  const data = parse(companySignupSchema, req.body);
  const exists = await User.findOne({ email: data.email.toLowerCase() });
  if (exists) throw conflict("An account with that email already exists.", "USER_ALREADY_EXISTS");

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

router.post("/forgot-password", authLimiter, async (req, res) => {
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

router.post("/reset-password", authLimiter, async (req, res) => {
  const data = parse(resetPasswordSchema, req.body);
  const tokenHash = crypto.createHash("sha256").update(data.token).digest("hex");
  const user = await User.findOne({
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpiresAt: { $gt: new Date() },
  });
  if (!user) throw validation("The reset token is invalid or expired.", { code: "INVALID_RESET_TOKEN" });
  user.passwordHash = await bcrypt.hash(data.password, 12);
  user.resetPasswordTokenHash = null;
  user.resetPasswordExpiresAt = null;
  await user.save();
  res.json({ message: "Password updated. You can log in with the new password." });
});

router.get("/me", requireAuth, async (req, res) => {
  const [profile, company] = await Promise.all([
    FinancialProfile.findOne({ userId: req.user._id }).lean(),
    req.user.companyId ? Company.findById(req.user.companyId).select("name plan seatLimit status").lean() : null,
  ]);
  res.json({ user: publicUser(req.user), profile, company });
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
