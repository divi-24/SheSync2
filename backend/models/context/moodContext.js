/**
 * MoodContext Model
 */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const MoodContextSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        date: { type: Date, required: true },
        mood: { type: String },
        triggers: [{ type: String }],
        notes: { type: String },
        isAnonymous: { type: Boolean, default: false },
    },
    { timestamps: true }
);

MoodContextSchema.index({ user: 1, date: 1 });

MoodContextSchema.set('toJSON', { transform: (_, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } });

const MoodContext = mongoose.models.MoodContext || mongoose.model('MoodContext', MoodContextSchema);
export default MoodContext;
