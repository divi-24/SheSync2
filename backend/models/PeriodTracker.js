import mongoose from 'mongoose';

// Mood tracking sub-schema
const MoodTrackingSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    moodTypes: [{
        type: String,
        enum: ['Happy', 'Sad', 'Calm', 'Angry', 'Tired', 'Energized'],
        required: true
    }],
    intensity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        required: true
    },
    notes: {
        type: String,
        maxlength: 500,
        trim: true
    }
}, { _id: false });

// Symptom tracking sub-schema
const SymptomTrackingSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    symptoms: [{
        name: {
            type: String,
            enum: [
                'Lower Abdomen Cramps',
                'Back Pain',
                'Bloating',
                'Fatigue',
                'Headaches',
                'Nausea',
                'Sleep Disruption',
                'Digestive Issues'
            ],
            required: true
        },
        severity: {
            type: String,
            enum: ['none', 'mild', 'moderate', 'severe'],
            required: true
        }
    }],
    notes: {
        type: String,
        maxlength: 500,
        trim: true
    }
}, { _id: false });

// Sleep tracking sub-schema
const SleepTrackingSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    duration: {
        type: Number,
        required: true,
        min: 0,
        max: 24,
        validate: {
            validator: function (v) {
                return v >= 0 && v <= 24;
            },
            message: 'Sleep duration must be between 0 and 24 hours'
        }
    },
    quality: {
        type: String,
        enum: ['poor', 'fair', 'good', 'excellent'],
        required: true
    },
    notes: {
        type: String,
        maxlength: 300,
        trim: true
    }
}, { _id: false });

// Cycle information sub-schema
const CycleInfoSchema = new mongoose.Schema({
    cycleDuration: {
        type: Number,
        required: true,
        min: 15,
        max: 50,
        validate: {
            validator: function (v) {
                return Number.isInteger(v) && v >= 15 && v <= 50;
            },
            message: 'Cycle duration must be between 15 and 50 days'
        }
    },
    lastPeriodStart: {
        type: Date,
        required: true,
        validate: {
            validator: function (v) {
                return v <= new Date();
            },
            message: 'Last period start date cannot be in the future'
        }
    },
    lastPeriodDuration: {
        type: Number,
        required: true,
        min: 1,
        max: 15,
        validate: {
            validator: function (v) {
                return Number.isInteger(v) && v >= 1 && v <= 15;
            },
            message: 'Period duration must be between 1 and 15 days'
        }
    },
    nextPeriodPrediction: {
        type: Date,
        validate: {
            validator: function (v) {
                return !v || v >= new Date();
            },
            message: 'Next period prediction cannot be in the past'
        }
    },
    irregularCycle: {
        type: Boolean,
        default: false
    }
}, { _id: false });

// Main Period Tracker schema
const PeriodTrackerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    cycleInfo: {
        type: CycleInfoSchema,
        required: true
    },
    moodTracking: {
        type: [MoodTrackingSchema],
        validate: {
            validator: function (v) {
                return v.length <= 100; // Limit to 100 mood entries per tracker
            },
            message: 'Too many mood tracking entries'
        }
    },
    symptomTracking: {
        type: [SymptomTrackingSchema],
        validate: {
            validator: function (v) {
                return v.length <= 100; // Limit to 100 symptom entries per tracker
            },
            message: 'Too many symptom tracking entries'
        }
    },
    sleepTracking: {
        type: [SleepTrackingSchema],
        validate: {
            validator: function (v) {
                return v.length <= 100; // Limit to 100 sleep entries per tracker
            },
            message: 'Too many sleep tracking entries'
        }
    },
    healthTips: [{
        tip: {
            type: String,
            required: true,
            maxlength: 1000
        },
        category: {
            type: String,
            enum: ['cycle', 'symptoms', 'mood', 'sleep', 'general'],
            required: true
        },
        generated: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    privacy: {
        type: String,
        enum: ['private', 'shared_with_parent', 'shared_with_doctor'],
        default: 'private'
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
PeriodTrackerSchema.index({ userId: 1, createdAt: -1 });
PeriodTrackerSchema.index({ userId: 1, isActive: 1 });
PeriodTrackerSchema.index({ 'cycleInfo.lastPeriodStart': -1 });
PeriodTrackerSchema.index({ 'cycleInfo.nextPeriodPrediction': 1 });

// Virtual for cycle length analysis
PeriodTrackerSchema.virtual('cycleAnalysis').get(function () {
    const duration = this.cycleInfo.cycleDuration;
    if (duration < 21) return 'short';
    if (duration > 35) return 'long';
    return 'normal';
});

// Virtual for period duration analysis
PeriodTrackerSchema.virtual('periodAnalysis').get(function () {
    const duration = this.cycleInfo.lastPeriodDuration;
    if (duration < 3) return 'short';
    if (duration > 7) return 'long';
    return 'normal';
});

// Virtual for days until next period
PeriodTrackerSchema.virtual('daysUntilNextPeriod').get(function () {
    if (!this.cycleInfo.nextPeriodPrediction) return null;

    const today = new Date();
    const nextPeriod = new Date(this.cycleInfo.nextPeriodPrediction);
    const diffTime = nextPeriod - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
});

// Pre-save middleware to update lastUpdated
PeriodTrackerSchema.pre('save', function (next) {
    this.lastUpdated = new Date();
    next();
});

// Pre-save middleware to calculate next period prediction if not provided
PeriodTrackerSchema.pre('save', function (next) {
    if (!this.cycleInfo.nextPeriodPrediction && this.cycleInfo.lastPeriodStart && this.cycleInfo.cycleDuration) {
        const lastPeriod = new Date(this.cycleInfo.lastPeriodStart);
        const nextPeriod = new Date(lastPeriod.getTime() + (this.cycleInfo.cycleDuration * 24 * 60 * 60 * 1000));
        this.cycleInfo.nextPeriodPrediction = nextPeriod;
    }
    next();
});

// Static method to get user's active tracker
PeriodTrackerSchema.statics.getActiveTracker = function (userId) {
    return this.findOne({ userId, isActive: true }).populate('userId', 'name email');
};

// Static method to get user's tracking history
PeriodTrackerSchema.statics.getTrackingHistory = function (userId, limit = 10) {
    return this.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name email');
};

// Instance method to add mood tracking
PeriodTrackerSchema.methods.addMoodTracking = function (moodData) {
    this.moodTracking.push(moodData);
    return this.save();
};

// Instance method to add symptom tracking
PeriodTrackerSchema.methods.addSymptomTracking = function (symptomData) {
    this.symptomTracking.push(symptomData);
    return this.save();
};

// Instance method to add sleep tracking
PeriodTrackerSchema.methods.addSleepTracking = function (sleepData) {
    this.sleepTracking.push(sleepData);
    return this.save();
};

// Instance method to generate health tips
PeriodTrackerSchema.methods.generateHealthTips = function () {
    const tips = [];

    // Cycle analysis tips
    const cycleAnalysis = this.cycleAnalysis;
    if (cycleAnalysis === 'short') {
        tips.push({
            tip: "Your cycle is shorter than average. Consider consulting with a healthcare professional to ensure everything is normal.",
            category: 'cycle'
        });
    } else if (cycleAnalysis === 'long') {
        tips.push({
            tip: "Your cycle is longer than average. This can be normal, but you may want to discuss it with your doctor.",
            category: 'cycle'
        });
    } else {
        tips.push({
            tip: "Your cycle length is within the normal range. Keep tracking to notice any changes.",
            category: 'cycle'
        });
    }

    // Period duration tips
    const periodAnalysis = this.periodAnalysis;
    if (periodAnalysis === 'long') {
        tips.push({
            tip: "Your period duration is longer than average. If this is consistent, consider discussing it with your healthcare provider.",
            category: 'cycle'
        });
    } else if (periodAnalysis === 'short') {
        tips.push({
            tip: "Your period duration is shorter than average. This can be normal, but tracking consistently will help identify any patterns.",
            category: 'cycle'
        });
    }

    // Symptom-based tips
    const recentSymptoms = this.symptomTracking.slice(-7); // Last 7 entries
    const severeCramps = recentSymptoms.some(s =>
        s.symptoms.some(sym => sym.name === 'Lower Abdomen Cramps' && sym.severity === 'severe')
    );

    if (severeCramps) {
        tips.push({
            tip: "For severe cramps, consider over-the-counter pain relievers, a heating pad, and gentle exercise. If pain is debilitating, consult your doctor.",
            category: 'symptoms'
        });
    }

    // Sleep quality tips
    const recentSleep = this.sleepTracking.slice(-7); // Last 7 entries
    const poorSleep = recentSleep.some(s => s.quality === 'poor' || s.quality === 'fair');

    if (poorSleep) {
        tips.push({
            tip: "Improve sleep quality by maintaining a regular sleep schedule, creating a comfortable sleep environment, and avoiding caffeine and screens before bedtime.",
            category: 'sleep'
        });
    }

    this.healthTips = tips;
    return this.save();
};

export default mongoose.model('PeriodTracker', PeriodTrackerSchema);