/**
 * UserContext Model
 * One-per-user document storing preferences & AI consent flags.
 */
import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserContextSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
        preferences: {
            language: { type: String, default: 'en' },
            theme: { type: String, default: 'system' },
        },
        lastActive: { type: Date, default: Date.now },
        aiConsent: { type: Boolean, default: false },
        isAnonymous: { type: Boolean, default: false },
    },
    { timestamps: true }
);

UserContextSchema.set('toJSON', {
    transform: (_, ret) => {
        ret.id = ret._id; delete ret._id; delete ret.__v; return ret;
    }
});

const UserContext = mongoose.models.UserContext || mongoose.model('UserContext', UserContextSchema);
export default UserContext;
