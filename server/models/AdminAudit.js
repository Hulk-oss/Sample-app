import mongoose from "mongoose";

const adminAuditSchema = new mongoose.Schema({
  actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  action: { type: String, required: true, trim: true, maxlength: 120 },
  targetType: { type: String, required: true, trim: true, maxlength: 80 },
  targetId: { type: String, default: "", trim: true, maxlength: 120 },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.model("AdminAudit", adminAuditSchema);
