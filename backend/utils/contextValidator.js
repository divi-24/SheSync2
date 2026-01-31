/**
 * Context Validators
 * Uses Zod to validate incoming payloads for each context type.
 * Each validator exports a middleware (req,res,next) that validates req.body.
 */
import { z } from 'zod';

// Shared helpers
const isoDate = z.preprocess((v) => (v ? new Date(v) : undefined), z.date().optional());

const userContextSchema = z.object({
    preferences: z
        .object({
            language: z.string().min(2).max(10).optional(),
            theme: z.enum(['light', 'dark', 'system']).optional(),
        })
        .optional(),
    lastActive: isoDate.optional(),
    aiConsent: z.boolean().optional(),
});

const cycleContextSchema = z.object({
    cycleStart: isoDate.optional(),
    cycleLength: z.number().int().min(15).max(60).optional(),
    ovulationDate: isoDate.optional(),
    nextExpectedPeriod: isoDate.optional(),
    notes: z.string().max(1000).optional(),
});

const symptomContextSchema = z.object({
    date: isoDate,
    symptoms: z.array(z.string().min(1)).max(50).optional(),
    severity: z.enum(['mild', 'moderate', 'severe']).optional(),
    notes: z.string().max(1000).optional(),
});

const moodContextSchema = z.object({
    date: isoDate,
    mood: z.string().max(120).optional(),
    triggers: z.array(z.string().max(120)).max(25).optional(),
    notes: z.string().max(1000).optional(),
});

const goalContextSchema = z.object({
    goalType: z.string().max(120).optional(),
    targetDate: isoDate.optional(),
    description: z.string().max(1000).optional(),
    status: z.enum(['pending', 'achieved']).optional(),
});

function makeValidator(schema) {
    return (req, res, next) => {
        try {
            const parsed = schema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({ success: false, message: 'Validation failed', errors: parsed.error.issues });
            }
            req.validatedBody = parsed.data;
            next();
        } catch (err) {
            console.error('[contextValidator] error', err);
            return res.status(500).json({ success: false, message: 'Validator error' });
        }
    };
}

export const validateUserContext = makeValidator(userContextSchema);
export const validateCycleContext = makeValidator(cycleContextSchema);
export const validateSymptomContext = makeValidator(symptomContextSchema);
export const validateMoodContext = makeValidator(moodContextSchema);
export const validateGoalContext = makeValidator(goalContextSchema);

export default {
    validateUserContext,
    validateCycleContext,
    validateSymptomContext,
    validateMoodContext,
    validateGoalContext,
};
