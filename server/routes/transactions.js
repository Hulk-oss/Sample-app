import express from "express";
import Transaction from "../models/Transaction.js";
import { requireAuth } from "../middleware/auth.js";
import { parse, transactionSchema } from "../utils/validate.js";
import { notFound } from "../utils/errors.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", async (req, res) => {
  const { type, category, from, to, q } = req.query;
  const filter = { userId: req.user._id };
  if (type && ["Income", "Expense"].includes(type)) filter.type = type;
  if (category) filter.category = category;
  if (from || to) filter.date = {};
  if (from) filter.date.$gte = new Date(from);
  if (to) filter.date.$lte = new Date(to);
  if (q) {
    filter.$or = [
      { description: { $regex: q, $options: "i" } },
      { client: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } },
    ];
  }
  const rows = await Transaction.find(filter).sort({ date: -1, createdAt: -1 }).lean();
  res.json({ transactions: rows });
});

router.post("/", async (req, res) => {
  const data = parse(transactionSchema, req.body);
  const transaction = await Transaction.create({ ...data, userId: req.user._id });
  res.status(201).json({ transaction });
});

router.patch("/:id", async (req, res) => {
  const data = parse(transactionSchema.partial(), req.body);
  const transaction = await Transaction.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    data,
    { new: true, runValidators: true }
  );
  if (!transaction) throw notFound("Transaction not found");
  res.json({ transaction });
});

router.delete("/:id", async (req, res) => {
  const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!transaction) throw notFound("Transaction not found");
  res.json({ deleted: true });
});

export default router;
