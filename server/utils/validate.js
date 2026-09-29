import { z } from "zod";
import { validation } from "./errors.js";

export const signupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(100),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(100),
});

export const resetRequestSchema = z.object({
  email: z.string().trim().email().max(160),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(100),
});

export const onboardingSchema = z.object({
  name: z.string().trim().min(2).max(80),
  profession: z.string().trim().min(2).max(100),
  monthlyIncome: z.number().nonnegative(),
  monthlyExpenses: z.number().nonnegative(),
  currentCash: z.number().nonnegative(),
  taxReserveRate: z.number().min(0).max(1),
  emergencyReserveTarget: z.number().nonnegative(),
  monthlyIncomeGoal: z.number().nonnegative(),
});

export const transactionSchema = z.object({
  date: z.coerce.date(),
  description: z.string().trim().min(1).max(160),
  client: z.string().trim().max(100).optional().default(""),
  category: z.string().trim().min(1).max(80),
  type: z.enum(["Income", "Expense"]),
  amount: z.number().positive(),
});

export const invoiceSchema = z.object({
  invoiceNumber: z.string().trim().min(1).max(40),
  client: z.string().trim().min(1).max(100),
  amount: z.number().positive(),
  issueDate: z.coerce.date(),
  dueDate: z.coerce.date(),
  status: z.enum(["Paid", "Due", "Overdue"]).optional(),
});

export const profileSchema = z.object({
  profession: z.string().trim().max(100).optional(),
  monthlyIncomeGoal: z.number().nonnegative().optional(),
  monthlyExpensesBaseline: z.number().nonnegative().optional(),
  taxReserveRate: z.number().min(0).max(1).optional(),
  emergencyReserveTarget: z.number().nonnegative().optional(),
  taxReservedAmount: z.number().nonnegative().optional(),
  relevantTaxIncomeBase: z.number().nonnegative().optional(),
});

export function parse(schema, value) {
  const result = schema.safeParse(value);
  if (!result.success) {
    throw validation("Please check the submitted fields.", result.error.flatten());
  }
  return result.data;
}
