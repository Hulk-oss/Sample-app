import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  profession: { type: String, default: "", trim: true, maxlength: 100 },
  onboardingComplete: { type: Boolean, default: false },
  resetPasswordTokenHash: { type: String, default: null },
  resetPasswordExpiresAt: { type: Date, default: null }
}, { timestamps: true });
export default mongoose.model("User", userSchema);
