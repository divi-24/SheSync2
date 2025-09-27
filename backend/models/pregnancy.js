// backend/models/Pregnancy.js
import mongoose from "mongoose";

/**
 * Pregnancy (Gestation) model
 * - Tracks gestational info & milestones
 * - One active pregnancy per user at a time
 * - Linked to Cycle where conception occurred
 */

const MilestoneSchema = new mongoose.Schema(
  {
    week: { type: Number, required: true },
    milestone: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
  },
  { _id: false }
);

const PregnancySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

    // optional: link to the Cycle where conception was predicted/confirmed
    cycle: { type: mongoose.Schema.Types.ObjectId, ref: "Cycle", default: null },

    gestationalAge: { type: String }, // e.g. "12 weeks, 3 days"
    dueDate: { type: Date, required: true },

    // trimester info (dates or textual descriptions)
    currentTrimester: { type: Number, enum: [1, 2, 3], required: true },
    firstTrimester: { type: String },  // e.g., "Week 1–12"
    secondTrimester: { type: String }, // e.g., "Week 13–27"
    thirdTrimester: { type: String },  // e.g., "Week 28–40"

    // milestone events (like “heartbeat detected”, “first kick”, etc.)
    milestones: { type: [MilestoneSchema], default: [] },

    // derived values
    daysUntilDue: { type: Number },

    // optional baby growth metrics
    babySize: { type: String },   // e.g., "Avocado"
    babyWeight: { type: String }, // e.g., "150g"

    // educational / health tips per week
    weeklyTips: [{ type: String }],

    // optional extra info
    conceptionDate: { type: Date },

    // status
    active: { type: Boolean, default: true }, // allows archiving past pregnancies
  },
  { timestamps: true }
);

/* --- Index: only one active pregnancy per user --- */
PregnancySchema.index({ user: 1, active: 1 });

/* --- Clean JSON output --- */
PregnancySchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

/* --- Export --- */
const Pregnancy = mongoose.models?.Pregnancy || mongoose.model("Pregnancy", PregnancySchema);
export default Pregnancy;
