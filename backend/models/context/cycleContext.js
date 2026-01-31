/**
 * CycleContext Model
 * Stores cycle timing and notes; sensitive fields encrypted.
 */
import mongoose from 'mongoose';
import { encrypt, decrypt } from '../../utils/encryptor.js';

const { Schema } = mongoose;

const CycleContextSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        cycleStart: { type: Date },
        cycleLength: { type: Number },
        ovulationDate: { type: Date },
        nextExpectedPeriod: { type: Date },
        notes: { type: String },
        isEncrypted: { type: Boolean, default: true },
        isAnonymous: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Fields we want to encrypt (store as ciphertext strings)
const FIELDS_TO_ENCRYPT = ['notes'];

CycleContextSchema.pre('save', function (next) {
    if (!this.isEncrypted) return next();
    try {
        FIELDS_TO_ENCRYPT.forEach((field) => {
            if (this[field] && !String(this[field]).includes(':')) {
                this[field] = encrypt(this[field]);
            }
        });
        next();
    } catch (err) {
        next(err);
    }
});

CycleContextSchema.methods.toSanitizedJSON = function (includeDecrypted = false) {
    const obj = this.toObject({ virtuals: false });
    obj.id = obj._id; delete obj._id; delete obj.__v;
    if (obj.isEncrypted && !includeDecrypted) {
        FIELDS_TO_ENCRYPT.forEach((f) => delete obj[f]);
    } else if (includeDecrypted) {
        FIELDS_TO_ENCRYPT.forEach((f) => { if (obj[f]) obj[f] = decrypt(obj[f]); });
    }
    return obj;
};

const CycleContext = mongoose.models.CycleContext || mongoose.model('CycleContext', CycleContextSchema);
export default CycleContext;
