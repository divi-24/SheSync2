import express from 'express';
import rateLimit from 'express-rate-limit';
import { authMiddleware } from '../middleware/auth.js';
import {
    createPeriodTracker,
    getActivePeriodTracker,
    updatePeriodTracker,
    addMoodTracking,
    addSymptomTracking,
    addSleepTracking,
    getTrackingHistory,
    deletePeriodTracker,
    getAnalytics
} from '../controllers/periodTrackerController.js';

const router = express.Router();

// Rate limiting configurations
const createTrackerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 tracker creation requests per windowMs
    message: {
        success: false,
        message: 'Too many tracker creation attempts. Please try again in 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const updateTrackerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 update requests per windowMs
    message: {
        success: false,
        message: 'Too many update attempts. Please try again in 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const addDataLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // limit each IP to 30 data addition requests per windowMs
    message: {
        success: false,
        message: 'Too many data entries. Please try again in 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests. Please try again in 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Input validation middleware
const validateTrackerInput = (req, res, next) => {
    const { cycleInfo } = req.body;

    if (!cycleInfo) {
        return res.status(400).json({
            success: false,
            message: 'Cycle information is required',
            timestamp: new Date().toISOString()
        });
    }

    const { cycleDuration, lastPeriodStart, lastPeriodDuration } = cycleInfo;

    // Validate cycle duration
    if (!cycleDuration || isNaN(cycleDuration) || cycleDuration < 15 || cycleDuration > 50) {
        return res.status(400).json({
            success: false,
            message: 'Cycle duration must be a number between 15 and 50 days',
            timestamp: new Date().toISOString()
        });
    }

    // Validate last period duration
    if (!lastPeriodDuration || isNaN(lastPeriodDuration) || lastPeriodDuration < 1 || lastPeriodDuration > 15) {
        return res.status(400).json({
            success: false,
            message: 'Last period duration must be a number between 1 and 15 days',
            timestamp: new Date().toISOString()
        });
    }

    // Validate last period start date
    if (!lastPeriodStart) {
        return res.status(400).json({
            success: false,
            message: 'Last period start date is required',
            timestamp: new Date().toISOString()
        });
    }

    const lastPeriodDate = new Date(lastPeriodStart);
    if (isNaN(lastPeriodDate.getTime())) {
        return res.status(400).json({
            success: false,
            message: 'Invalid last period start date format',
            timestamp: new Date().toISOString()
        });
    }

    if (lastPeriodDate > new Date()) {
        return res.status(400).json({
            success: false,
            message: 'Last period start date cannot be in the future',
            timestamp: new Date().toISOString()
        });
    }

    next();
};

// Mood tracking validation middleware
const validateMoodInput = (req, res, next) => {
    const { moodTypes, intensity } = req.body;

    if (!moodTypes || !Array.isArray(moodTypes) || moodTypes.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Mood types array is required and cannot be empty',
            timestamp: new Date().toISOString()
        });
    }

    const validMoodTypes = ['Happy', 'Sad', 'Calm', 'Angry', 'Tired', 'Energized'];
    for (const mood of moodTypes) {
        if (!validMoodTypes.includes(mood)) {
            return res.status(400).json({
                success: false,
                message: `Invalid mood type: ${mood}. Valid types: ${validMoodTypes.join(', ')}`,
                timestamp: new Date().toISOString()
            });
        }
    }

    if (!intensity || !['low', 'medium', 'high'].includes(intensity)) {
        return res.status(400).json({
            success: false,
            message: 'Intensity must be one of: low, medium, high',
            timestamp: new Date().toISOString()
        });
    }

    next();
};

// Symptom tracking validation middleware
const validateSymptomInput = (req, res, next) => {
    const { symptoms } = req.body;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Symptoms array is required and cannot be empty',
            timestamp: new Date().toISOString()
        });
    }

    const validSymptoms = [
        'Lower Abdomen Cramps',
        'Back Pain',
        'Bloating',
        'Fatigue',
        'Headaches',
        'Nausea',
        'Sleep Disruption',
        'Digestive Issues'
    ];

    const validSeverities = ['none', 'mild', 'moderate', 'severe'];

    for (const symptom of symptoms) {
        if (!symptom.name || !symptom.severity) {
            return res.status(400).json({
                success: false,
                message: 'Each symptom must have a name and severity',
                timestamp: new Date().toISOString()
            });
        }

        if (!validSymptoms.includes(symptom.name)) {
            return res.status(400).json({
                success: false,
                message: `Invalid symptom: ${symptom.name}. Valid symptoms: ${validSymptoms.join(', ')}`,
                timestamp: new Date().toISOString()
            });
        }

        if (!validSeverities.includes(symptom.severity)) {
            return res.status(400).json({
                success: false,
                message: `Invalid severity: ${symptom.severity}. Valid severities: ${validSeverities.join(', ')}`,
                timestamp: new Date().toISOString()
            });
        }
    }

    next();
};

// Sleep tracking validation middleware
const validateSleepInput = (req, res, next) => {
    const { duration, quality } = req.body;

    if (duration === undefined || duration === null || isNaN(duration)) {
        return res.status(400).json({
            success: false,
            message: 'Sleep duration is required and must be a number',
            timestamp: new Date().toISOString()
        });
    }

    if (duration < 0 || duration > 24) {
        return res.status(400).json({
            success: false,
            message: 'Sleep duration must be between 0 and 24 hours',
            timestamp: new Date().toISOString()
        });
    }

    if (!quality || !['poor', 'fair', 'good', 'excellent'].includes(quality)) {
        return res.status(400).json({
            success: false,
            message: 'Quality must be one of: poor, fair, good, excellent',
            timestamp: new Date().toISOString()
        });
    }

    next();
};

// Error handling middleware
const handleAsyncErrors = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes

/**
 * @route   POST /api/period-tracker
 * @desc    Create new period tracker
 * @access  Private
 */
router.post(
    '/',
    createTrackerLimiter,
    validateTrackerInput,
    handleAsyncErrors(createPeriodTracker)
);

/**
 * @route   GET /api/period-tracker/active
 * @desc    Get user's active period tracker
 * @access  Private
 */
router.get(
    '/active',
    generalLimiter,
    handleAsyncErrors(getActivePeriodTracker)
);

/**
 * @route   GET /api/period-tracker/history
 * @desc    Get user's tracking history
 * @access  Private
 */
router.get(
    '/history',
    generalLimiter,
    handleAsyncErrors(getTrackingHistory)
);

/**
 * @route   GET /api/period-tracker/analytics
 * @desc    Get period tracker analytics
 * @access  Private
 */
router.get(
    '/analytics',
    generalLimiter,
    handleAsyncErrors(getAnalytics)
);

/**
 * @route   PUT /api/period-tracker/:id
 * @desc    Update period tracker
 * @access  Private
 */
router.put(
    '/:id',
    updateTrackerLimiter,
    handleAsyncErrors(updatePeriodTracker)
);

/**
 * @route   POST /api/period-tracker/:id/mood
 * @desc    Add mood tracking entry
 * @access  Private
 */
router.post(
    '/:id/mood',
    addDataLimiter,
    validateMoodInput,
    handleAsyncErrors(addMoodTracking)
);

/**
 * @route   POST /api/period-tracker/:id/symptoms
 * @desc    Add symptom tracking entry
 * @access  Private
 */
router.post(
    '/:id/symptoms',
    addDataLimiter,
    validateSymptomInput,
    handleAsyncErrors(addSymptomTracking)
);

/**
 * @route   POST /api/period-tracker/:id/sleep
 * @desc    Add sleep tracking entry
 * @access  Private
 */
router.post(
    '/:id/sleep',
    addDataLimiter,
    validateSleepInput,
    handleAsyncErrors(addSleepTracking)
);

/**
 * @route   DELETE /api/period-tracker/:id
 * @desc    Delete period tracker
 * @access  Private
 */
router.delete(
    '/:id',
    updateTrackerLimiter,
    handleAsyncErrors(deletePeriodTracker)
);

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Period tracker service is healthy',
        timestamp: new Date().toISOString(),
        service: 'period-tracker'
    });
});

// Error handling middleware
router.use((error, req, res, next) => {
    console.error('Period tracker route error:', error);

    // Mongoose validation error
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors,
            timestamp: new Date().toISOString()
        });
    }

    // Mongoose cast error
    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Invalid data format',
            timestamp: new Date().toISOString()
        });
    }

    // Duplicate key error
    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'Resource already exists',
            timestamp: new Date().toISOString()
        });
    }

    // Default server error
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { error: error.message })
    });
});

export default router;