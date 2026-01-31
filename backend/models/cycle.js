// backend/models/Cycle.js
import mongoose from "mongoose";
import { addDays } from "date-fns";

/**
 * Cycle model
 * - Validations for inputs
 * - Derived fields computed server-side (pre-validate)
 * - Persisted fertilityWindow for consistent UI & analytics
 * - Unique index per user + startDate to avoid duplicates
 */

/* --- Sub-schema: daily fertility window entry --- */
const FertilityWindowDaySchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    probability: { type: Number, required: true, min: 0, max: 100 },
    phase: { type: String, required: true, enum: ["low", "fertile", "ovulation"] },
  },
  { _id: false }
);

/* --- Main Cycle schema --- */
const CycleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // Core inputs (frontend should provide these)
    startDate: { type: Date, required: true },
    cycleLength: { type: Number, required: true, min: 20, max: 45, default: 28 },
    lutealPhaseLength: { type: Number, required: true, min: 10, max: 18, default: 14 },
    menstrualDuration: { type: Number, required: true, min: 2, max: 10, default: 5 },

    // Derived / computed fields
    ovulationDate: { type: Date },
    fertileStart: { type: Date },
    fertileEnd: { type: Date },
    nextPeriod: { type: Date },
    menstrualEnd: { type: Date },
    pregnancyTestDate: { type: Date },

    // Fertility window persisted for consistency across UI components
    fertilityWindow: { type: [FertilityWindowDaySchema], default: [] },

    // snapshot of symptoms recorded when this cycle was created (optional)
    symptoms: {
      cramps: { type: Boolean, default: false },
      headaches: { type: Boolean, default: false },
      moodSwings: { type: Boolean, default: false },
      bloating: { type: Boolean, default: false },
      breastTenderness: { type: Boolean, default: false },
    },

    // optional link to a Pregnancy document (if a pregnancy is associated)
    isPregnancyConfirmed: { type: Boolean, default: false },
    pregnancy: { type: mongoose.Schema.Types.ObjectId, ref: "Pregnancy", default: null },

    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

/* --- Helper: map day offset relative to ovulation -> probability --- */
function _probabilityForOffset(offset) {
  // Conservative, explainable mapping; tweak later if you have clinical guidance or ML outputs
  const map = {
    "-6": 5,
    "-5": 20,
    "-4": 40,
    "-3": 60,
    "-2": 80,
    "-1": 95,
    "0": 100,
    "1": 50,
  };
  return Math.max(0, Math.min(100, map[String(offset)] ?? 0));
}

/* --- Instance method to (re)calculate derived fields deterministically --- */
CycleSchema.methods.recalculateDerived = function () {
  if (!this.startDate) throw new Error("startDate is required to calculate derived cycle fields");

  const start = new Date(this.startDate);
  const cycleLength = Number(this.cycleLength ?? 28);
  const luteal = Number(this.lutealPhaseLength ?? 14);
  const menstrualDuration = Number(this.menstrualDuration ?? 5);

  // ovulation = startDate + (cycleLength - lutealPhaseLength)
  const ovulationDate = addDays(start, cycleLength - luteal);
  this.ovulationDate = ovulationDate;

  // fertile window: typically ovulation -4 days through +1 day
  this.fertileStart = addDays(ovulationDate, -4);
  this.fertileEnd = addDays(ovulationDate, 1);

  // next period = startDate + cycleLength
  this.nextPeriod = addDays(start, cycleLength);

  // menstrualEnd = startDate + (menstrualDuration - 1)
  this.menstrualEnd = addDays(start, Math.max(0, menstrualDuration - 1));

  // pregnancy test suggested date: ovulation + ~14 days
  this.pregnancyTestDate = addDays(ovulationDate, 14);

  // build fertilityWindow entries for offsets -6 .. +1 (inclusive)
  const window = [];
  for (let i = -6; i <= 1; i++) {
    window.push({
      date: addDays(ovulationDate, i),
      probability: _probabilityForOffset(i),
      phase: i === 0 ? "ovulation" : i >= -4 && i <= 1 ? "fertile" : "low",
    });
  }
  this.fertilityWindow = window;
};

/* --- Pre-validate hook: normalize and compute derived fields --- */
CycleSchema.pre("validate", function (next) {
  // Normalize startDate to Date object (if string passed)
  if (this.startDate) this.startDate = new Date(this.startDate);

  // Defensive validation (mongoose validators will also run)
  if (this.cycleLength < 20 || this.cycleLength > 45)
    return next(new Error("cycleLength must be between 20 and 45 days"));
  if (this.lutealPhaseLength < 10 || this.lutealPhaseLength > 18)
    return next(new Error("lutealPhaseLength must be between 10 and 18 days"));
  if (this.menstrualDuration < 2 || this.menstrualDuration > 10)
    return next(new Error("menstrualDuration must be between 2 and 10 days"));

  try {
    this.recalculateDerived();
    next();
  } catch (err) {
    next(err);
  }
});

/* --- Indexes --- */
// unique per user + startDate (one cycle per start date)
CycleSchema.index({ user: 1, startDate: 1 }, { unique: true });

/* --- Clean JSON output for API responses --- */
CycleSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

// defensive export for dev hot-reload & serverless environments
const Cycle = mongoose.models?.Cycle || mongoose.model("Cycle", CycleSchema);
export default Cycle;
