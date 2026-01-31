import mongoose from "mongoose";

const CommunitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true }, // e.g. womens-health
    description: { type: String, trim: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who created it
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // track joined users
    
    // Activity counters
    postCount: { type: Number, default: 0 },
    messageCount: { type: Number, default: 0 }, // if we decide communities have chatrooms
  },
  { timestamps: true }
);

export default mongoose.model("Community", CommunitySchema);
