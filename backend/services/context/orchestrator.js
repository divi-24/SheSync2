import { getAggregatedContext as getAggregated } from './contextAggregator.js';
import { getLastSnapshot, saveSnapshot } from './contextSnapshotCache.js';
import { hashContext, hasSignificantChange } from './contextComparator.js';
import { archivePreviousSnapshot } from './contextArchiver.js';

/**
 * Orchestrator: aggregates context, detects changes, archives prior snapshot, saves new snapshot, returns context.
 * @param {string|import('mongoose').Types.ObjectId} userId
 * @returns {Promise<{ context: object, changed: boolean, archived?: object }>} 
 */
export async function runContextPipeline(userId) {
    // 1) Aggregate latest context (respecting aiConsent and computing deriveds)
    const aggregated = await getAggregated(userId);

    // 2) Hash new context for change detection
    const newHash = hashContext(aggregated);

    // 3) Load previous snapshot
    const prev = await getLastSnapshot(userId);

    // 4) Compare and, if changed, archive previous snapshot
    let archived = undefined;
    const changed = hasSignificantChange(prev?.hash, newHash);
    if (changed && prev?.context) {
        archived = await archivePreviousSnapshot(userId, prev.hash, prev.context);
    }

    // 5) Save/Upsert new snapshot
    await saveSnapshot(userId, aggregated, newHash);

    // 6) Return latest context
    return { context: aggregated, changed, archived };
}

export default { runContextPipeline };
