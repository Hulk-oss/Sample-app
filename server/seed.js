import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "./config.js";
import User from "./models/User.js";
import FinancialProfile from "./models/FinancialProfile.js";
import Transaction from "./models/Transaction.js";
import Invoice from "./models/Invoice.js";

const email = "demo@freelancercfo.local";

const transactions = [
  { date: "2026-07-08", description: "July retainer", client: "Acme Labs", category: "Client income", type: "Income", amount: 310000 },
  { date: "2026-07-15", description: "Workspace", client: "", category: "Operations", type: "Expense", amount: 18000 },
  { date: "2026-07-18", description: "Contractor support", client: "", category: "Contractors", type: "Expense", amount: 42000 },
  { date: "2026-07-20", description: "Software stack", client: "", category: "Software", type: "Expense", amount: 12400 },
  { date: "2026-07-25", description: "Travel", client: "", category: "Travel", type: "Expense", amount: 35600 },
  { date: "2026-07-29", description: "August retainer", client: "Northstar", category: "Client income", type: "Income", amount: 382000 },
  { date: "2026-08-06", description: "Workspace", client: "", category: "Operations", type: "Expense", amount: 18000 },
  { date: "2026-08-12", description: "Software stack", client: "", category: "Software", type: "Expense", amount: 12400 },
  { date: "2026-08-19", description: "Contractor support", client: "", category: "Contractors", type: "Expense", amount: 42000 },
  { date: "2026-08-24", description: "Professional services", client: "", category: "Professional", type: "Expense", amount: 73600 },
  { date: "2026-09-28", description: "Acme Labs — Retainer", client: "Acme Labs", category: "Client income", type: "Income", amount: 180000 },
  { date: "2026-09-26", description: "Workspace", client: "", category: "Operations", type: "Expense", amount: 18000 },
  { date: "2026-09-24", description: "Northstar — Brand sprint", client: "Northstar", category: "Client income", type: "Income", amount: 95000 },
  { date: "2026-09-22", description: "Software subscriptions", client: "", category: "Software", type: "Expense", amount: 12400 },
  { date: "2026-09-19", description: "Cloud hosting", client: "", category: "Software", type: "Expense", amount: 8600 },
  { date: "2026-09-15", description: "Brightside — UX audit", client: "Brightside", category: "Client income", type: "Income", amount: 72000 },
  { date: "2026-09-12", description: "Travel & client meeting", client: "", category: "Travel", type: "Expense", amount: 9800 },
  { date: "2026-09-07", description: "Accounting", client: "", category: "Professional", type: "Expense", amount: 7500 },
  { date: "2026-10-01", description: "Workspace", client: "", category: "Operations", type: "Expense", amount: 18000 },
  { date: "2026-10-04", description: "Software stack", client: "", category: "Software", type: "Expense", amount: 12400 },
  { date: "2026-10-11", description: "Contractor", client: "", category: "Contractors", type: "Expense", amount: 42000 },
  { date: "2026-10-15", description: "Accounting", client: "", category: "Professional", type: "Expense", amount: 7500 },
  { date: "2026-10-20", description: "Equipment replacement", client: "", category: "Equipment", type: "Expense", amount: 35100 },
];

const invoices = [
  { invoiceNumber: "INV-1042", client: "Acme Labs", amount: 120000, issueDate: "2026-08-25", dueDate: "2026-09-10", status: "Overdue" },
  { invoiceNumber: "INV-1043", client: "Northstar", amount: 110000, issueDate: "2026-09-03", dueDate: "2026-10-03", status: "Due" },
  { invoiceNumber: "INV-1038", client: "Brightside", amount: 72000, issueDate: "2026-08-01", dueDate: "2026-08-31", status: "Paid", paidAt: "2026-08-30" },
  { invoiceNumber: "INV-1044", client: "Atlas Studio", amount: 55000, issueDate: "2026-09-08", dueDate: "2026-09-22", status: "Overdue" },
  { invoiceNumber: "INV-1045", client: "Kiteworks", amount: 35000, issueDate: "2026-09-17", dueDate: "2026-09-24", status: "Overdue" },
];

await mongoose.connect(env.mongoUri);

let user = await User.findOne({ email });
if (!user) {
  user = await User.create({
    name: "Alex Morgan",
    email,
    passwordHash: await bcrypt.hash(env.demoPassword, 12),
    profession: "Independent Product Designer",
    onboardingComplete: true,
  });
} else {
  await Promise.all([
    Transaction.deleteMany({ userId: user._id }),
    Invoice.deleteMany({ userId: user._id }),
  ]);
}

await FinancialProfile.findOneAndUpdate(
  { userId: user._id },
  {
    monthlyIncomeGoal: 300000,
    monthlyExpensesBaseline: 176000,
    taxReserveRate: 0.22,
    emergencyReserveTarget: 150000,
    openingCashBalance: 13300,
    taxReservedAmount: 145000,
    relevantTaxIncomeBase: 659091,
  },
  { upsert: true, new: true }
);

await Transaction.insertMany(transactions.map(x => ({ ...x, userId: user._id })));
await Invoice.insertMany(invoices.map(x => ({ ...x, userId: user._id })));

console.log("Demo data seeded for " + email);
await mongoose.disconnect();
