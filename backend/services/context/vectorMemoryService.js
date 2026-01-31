import ContextMemory from '../../models/ContextMemory.js';
import { GoogleGenAI } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';

/**
 * Embed text into a numeric vector.
 * Tries Google GenAI first, falls back to deterministic hash embedding if API fails or missing.
 */
export async function embedText(text) {
    if (!text || !text.trim()) return [];

    // Fallback if no API key
    if (!GEMINI_API_KEY) return simpleHashEmbedding(text, 256);

    try {
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const res = await ai.models.embedContent({
            model: EMBEDDING_MODEL,
            contents: text.slice(0, 4000), // limit input length
        });

        const embedding = res?.embeddings;
        return Array.isArray(embedding) ? embedding.map(Number) : simpleHashEmbedding(text, 256);
    } catch (_) {
        // Fallback if API call fails
        return simpleHashEmbedding(text, 256);
    }
}

/**
 * Store a memory for a user in MongoDB.
 */
export async function storeMemory(userId, summaryText, embedding, meta) {
    const doc = await ContextMemory.create({ userId, summaryText, embedding, meta });
    return doc.toObject();
}

/**
 * Query relevant memories for a user.
 * Uses MongoDB Atlas Vector Search if available, otherwise falls back to cosine similarity.
 */
export async function queryMemories(userId, queryEmbedding, k = 5) {
    try {
        // MongoDB Atlas Vector Search (requires Atlas 7.0+)
        const results = await ContextMemory.aggregate([
            {
                $vectorSearch: {
                    index: 'context_memory_embedding_index', // adjust your index name
                    path: 'embedding',
                    queryVector: queryEmbedding,
                    numCandidates: Math.max(50, k * 10),
                    limit: k,
                    filter: { userId },
                },
            },
            {
                $project: {
                    summaryText: 1,
                    embedding: 0,
                    createdAt: 1,
                    meta: 1,
                    score: { $meta: 'vectorSearchScore' },
                },
            },
        ]);

        if (Array.isArray(results) && results.length) return results;
    } catch (_) {
        // Ignore errors and fallback
    }

    // Fallback: cosine similarity on recent 200 documents
    const recent = await ContextMemory.find({ userId }).sort({ createdAt: -1 }).limit(200).lean();
    const scored = recent.map((r) => ({
        ...r,
        score: cosineSimilarity(queryEmbedding, r.embedding),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, k).map(({ embedding, ...rest }) => rest);
}

/**
 * Simple deterministic embedding fallback based on token hashing.
 */
function simpleHashEmbedding(text, dim = 128) {
    const vec = new Array(dim).fill(0);
    const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);

    for (const t of tokens) {
        let h = 2166136261;
        for (let i = 0; i < t.length; i++) {
            h ^= t.charCodeAt(i);
            h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
        }
        const idx = Math.abs(h) % dim;
        vec[idx] += 1;
    }

    const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
    return vec.map((v) => v / norm);
}

/**
 * Cosine similarity between two vectors.
 */
function cosineSimilarity(a = [], b = []) {
    const len = Math.min(a.length, b.length);
    if (!len) return 0;

    let dot = 0, na = 0, nb = 0;
    for (let i = 0; i < len; i++) {
        const va = Number(a[i]) || 0;
        const vb = Number(b[i]) || 0;
        dot += va * vb;
        na += va * va;
        nb += vb * vb;
    }

    const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
    return dot / denom;
}

export default { embedText, storeMemory, queryMemories };
