/**
 * SymptomContext Model
 * Daily symptom snapshot; some fields encrypted for privacy.
 */
import mongoose from 'mongoose';
import { encrypt, decrypt } from '../../utils/encryptor.js';

const { Schema } = mongoose;

const SymptomContextSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        date: { type: Date, required: true },
        symptoms: [{ type: String }],
        severity: { type: String, enum: ['mild', 'moderate', 'severe'] },
        notes: { type: String },
        isEncrypted: { type: Boolean, default: true },
        isAnonymous: { type: Boolean, default: false },
    },
    { timestamps: true }
);

SymptomContextSchema.index({ user: 1, date: 1 }, { unique: true });

const FIELDS_TO_ENCRYPT = ['notes'];

SymptomContextSchema.pre('save', function (next) {
    if (!this.isEncrypted) return next();
    try {
        FIELDS_TO_ENCRYPT.forEach((field) => {
            if (this[field] && !String(this[field]).includes(':')) {
                this[field] = encrypt(this[field]);
            }
        });
        next();
    } catch (err) { next(err); }
});

SymptomContextSchema.methods.toSanitizedJSON = function (includeDecrypted = false) {
    const obj = this.toObject();
    obj.id = obj._id; delete obj._id; delete obj.__v;
    if (obj.isEncrypted && !includeDecrypted) {
        FIELDS_TO_ENCRYPT.forEach((f) => delete obj[f]);
    } else if (includeDecrypted) {
        FIELDS_TO_ENCRYPT.forEach((f) => { if (obj[f]) obj[f] = decrypt(obj[f]); });
    }
    return obj;
};

const SymptomContext = mongoose.models.SymptomContext || mongoose.model('SymptomContext', SymptomContextSchema);
export default SymptomContext;
