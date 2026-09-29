import express from "express";
import crypto from "crypto";
import User from "../models/User.js";
import CompanyInvite from "../models/CompanyInvite.js";
import { requireAuth } from "../middleware/auth.js";
import { requireCompanyAdmin } from "../middleware/company.js";
import { parse, companyInviteSchema } from "../utils/validate.js";
import { validation, notFound } from "../utils/errors.js";
import { getCompanyPlan } from "../pricing.js";

const router = express.Router();
router.use(requireAuth, requireCompanyAdmin);

router.get("/overview", async (req, res) => {
  const [members, pendingInvites] = await Promise.all([
    User.find({ companyId: req.company._id, role: "user" })
      .select("name email profession onboardingComplete createdAt lastLoginAt")
      .sort({ createdAt: -1 })
      .lean(),
    CompanyInvite.find({ companyId: req.company._id, status: "pending", expiresAt: { $gt: new Date() } })
      .select("email expiresAt createdAt")
      .sort({ createdAt: -1 })
      .lean(),
  ]);

  const onboarded = members.filter(member => member.onboardingComplete).length;
  res.json({
    company: {
      id: req.company._id,
      name: req.company.name,
      plan: req.company.plan,
      seatLimit: req.company.seatLimit,
      status: req.company.status,
      features: getCompanyPlan(req.company).features,
    },
    metrics: {
      totalUsers: members.length,
      onboardedUsers: onboarded,
      pendingInvites: pendingInvites.length,
      availableSeats: Math.max(0, req.company.seatLimit - members.length),
    },
    members,
    pendingInvites,
  });
});

router.post("/invites", async (req, res) => {
  const data = parse(companyInviteSchema, req.body);
  const email = data.email.toLowerCase();
  const existingMember = await User.findOne({ companyId: req.company._id, email });
  if (existingMember) throw validation("That user is already part of the company.");

  const activeInvite = await CompanyInvite.findOne({
    companyId: req.company._id,
    email,
    status: "pending",
    expiresAt: { $gt: new Date() },
  });
  if (activeInvite) throw validation("An active invitation already exists for this email.");

  const memberCount = await User.countDocuments({ companyId: req.company._id, role: "user" });
  if (memberCount >= req.company.seatLimit) throw validation("Your current plan has reached its seat limit.");

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const invite = await CompanyInvite.create({
    companyId: req.company._id,
    email,
    invitedBy: req.user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.status(201).json({
    invite: {
      id: invite._id,
      email,
      expiresAt: invite.expiresAt,
      accepted: false,
      inviteToken: rawToken,
      inviteUrl: "/?invite=" + rawToken,
    },
  });
});

router.delete("/invites/:id", async (req, res) => {
  const invite = await CompanyInvite.findOneAndUpdate(
    { _id: req.params.id, companyId: req.company._id, status: "pending" },
    { status: "revoked" },
    { new: true }
  );
  if (!invite) throw notFound("Invitation not found");
  res.json({ revoked: true });
});

router.patch("/profile", async (req, res) => {
  const name = String(req.body?.name || "").trim();
  if (name.length < 2 || name.length > 120) throw validation("Company name must be between 2 and 120 characters.");
  req.company.name = name;
  await req.company.save();
  res.json({ company: { id: req.company._id, name: req.company.name, plan: req.company.plan, seatLimit: req.company.seatLimit } });
});

router.delete("/members/:id", async (req, res) => {
  const member = await User.findOne({ _id: req.params.id, companyId: req.company._id, role: "user" });
  if (!member) throw notFound("Company member not found");
  member.companyId = null;
  await member.save();
  res.json({ removed: true });
});

export default router;
