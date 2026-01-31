/**
 * GoalContext Model
 */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const GoalContextSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        goalType: { type: String },
        targetDate: { type: Date },
        description: { type: String },
        status: { type: String, enum: ['pending', 'achieved'], default: 'pending' },
        isAnonymous: { type: Boolean, default: false },
    },
    { timestamps: true }
);

GoalContextSchema.set('toJSON', { transform: (_, ret) => { ret.id = ret._id; delete ret._id; delete ret.__v; return ret; } });

const GoalContext = mongoose.models.GoalContext || mongoose.model('GoalContext', GoalContextSchema);
export default GoalContext;
