import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true }, // optional
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: "Community", required: true }, // tagged community
    
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // engagement
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // discussion

    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },

    // Media section
    media: [
      {
        url: { type: String, required: true }, // path or CDN URL
        type: { type: String, enum: ["image", "video"], default: "image" }, // media type
      }
    ],
  },
  { timestamps: true }
);

// Middleware (sync counters automatically before save)
PostSchema.pre("save", function (next) {
  this.likeCount = this.likes.length;
  this.commentCount = this.comments.length;
  next();
});

export default mongoose.model("Post", PostSchema);
