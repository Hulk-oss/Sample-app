import mongoose from "mongoose";
const invoiceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  invoiceNumber: { type: String, required: true, trim: true, maxlength: 40 },
  client: { type: String, required: true, trim: true, maxlength: 100 },
  amount: { type: Number, required: true, min: 0.01 },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ["Paid", "Due", "Overdue"], default: "Due" },
  paidAt: { type: Date, default: null }
}, { timestamps: true });
invoiceSchema.index({ userId: 1, dueDate: 1 });
export default mongoose.model("Invoice", invoiceSchema);
