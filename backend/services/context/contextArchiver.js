import ContextMemory from '../../models/ContextMemory.js';
import { createSummary } from './summarizerService.js';
import { embedText, storeMemory } from './vectorMemoryService.js';

// Compute rule-based stats from previous snapshot context
export function computeStats(prevContext = {}) {
    const stats = {};

    // Average cycle length
    const cycle = prevContext.cycle || prevContext.cycleInfo || prevContext.periodTracker?.cycleInfo;
    const cycleLen =
        cycle?.cycleDuration || // PeriodTracker.cycleInfo
        cycle?.cycleLength ||   // Cycle model
        prevContext.periodTracker?.cycleInfo?.cycleDuration;
    if (cycleLen) stats.avgCycleLength = Number(cycleLen);
    // Irregular flag is expected on PeriodTracker.cycleInfo
    const irregular = prevContext.periodTracker?.cycleInfo?.irregularCycle;
    if (typeof irregular === 'boolean') stats.irregularCycle = irregular;

    // Symptom frequency over last N entries
    const symptoms = prevContext.symptoms || prevContext.periodTracker?.symptomTracking || [];
    const freq = {};
    const last = Array.isArray(symptoms) ? symptoms.slice(0, 30) : [];
    for (const s of last) {
        if (Array.isArray(s.symptoms)) {
            for (const item of s.symptoms) {
                const name = (item?.name || '').trim();
                if (name) freq[name] = (freq[name] || 0) + 1;
            }
        } else if (s.type) {
            const name = (s.type || '').trim();
            if (name) freq[name] = (freq[name] || 0) + 1;
        } else {
            // Handle boolean symptom fields (Symptoms model)
            const booleanKeys = ['cramps', 'headaches', 'moodSwings', 'bloating', 'breastTenderness'];
            for (const key of booleanKeys) {
                if (s[key] === true) freq[key] = (freq[key] || 0) + 1;
            }
        }
    }
    stats.symptomFrequency = freq;

    // Days until next predicted period
    const days = prevContext.periodTracker?.daysUntilNextPeriod;
    if (typeof days === 'number') stats.daysUntilNextPeriod = days;
    else {
        const next = prevContext.periodTracker?.cycleInfo?.nextPeriodPrediction;
        if (next) {
            const diff = Math.ceil((new Date(next) - new Date()) / (1000 * 60 * 60 * 24));
            if (Number.isFinite(diff)) stats.daysUntilNextPeriod = Math.max(diff, 0);
        }
    }

    return stats;
}

export async function archivePreviousSnapshot(userId, sourceHash, prevContext) {
    // 1) Compute rule-based compression stats
    const stats = computeStats(prevContext);

    // 2) Summarize with AI or fallback
    const summaryText = await createSummary(stats);

    // 3) Embed summary
    const embedding = await embedText(summaryText);

    // 4) Store memory
    const doc = await storeMemory(userId, summaryText, embedding, { sourceHash, stats });
    return doc;
}

export default { computeStats, archivePreviousSnapshot };
