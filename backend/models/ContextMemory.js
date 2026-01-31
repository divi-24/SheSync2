import mongoose from 'mongoose';

// ContextMemory: compressed, human-readable summaries with vector embeddings
const ContextMemorySchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        summaryText: { type: String, required: true, maxlength: 2500 },
        // Embedding as numeric vector. For Atlas Vector Search, prefer fixed length float arrays.
        embedding: { type: [Number], required: true, index: false },
        createdAt: { type: Date, default: Date.now, index: true },
        // Optional metadata for auditing
        meta: {
            sourceHash: { type: String, index: true },
            stats: { type: mongoose.Schema.Types.Mixed },
        },
    },
    { timestamps: true }
);

// Helpful compound indexes
ContextMemorySchema.index({ userId: 1, createdAt: -1 });

const ContextMemory =
    mongoose.models?.ContextMemory || mongoose.model('ContextMemory', ContextMemorySchema);
export default ContextMemory;
