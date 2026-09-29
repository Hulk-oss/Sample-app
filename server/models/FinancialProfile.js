import mongoose from "mongoose";

const financialProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true, index: true },
  monthlyIncomeGoal: { type: Number, min: 0, required: true },
  monthlyExpensesBaseline: { type: Number, min: 0, required: true },
  taxReserveRate: { type: Number, min: 0, max: 1, required: true },
  emergencyReserveTarget: { type: Number, min: 0, required: true },
  openingCashBalance: { type: Number, min: 0, required: true },
  taxReservedAmount: { type: Number, min: 0, default: 0 },
  relevantTaxIncomeBase: { type: Number, min: 0, required: true }
}, { timestamps: true });

export default mongoose.model("FinancialProfile", financialProfileSchema);
