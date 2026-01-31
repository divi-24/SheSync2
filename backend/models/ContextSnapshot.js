import mongoose from 'mongoose';

// ContextSnapshot: stores the latest aggregated context per user with a stable hash
const ContextSnapshotSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true, unique: true },
        // Aggregated JSON of the user's context
        context: { type: mongoose.Schema.Types.Mixed, required: true },
        // Stable SHA256 hash computed from a canonicalized version of context
        hash: { type: String, required: true, index: true },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

ContextSnapshotSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

// Helpful compound index for queries by user and recency
ContextSnapshotSchema.index({ userId: 1, updatedAt: -1 });

const ContextSnapshot =
    mongoose.models?.ContextSnapshot || mongoose.model('ContextSnapshot', ContextSnapshotSchema);
export default ContextSnapshot;
