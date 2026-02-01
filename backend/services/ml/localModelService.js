/**
 * Local ML Model Service (Backend)
 * Replaces Google Gemini with your trained ML model
 * Provides text generation, embeddings, and summarization
 */

import fs from 'fs';
import path from 'path';

const MODEL_PATH = process.env.ML_MODEL_PATH || './models/shesync-model';
const EMBEDDING_DIM = parseInt(process.env.EMBEDDING_DIM) || 256;

class LocalMLModelService {
    constructor() {
        this.modelLoaded = false;
        this.model = null;
    }

    /**
     * Initialize and load the ML model
     * In production, this would load your trained model
     */
    async initialize() {
        try {
            // Check if model files exist
            if (!fs.existsSync(MODEL_PATH)) {
                console.warn('[LocalMLModel] Model path not found:', MODEL_PATH);
                console.warn('[LocalMLModel] Using fallback methods only');
                return;
            }

            // TODO: Load your trained ML model here
            // Example for TensorFlow.js or similar:
            // const tf = require('@tensorflow/tfjs');
            // this.model = await tf.loadLayersModel(`file://${MODEL_PATH}/model.json`);

            console.log('[LocalMLModel] Model initialized from:', MODEL_PATH);
            this.modelLoaded = true;
        } catch (error) {
            console.error('[LocalMLModel] Failed to load model:', error.message);
            this.modelLoaded = false;
        }
    }

    /**
     * Analyze PCOS symptoms using local ML model
     * Replaces Google Gemini in PCOS symptom analyzer
     */
    async createPCOSAnalysis({ symptoms = [], severities = {}, prompt = '' }) {
        try {
            if (!this.modelLoaded) {
                await this.initialize();
            }

            if (!this.modelLoaded) {
                return this.generateFallbackPCOSAnalysis(symptoms, severities);
            }

            // TODO: Use your trained ML model for PCOS analysis
            // Example (placeholder):
            // const analysisInput = this.formatPCOSPrompt(symptoms, severities, prompt);
            // const analysis = await this.model.predict(this.tokenize(analysisInput));
            // return this.detokenize(analysis);

            return this.generateFallbackPCOSAnalysis(symptoms, severities);
        } catch (error) {
            console.error('[LocalMLModel] Error in createPCOSAnalysis:', error.message);
            return this.generateFallbackPCOSAnalysis(symptoms, severities);
        }
    }

    /**
     * Generate summary of health data
     * Replaces Gemini's summarization in summarizerService.js
     */
    async createSummary(structuredStats) {
        try {
            if (!this.modelLoaded) {
                await this.initialize();
            }

            if (!this.modelLoaded) {
                return this.fallbackSummary(structuredStats);
            }

            // TODO: Use your ML model to generate summary
            // Example (placeholder):
            // const prompt = this.buildSummaryPrompt(structuredStats);
            // const summary = await this.model.predict(this.tokenize(prompt));
            // return this.detokenize(summary);

            return this.fallbackSummary(structuredStats);
        } catch (error) {
            console.error('[LocalMLModel] Error in createSummary:', error.message);
            return this.fallbackSummary(structuredStats);
        }
    }

    /**
     * Generate text embeddings
     * Replaces Gemini's embedContent in vectorMemoryService.js
     */
    async embedText(text) {
        if (!text || !text.trim()) return [];

        try {
            if (!this.modelLoaded) {
                await this.initialize();
            }

            if (!this.modelLoaded) {
                return this.simpleHashEmbedding(text, EMBEDDING_DIM);
            }

            // TODO: Use your embedding model
            // Example (placeholder):
            // const embedding = await this.embeddingModel.predict(this.tokenize(text));
            // return this.normalizeVector(embedding);

            return this.simpleHashEmbedding(text, EMBEDDING_DIM);
        } catch (error) {
            console.error('[LocalMLModel] Error in embedText:', error.message);
            return this.simpleHashEmbedding(text, EMBEDDING_DIM);
        }
    }

    /**
     * Generate chat response
     * Replaces Gemini in chatbot/community contexts
     */
    async generateChatResponse(conversationHistory, communityContext = 'General') {
        try {
            if (!this.modelLoaded) {
                await this.initialize();
            }

            if (!this.modelLoaded) {
                return this.generateFallbackResponse(conversationHistory, communityContext);
            }

            // TODO: Use your chat model
            // Example (placeholder):
            // const prompt = this.buildChatPrompt(conversationHistory, communityContext);
            // const response = await this.model.predict(this.tokenize(prompt));
            // return this.detokenize(response);

            return this.generateFallbackResponse(conversationHistory, communityContext);
        } catch (error) {
            console.error('[LocalMLModel] Error in generateChatResponse:', error.message);
            return this.generateFallbackResponse(conversationHistory, communityContext);
        }
    }

    // ==================== HELPER METHODS ====================

    buildSummaryPrompt(stats) {
        return [
            "You are an assistant generating a concise human-readable summary of a user's menstrual health context.",
            "Write 2-3 sentences. Avoid medical diagnosis. Keep it supportive and neutral.",
            "Structured data:",
            JSON.stringify(stats, null, 2)
        ].join('\n');
    }

    buildChatPrompt(conversationHistory, communityContext) {
        const systemPrompt = `
You are Eve, an AI health assistant in the "${communityContext}" community forum of SheSync.
Your role is to provide accurate, empathetic, and helpful responses in a conversational, supportive, and friendly manner.
Always refer to yourself as "Eve". Keep answers concise, relevant, and tailored to the selected community context.
`;
        const contextString = conversationHistory
            .slice(-6)
            .map(msg => `${msg.role === "user" ? "User" : "Eve"}: ${msg.content}`)
            .join("\n");

        return `${systemPrompt}\nConversation so far:\n${contextString}\nEve:`;
    }

    fallbackSummary(stats) {
        const { avgCycleLength, irregularCycle, symptomFrequency, daysUntilNextPeriod } = stats;
        const parts = [];

        if (avgCycleLength) parts.push(`Average cycle length is about ${avgCycleLength} days`);
        if (typeof irregularCycle === 'boolean') {
            parts.push(irregularCycle ? 'cycles appear irregular' : 'cycles appear regular');
        }

        if (symptomFrequency && Object.keys(symptomFrequency).length) {
            const topSymptoms = Object.entries(symptomFrequency)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 2)
                .map(([k, v]) => `${k.toLowerCase()} (${v})`)
                .join(', ');
            parts.push(`recent symptoms include ${topSymptoms}`);
        }

        if (typeof daysUntilNextPeriod === 'number') {
            parts.push(`${daysUntilNextPeriod} day(s) until the next predicted period`);
        }

        const text = parts.join('; ') + '.';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    generateFallbackResponse(conversationHistory, communityContext) {
        const responses = {
            "Health & Wellness": [
                "That's an important health concern. I'd recommend consulting with a healthcare professional for personalized advice.",
                "Thank you for sharing about your health. Keep tracking your symptoms and patterns - consistency helps.",
                "Your health is important. Don't hesitate to reach out to a medical professional if you have concerns.",
            ],
            "Supportive Chat": [
                "I'm here to listen and support you. Your feelings are valid.",
                "Thank you for sharing. Remember, it's okay to take care of yourself.",
                "I appreciate your trust in sharing this. You're doing great by seeking support.",
            ],
            "Learning & Growth": [
                "That's a great topic to explore. Keep learning and growing at your own pace.",
                "Your curiosity is wonderful. Every step forward counts.",
                "Learning is a journey. Celebrate the progress you're making.",
            ]
        };

        const contextResponses = responses[communityContext] || responses["Supportive Chat"];
        return contextResponses[Math.floor(Math.random() * contextResponses.length)];
    }

    simpleHashEmbedding(text, dimension = 256) {
        const vec = new Array(dimension).fill(0);
        const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);

        for (const token of tokens) {
            let hash = 2166136261;
            for (let i = 0; i < token.length; i++) {
                hash ^= token.charCodeAt(i);
                hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
            }
            const idx = Math.abs(hash) % dimension;
            vec[idx] += 1;
        }

        // Normalize vector
        const norm = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
        return vec.map(v => v / norm);
    }

    cosineSimilarity(a = [], b = []) {
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

    generateFallbackPCOSAnalysis(symptoms = [], severities = {}) {
        const severityCount = {
            'Severe': 0,
            'Moderate': 0,
            'Mild': 0,
            'None': 0
        };

        symptoms.forEach(symptom => {
            const sev = severities[symptom] || 'None';
            severityCount[sev] = (severityCount[sev] || 0) + 1;
        });

        // Calculate risk score based on severity distribution
        const riskScore = Math.min(
            100,
            (severityCount['Severe'] * 25) +
            (severityCount['Moderate'] * 12) +
            (severityCount['Mild'] * 5)
        );

        const riskLevel = riskScore >= 70 ? 'High' : riskScore >= 40 ? 'Moderate' : 'Low';

        const analysis = `## Symptom Analysis
Your reported symptoms include ${symptoms.length} condition(s) commonly associated with PCOS.

${symptoms.map(s => `- **${s}** (${severities[s] || 'Not specified'})`).join('\n')}

## Risk Assessment
Based on your symptom profile, we recommend medical evaluation.

**Likelihood**: ${riskScore}% (for PCOS-related conditions)
**Risk Level**: ${riskLevel}

## Severity Levels
${symptoms.map(s => `- ${s}: ${severities[s] || 'None'}`).join('\n')}

## Recommended Tests
- Hormonal panel (testosterone, DHEA-S, LH/FSH ratio)
- Pelvic ultrasound for ovarian morphology
- Metabolic tests (fasting glucose, insulin, lipid panel)
- Thyroid function tests (TSH, free T4)

## Action Steps
1. Schedule an appointment with your gynecologist or endocrinologist
2. Prepare a detailed symptom log for your visit
3. Note the severity and duration of each symptom
4. Discuss family history of PCOS or metabolic conditions
5. Request baseline blood tests if not recently done
6. Consider lifestyle modifications: regular exercise and balanced diet

**Note**: This assessment is for informational purposes only. Please consult a healthcare professional for proper diagnosis and treatment.`;

        return analysis;
    }
}

// Export singleton instance
export const localMLModel = new LocalMLModelService();

export default { createSummary: (stats) => localMLModel.createSummary(stats) };
