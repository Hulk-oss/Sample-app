import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  ownerUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  plan: { type: String, enum: ["starter", "growth", "scale"], default: "starter" },
  status: { type: String, enum: ["active", "suspended"], default: "active" },
  seatLimit: { type: Number, min: 1, default: 5 }
}, { timestamps: true });

export default mongoose.model("Company", companySchema);
