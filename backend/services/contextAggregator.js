/**
 * Context Aggregator Service
 * Combines user data from Cycle, Symptom, and PeriodTracker models into a single object.
 * Decrypts sensitive fields only if aiConsent === true.
 * Includes virtual/derived fields from PeriodTracker for AI-ready summaries.
 */

import Cycle from '../models/cycle.js';
import Symptoms from '../models/symptoms.js';
import PeriodTracker from '../models/PeriodTracker.js';
import User from '../models/user.js'; // for aiConsent

export async function getAggregatedContext(userId) {
    // Fetch user first to check AI consent
    const user = await User.findById(userId);
    const aiConsent = user?.aiConsent === true;

    // Fetch all data in parallel
    const [cycle, symptoms, periodTracker] = await Promise.all([
        Cycle.findOne({ user: userId }).sort({ startDate: -1 }).lean(),
        Symptoms.find({ user: userId }).sort({ date: -1 }).limit(30).lean(),
        PeriodTracker.findOne({ userId }).lean(),
    ]);

    // Sanitize sensitive fields based on AI consent
    const sanitizedCycle = cycle
        ? {
            ...cycle,
            fertilityWindow: aiConsent ? cycle.fertilityWindow : undefined,
            pregnancy: aiConsent ? cycle.pregnancy : undefined,
            notes: aiConsent ? cycle.notes : undefined,
        }
        : null;

    const sanitizedSymptoms = symptoms.map(s => ({
        ...s,
        notes: aiConsent ? s.notes : undefined,
    }));

    let sanitizedPeriodTracker = null;
    if (periodTracker) {
        // Sanitize sensitive tracking info
        sanitizedPeriodTracker = {
            ...periodTracker,
            healthTips: aiConsent ? periodTracker.healthTips : undefined,
            symptomTracking: aiConsent ? periodTracker.symptomTracking : undefined,
            moodTracking: aiConsent ? periodTracker.moodTracking : undefined,
            sleepTracking: aiConsent ? periodTracker.sleepTracking : undefined,
            // Add virtuals / derived fields
            cycleAnalysis: periodTracker.cycleAnalysis || computeCycleAnalysis(periodTracker),
            periodAnalysis: periodTracker.periodAnalysis || computePeriodAnalysis(periodTracker),
            daysUntilNextPeriod: periodTracker.daysUntilNextPeriod || computeDaysUntilNextPeriod(periodTracker),
        };
    }

    return {
        user: { id: userId, aiConsent },
        cycle: sanitizedCycle,
        symptoms: sanitizedSymptoms,
        periodTracker: sanitizedPeriodTracker,
        meta: {
            aiConsent,
            generatedAt: new Date().toISOString(),
            disclaimer: aiConsent
                ? 'User consent granted for AI usage of decrypted sensitive context.'
                : 'Sensitive encrypted fields excluded due to missing AI consent.',
        },
    };
}

/**
 * Helper functions to compute derived fields if not already present
 */
function computeCycleAnalysis(periodTracker) {
    // Example: analyze irregularity or trends from cycleInfo
    const { cycleInfo } = periodTracker;
    if (!cycleInfo) return null;

    return {
        irregularCycle: cycleInfo.irregularCycle,
        lastCycleDuration: cycleInfo.cycleDuration,
        nextPeriodPrediction: cycleInfo.nextPeriodPrediction,
    };
}

function computePeriodAnalysis(periodTracker) {
    // Example: high-level summary of symptom/mood trends
    const symptomCount = periodTracker.symptomTracking?.length || 0;
    const moodCount = periodTracker.moodTracking?.length || 0;

    return { symptomCount, moodCount };
}

function computeDaysUntilNextPeriod(periodTracker) {
    if (!periodTracker.cycleInfo?.nextPeriodPrediction) return null;
    const today = new Date();
    const nextPeriod = new Date(periodTracker.cycleInfo.nextPeriodPrediction);
    const diffTime = nextPeriod - today;
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
}

export default { getAggregatedContext };
