import mongoose from "mongoose";

const GlobalMessageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, trim: true },
    isAnonymous: { type: Boolean, default: false },
    mediaUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("GlobalMessage", GlobalMessageSchema);
