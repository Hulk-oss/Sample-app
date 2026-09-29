import express from "express";
import Invoice from "../models/Invoice.js";
import { requireAuth } from "../middleware/auth.js";
import { parse, invoiceSchema } from "../utils/validate.js";
import { notFound } from "../utils/errors.js";

const router = express.Router();
router.use(requireAuth);

async function refreshStatuses(userId) {
  const now = new Date();
  await Invoice.updateMany(
    { userId, status: "Due", dueDate: { $lt: now } },
    { $set: { status: "Overdue" } }
  );
}

router.get("/", async (req, res) => {
  await refreshStatuses(req.user._id);
  const invoices = await Invoice.find({ userId: req.user._id }).sort({ dueDate: 1 }).lean();
  res.json({ invoices });
});

router.post("/", async (req, res) => {
  const data = parse(invoiceSchema, req.body);
  const status = data.status || (new Date(data.dueDate) < new Date() ? "Overdue" : "Due");
  const invoice = await Invoice.create({ ...data, status, userId: req.user._id });
  res.status(201).json({ invoice });
});

router.patch("/:id", async (req, res) => {
  const data = parse(invoiceSchema.partial(), req.body);
  const invoice = await Invoice.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    data,
    { new: true, runValidators: true }
  );
  if (!invoice) throw notFound("Invoice not found");
  res.json({ invoice });
});

router.post("/:id/mark-paid", async (req, res) => {
  const invoice = await Invoice.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { status: "Paid", paidAt: new Date() },
    { new: true }
  );
  if (!invoice) throw notFound("Invoice not found");
  res.json({ invoice });
});

router.post("/:id/reminder-draft", async (req, res) => {
  const invoice = await Invoice.findOne({ _id: req.params.id, userId: req.user._id }).lean();
  if (!invoice) throw notFound("Invoice not found");
  const draft = "Hi " + invoice.client + ",\n\nJust a quick follow-up on invoice " + invoice.invoiceNumber + " for ₹" + Math.round(invoice.amount).toLocaleString("en-IN") + ", due " + new Date(invoice.dueDate).toLocaleDateString("en-IN") + ".\n\nPlease let me know if you need anything from my side.\n\nThanks,\nAlex";
  res.json({ invoiceId: invoice._id, draft, sent: false });
});

router.delete("/:id", async (req, res) => {
  const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!invoice) throw notFound("Invoice not found");
  res.json({ deleted: true });
});

export default router;
