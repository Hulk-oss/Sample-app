import mongoose from "mongoose";
const financialProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true, index: true },
  monthlyIncomeGoal: { type: Number, min: 0, default: 300000 },
  monthlyExpensesBaseline: { type: Number, min: 0, default: 176000 },
  taxReserveRate: { type: Number, min: 0, max: 1, default: 0.22 },
  emergencyReserveTarget: { type: Number, min: 0, default: 150000 },
  openingCashBalance: { type: Number, min: 0, default: 451300 },
  taxReservedAmount: { type: Number, min: 0, default: 145000 },
  relevantTaxIncomeBase: { type: Number, min: 0, default: 659091 }
}, { timestamps: true });
export default mongoose.model("FinancialProfile", financialProfileSchema);
