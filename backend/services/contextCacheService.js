import ContextSnapshot from '../models/ContextSnapshot.js';
import { getAggregatedContext } from './contextAggregator.js';

const SNAPSHOT_TTL_HOURS = 24;

export async function getCachedContext(userId) {
  const snapshot = await ContextSnapshot.findOne({ userId });

  if (snapshot) {
    const ageInHours =
      (Date.now() - new Date(snapshot.generatedAt).getTime()) / (1000 * 60 * 60);

    if (ageInHours < SNAPSHOT_TTL_HOURS) {
      return snapshot.data;
    }
  }

  const newContext = await getAggregatedContext(userId);

  await ContextSnapshot.updateOne(
    { userId },
    { data: newContext, generatedAt: new Date() },
    { upsert: true }
  );

  return newContext;
}
