import mongoose from "mongoose";

const companyInviteSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true, index: true },
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tokenHash: { type: String, required: true, unique: true, index: true },
  expiresAt: { type: Date, required: true, index: true },
  status: { type: String, enum: ["pending", "accepted", "revoked"], default: "pending" }
}, { timestamps: true });

export default mongoose.model("CompanyInvite", companyInviteSchema);
