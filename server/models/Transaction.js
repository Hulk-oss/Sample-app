import mongoose from "mongoose";
const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  date: { type: Date, required: true },
  description: { type: String, required: true, trim: true, maxlength: 160 },
  client: { type: String, default: "", trim: true, maxlength: 100 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  type: { type: String, enum: ["Income", "Expense"], required: true },
  amount: { type: Number, required: true, min: 0.01 }
}, { timestamps: true });
transactionSchema.index({ userId: 1, date: -1 });
export default mongoose.model("Transaction", transactionSchema);
