import ContextSnapshot from '../../models/ContextSnapshot.js';

export async function getLastSnapshot(userId) {
    try {
        // unique per user; findOne by userId is sufficient
        const doc = await ContextSnapshot.findOne({ userId }).lean();
        if (!doc) return null;
        return { context: doc.context, hash: doc.hash, updatedAt: doc.updatedAt };
    } catch (err) {
        console.error(`getLastSnapshot failed for userId=${userId}:`, err);
        throw err;
    }
}

export async function saveSnapshot(userId, context, hash) {
    try {
        const now = new Date();
        // upsert by unique userId to keep only one active snapshot
        const doc = await ContextSnapshot.findOneAndUpdate(
            { userId },
            { userId, context, hash, updatedAt: now },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        ).lean();
        return { context: doc.context, hash: doc.hash, updatedAt: doc.updatedAt };
    } catch (err) {
        console.error(`saveSnapshot failed for userId=${userId}:`, err);
        throw err;
    }
}

export default { getLastSnapshot, saveSnapshot };
