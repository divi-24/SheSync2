import mongoose from "mongoose";

/**
 * Symptoms model
 * - Tracks user symptoms daily (per date)
 * - Booleans for presence + severity scale (0–5)
 * - Optional notes for qualitative info
 * - Unique index: one record per user per day
 */

const SymptomsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // Each entry belongs to a specific day
    date: { type: Date, required: true },

    // Array of symptoms (new format)
    symptoms: [{ type: String }],

    // Symptom severities map (new format)
    symptomSeverities: {
      type: Map,
      of: String,
      default: new Map(),
    },

    // Cycle day (1-28, helps with pattern analysis)
    cycleDay: { type: Number, min: 1, max: 28, default: null },

    // Mood and sleep tracking
    moodTypes: [{ type: String }],
    moodSeverity: { type: String },
    sleepDuration: { type: Number },
    sleepQuality: { type: String },

    // Legacy fields for backward compatibility
    cramps: { type: Boolean, default: false },
    headaches: { type: Boolean, default: false },
    moodSwings: { type: Boolean, default: false },
    bloating: { type: Boolean, default: false },
    breastTenderness: { type: Boolean, default: false },

    // Symptom severities (0 = none, 5 = severe)
    severity: {
      cramps: { type: Number, min: 0, max: 5, default: 0 },
      headaches: { type: Number, min: 0, max: 5, default: 0 },
      moodSwings: { type: Number, min: 0, max: 5, default: 0 },
      bloating: { type: Number, min: 0, max: 5, default: 0 },
      breastTenderness: { type: Number, min: 0, max: 5, default: 0 },
    },

    // Free text for anything not captured above
    notes: { type: String, trim: true, maxlength: 500 },
  },
  { timestamps: true }
);

/* --- Index: one entry per user per day --- */
SymptomsSchema.index({ user: 1, date: 1 }, { unique: true });

/* --- Clean JSON output --- */
SymptomsSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

/* --- Defensive export --- */
const Symptoms = mongoose.models?.Symptoms || mongoose.model("Symptoms", SymptomsSchema);
export default Symptoms;
