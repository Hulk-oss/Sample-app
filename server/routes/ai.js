import express from "express";
import AIConversation from "../models/AIConversation.js";
import Transaction from "../models/Transaction.js";
import Invoice from "../models/Invoice.js";
import FinancialProfile from "../models/FinancialProfile.js";
import { requireAuth } from "../middleware/auth.js";
import { requireUserPortal } from "../middleware/user.js";
import { validation } from "../utils/errors.js";
import { requireUserFeature } from "../middleware/plans.js";
import { calculateDashboard, explainQuestion } from "../finance/engine.js";

const router = express.Router();
router.use(requireAuth, requireUserPortal);

router.post("/ask", requireUserFeature("aiCfo"), async (req, res) => {
  const question = String(req.body?.question || "").trim();
  if (!question || question.length > 500) throw validation("Enter a question up to 500 characters.");
  const [profile, transactions, invoices] = await Promise.all([
    FinancialProfile.findOne({ userId: req.user._id }).lean(),
    Transaction.find({ userId: req.user._id }).lean(),
    Invoice.find({ userId: req.user._id }).lean(),
  ]);
  const finance = calculateDashboard({ profile, transactions, invoices });
  const response = explainQuestion(question, finance, invoices);
  await AIConversation.create({
    userId: req.user._id,
    question,
    calculationContext: finance,
    response,
    estimated: true,
  });
  res.json({ response, context: finance, estimated: true });
});

router.get("/history", requireUserFeature("aiCfo"), async (req, res) => {
  const conversations = await AIConversation.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30)
    .lean();
  res.json({ conversations });
});

export default router;
