import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: "Community", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, trim: true },
    isAnonymous: { type: Boolean, default: false },

    // New fields
    type: { type: String, enum: ["text", "image", "file"], default: "text" },
    fileUrl: { type: String },
    replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
    reactions: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        emoji: String,
      },
    ],
    isDeleted: { type: Boolean, default: false },
    flagged: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
