import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

/**
 * createSummary
 * Generates a 2–3 sentence human-readable summary from structured stats.
 * Uses Gemini AI if available; falls back to deterministic summary.
 */
export async function createSummary(structuredStats) {
    // Always fallback if API key missing
    if (!GEMINI_API_KEY) return fallbackSummary(structuredStats);

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: MODEL_NAME,
            generationConfig: { temperature: 0.3, maxOutputTokens: 180 }
        });

        const prompt = buildPrompt(structuredStats);
        const result = await model.generateContent(prompt);

        // Normalize text output
        let text = '';
        if (result?.response?.text) {
            text = typeof result.response.text === 'function' ? result.response.text() : result.response.text;
            if (typeof text === 'string') text = text.trim();
        }

        return text || fallbackSummary(structuredStats);
    } catch (err) {
        return fallbackSummary(structuredStats);
    }
}

/**
 * Build prompt for AI summarization
 */
function buildPrompt(stats) {
    return [
        "You are an assistant generating a concise human-readable summary of a user's menstrual health context.",
        "Write 2-3 sentences. Avoid medical diagnosis. Keep it supportive and neutral.",
        "Structured data:",
        JSON.stringify(stats, null, 2)
    ].join('\n');
}

/**
 * Fallback deterministic summary if AI fails or API unavailable
 */
function fallbackSummary(stats) {
    const { avgCycleLength, irregularCycle, symptomFrequency, daysUntilNextPeriod } = stats;
    const parts = [];

    if (avgCycleLength) parts.push(`Average cycle length is about ${avgCycleLength} days`);
    if (typeof irregularCycle === 'boolean') parts.push(irregularCycle ? 'cycles appear irregular' : 'cycles appear regular');

    if (symptomFrequency && Object.keys(symptomFrequency).length) {
        const topSymptoms = Object.entries(symptomFrequency)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 2)
            .map(([k, v]) => `${k.toLowerCase()} (${v})`)
            .join(', ');
        parts.push(`recent symptoms include ${topSymptoms}`);
    }

    if (typeof daysUntilNextPeriod === 'number') parts.push(`${daysUntilNextPeriod} day(s) until the next predicted period`);

    const text = parts.join('; ') + '.';
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export default { createSummary };
