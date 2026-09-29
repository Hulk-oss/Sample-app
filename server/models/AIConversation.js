import mongoose from "mongoose";
const aiConversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  question: { type: String, required: true, maxlength: 500 },
  calculationContext: { type: Object, required: true },
  response: { type: Object, required: true },
  estimated: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model("AIConversation", aiConversationSchema);
