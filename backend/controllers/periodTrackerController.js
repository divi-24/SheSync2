import PeriodTracker from '../models/PeriodTracker.js';
import User from '../models/user.js';
import mongoose from 'mongoose';

/**
 * Period Tracker Controller
 * Production-ready controller with comprehensive error handling,
 * validation, and best practices for data management
 */

// Helper function for error responses
const sendErrorResponse = (res, statusCode, message, error = null) => {
    const response = {
        success: false,
        message,
        timestamp: new Date().toISOString()
    };

    if (process.env.NODE_ENV === 'development' && error) {
        response.error = error.message;
        response.stack = error.stack;
    }

    return res.status(statusCode).json(response);
};

// Helper function for success responses
const sendSuccessResponse = (res, statusCode, message, data = null) => {
    const response = {
        success: true,
        message,
        timestamp: new Date().toISOString()
    };

    if (data !== null) {
        response.data = data;
    }

    return res.status(statusCode).json(response);
};

// Helper function to validate ObjectId
const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

/**
 * @desc    Create new period tracking entry
 * @route   POST /api/period-tracker
 * @access  Private
 */
export const createPeriodTracker = async (req, res) => {
    try {
        const userId = req.user.id;

        // Validate required fields
        const { cycleInfo, moodTracking, symptomTracking, sleepTracking } = req.body;

        if (!cycleInfo) {
            return sendErrorResponse(res, 400, 'Cycle information is required');
        }

        // Check if user already has an active tracker
        const existingTracker = await PeriodTracker.findOne({ userId, isActive: true });
        if (existingTracker) {
            return sendErrorResponse(res, 409, 'User already has an active period tracker. Please update the existing one or deactivate it first.');
        }

        // Validate cycle info
        const { cycleDuration, lastPeriodStart, lastPeriodDuration } = cycleInfo;

        if (!cycleDuration || !lastPeriodStart || !lastPeriodDuration) {
            return sendErrorResponse(res, 400, 'Cycle duration, last period start date, and last period duration are required');
        }

        // Validate date format
        const lastPeriodDate = new Date(lastPeriodStart);
        if (isNaN(lastPeriodDate.getTime())) {
            return sendErrorResponse(res, 400, 'Invalid last period start date format');
        }

        if (lastPeriodDate > new Date()) {
            return sendErrorResponse(res, 400, 'Last period start date cannot be in the future');
        }

        // Create period tracker entry
        const periodTracker = new PeriodTracker({
            userId,
            cycleInfo: {
                cycleDuration: parseInt(cycleDuration),
                lastPeriodStart: lastPeriodDate,
                lastPeriodDuration: parseInt(lastPeriodDuration),
                nextPeriodPrediction: cycleInfo.nextPeriodPrediction ? new Date(cycleInfo.nextPeriodPrediction) : undefined
            },
            moodTracking: Array.isArray(moodTracking) ? moodTracking : [],
            symptomTracking: Array.isArray(symptomTracking) ? symptomTracking : [],
            sleepTracking: Array.isArray(sleepTracking) ? sleepTracking : [],
            privacy: req.body.privacy || 'private'
        });

        // Generate health tips
        await periodTracker.generateHealthTips();

        // Save to database
        const savedTracker = await periodTracker.save();

        // Populate user data for response
        const populatedTracker = await PeriodTracker.findById(savedTracker._id)
            .populate('userId', 'name email role');

        return sendSuccessResponse(res, 201, 'Period tracker created successfully', populatedTracker);

    } catch (error) {
        console.error('Create period tracker error:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return sendErrorResponse(res, 400, 'Validation failed', errors.join(', '));
        }

        return sendErrorResponse(res, 500, 'Failed to create period tracker', error);
    }
};

/**
 * @desc    Get user's active period tracker
 * @route   GET /api/period-tracker/active
 * @access  Private
 */
export const getActivePeriodTracker = async (req, res) => {
    try {
        const userId = req.user.id;

        const tracker = await PeriodTracker.getActiveTracker(userId);

        if (!tracker) {
            return sendErrorResponse(res, 404, 'No active period tracker found');
        }

        return sendSuccessResponse(res, 200, 'Active period tracker retrieved successfully', tracker);

    } catch (error) {
        console.error('Get active period tracker error:', error);
        return sendErrorResponse(res, 500, 'Failed to retrieve period tracker', error);
    }
};

/**
 * @desc    Update period tracker
 * @route   PUT /api/period-tracker/:id
 * @access  Private
 */
export const updatePeriodTracker = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Validate ObjectId
        if (!isValidObjectId(id)) {
            return sendErrorResponse(res, 400, 'Invalid tracker ID format');
        }

        // Find tracker and verify ownership
        const tracker = await PeriodTracker.findOne({ _id: id, userId });

        if (!tracker) {
            return sendErrorResponse(res, 404, 'Period tracker not found or access denied');
        }

        // Update fields
        const updateData = {};

        if (req.body.cycleInfo) {
            updateData.cycleInfo = { ...tracker.cycleInfo, ...req.body.cycleInfo };

            // Validate updated cycle info
            if (req.body.cycleInfo.lastPeriodStart) {
                const lastPeriodDate = new Date(req.body.cycleInfo.lastPeriodStart);
                if (isNaN(lastPeriodDate.getTime()) || lastPeriodDate > new Date()) {
                    return sendErrorResponse(res, 400, 'Invalid last period start date');
                }
                updateData.cycleInfo.lastPeriodStart = lastPeriodDate;
            }
        }

        if (req.body.privacy) {
            updateData.privacy = req.body.privacy;
        }

        if (req.body.isActive !== undefined) {
            updateData.isActive = req.body.isActive;
        }

        // Update the tracker
        const updatedTracker = await PeriodTracker.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('userId', 'name email role');

        // Regenerate health tips if cycle info was updated
        if (req.body.cycleInfo) {
            await updatedTracker.generateHealthTips();
        }

        return sendSuccessResponse(res, 200, 'Period tracker updated successfully', updatedTracker);

    } catch (error) {
        console.error('Update period tracker error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return sendErrorResponse(res, 400, 'Validation failed', errors.join(', '));
        }

        return sendErrorResponse(res, 500, 'Failed to update period tracker', error);
    }
};

/**
 * @desc    Add mood tracking entry
 * @route   POST /api/period-tracker/:id/mood
 * @access  Private
 */
export const addMoodTracking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { moodTypes, intensity, notes, date } = req.body;

        // Validate ObjectId
        if (!isValidObjectId(id)) {
            return sendErrorResponse(res, 400, 'Invalid tracker ID format');
        }

        // Validate required fields
        if (!moodTypes || !Array.isArray(moodTypes) || moodTypes.length === 0) {
            return sendErrorResponse(res, 400, 'Mood types array is required and cannot be empty');
        }

        if (!intensity) {
            return sendErrorResponse(res, 400, 'Mood intensity is required');
        }

        // Find tracker and verify ownership
        const tracker = await PeriodTracker.findOne({ _id: id, userId });

        if (!tracker) {
            return sendErrorResponse(res, 404, 'Period tracker not found or access denied');
        }

        // Prepare mood data
        const moodData = {
            moodTypes,
            intensity,
            notes: notes || '',
            date: date ? new Date(date) : new Date()
        };

        // Validate date
        if (isNaN(moodData.date.getTime())) {
            return sendErrorResponse(res, 400, 'Invalid date format');
        }

        // Add mood tracking
        await tracker.addMoodTracking(moodData);

        // Regenerate health tips
        await tracker.generateHealthTips();

        const updatedTracker = await PeriodTracker.findById(id)
            .populate('userId', 'name email role');

        return sendSuccessResponse(res, 200, 'Mood tracking added successfully', updatedTracker);

    } catch (error) {
        console.error('Add mood tracking error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return sendErrorResponse(res, 400, 'Validation failed', errors.join(', '));
        }

        return sendErrorResponse(res, 500, 'Failed to add mood tracking', error);
    }
};

/**
 * @desc    Add symptom tracking entry
 * @route   POST /api/period-tracker/:id/symptoms
 * @access  Private
 */
export const addSymptomTracking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { symptoms, notes, date } = req.body;

        // Validate ObjectId
        if (!isValidObjectId(id)) {
            return sendErrorResponse(res, 400, 'Invalid tracker ID format');
        }

        // Validate required fields
        if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
            return sendErrorResponse(res, 400, 'Symptoms array is required and cannot be empty');
        }

        // Validate symptoms format
        for (const symptom of symptoms) {
            if (!symptom.name || !symptom.severity) {
                return sendErrorResponse(res, 400, 'Each symptom must have a name and severity');
            }
        }

        // Find tracker and verify ownership
        const tracker = await PeriodTracker.findOne({ _id: id, userId });

        if (!tracker) {
            return sendErrorResponse(res, 404, 'Period tracker not found or access denied');
        }

        // Prepare symptom data
        const symptomData = {
            symptoms,
            notes: notes || '',
            date: date ? new Date(date) : new Date()
        };

        // Validate date
        if (isNaN(symptomData.date.getTime())) {
            return sendErrorResponse(res, 400, 'Invalid date format');
        }

        // Add symptom tracking
        await tracker.addSymptomTracking(symptomData);

        // Regenerate health tips
        await tracker.generateHealthTips();

        const updatedTracker = await PeriodTracker.findById(id)
            .populate('userId', 'name email role');

        return sendSuccessResponse(res, 200, 'Symptom tracking added successfully', updatedTracker);

    } catch (error) {
        console.error('Add symptom tracking error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return sendErrorResponse(res, 400, 'Validation failed', errors.join(', '));
        }

        return sendErrorResponse(res, 500, 'Failed to add symptom tracking', error);
    }
};

/**
 * @desc    Add sleep tracking entry
 * @route   POST /api/period-tracker/:id/sleep
 * @access  Private
 */
export const addSleepTracking = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const { duration, quality, notes, date } = req.body;

        // Validate ObjectId
        if (!isValidObjectId(id)) {
            return sendErrorResponse(res, 400, 'Invalid tracker ID format');
        }

        // Validate required fields
        if (duration === undefined || duration === null) {
            return sendErrorResponse(res, 400, 'Sleep duration is required');
        }

        if (!quality) {
            return sendErrorResponse(res, 400, 'Sleep quality is required');
        }

        // Find tracker and verify ownership
        const tracker = await PeriodTracker.findOne({ _id: id, userId });

        if (!tracker) {
            return sendErrorResponse(res, 404, 'Period tracker not found or access denied');
        }

        // Prepare sleep data
        const sleepData = {
            duration: parseFloat(duration),
            quality,
            notes: notes || '',
            date: date ? new Date(date) : new Date()
        };

        // Validate date
        if (isNaN(sleepData.date.getTime())) {
            return sendErrorResponse(res, 400, 'Invalid date format');
        }

        // Validate duration
        if (sleepData.duration < 0 || sleepData.duration > 24) {
            return sendErrorResponse(res, 400, 'Sleep duration must be between 0 and 24 hours');
        }

        // Add sleep tracking
        await tracker.addSleepTracking(sleepData);

        // Regenerate health tips
        await tracker.generateHealthTips();

        const updatedTracker = await PeriodTracker.findById(id)
            .populate('userId', 'name email role');

        return sendSuccessResponse(res, 200, 'Sleep tracking added successfully', updatedTracker);

    } catch (error) {
        console.error('Add sleep tracking error:', error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return sendErrorResponse(res, 400, 'Validation failed', errors.join(', '));
        }

        return sendErrorResponse(res, 500, 'Failed to add sleep tracking', error);
    }
};

/**
 * @desc    Get user's tracking history
 * @route   GET /api/period-tracker/history
 * @access  Private
 */
export const getTrackingHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        // Validate limit
        if (limit > 100) {
            return sendErrorResponse(res, 400, 'Limit cannot exceed 100');
        }

        const trackers = await PeriodTracker.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate('userId', 'name email role');

        const total = await PeriodTracker.countDocuments({ userId });

        const response = {
            trackers,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalTrackers: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        };

        return sendSuccessResponse(res, 200, 'Tracking history retrieved successfully', response);

    } catch (error) {
        console.error('Get tracking history error:', error);
        return sendErrorResponse(res, 500, 'Failed to retrieve tracking history', error);
    }
};

/**
 * @desc    Delete period tracker
 * @route   DELETE /api/period-tracker/:id
 * @access  Private
 */
export const deletePeriodTracker = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Validate ObjectId
        if (!isValidObjectId(id)) {
            return sendErrorResponse(res, 400, 'Invalid tracker ID format');
        }

        // Find and delete tracker (verify ownership)
        const tracker = await PeriodTracker.findOneAndDelete({ _id: id, userId });

        if (!tracker) {
            return sendErrorResponse(res, 404, 'Period tracker not found or access denied');
        }

        return sendSuccessResponse(res, 200, 'Period tracker deleted successfully');

    } catch (error) {
        console.error('Delete period tracker error:', error);
        return sendErrorResponse(res, 500, 'Failed to delete period tracker', error);
    }
};

/**
 * @desc    Get period tracker analytics
 * @route   GET /api/period-tracker/analytics
 * @access  Private
 */
export const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get all user's trackers
        const trackers = await PeriodTracker.find({ userId }).sort({ createdAt: -1 });

        if (trackers.length === 0) {
            return sendErrorResponse(res, 404, 'No tracking data found');
        }

        // Calculate analytics
        const analytics = {
            totalTrackers: trackers.length,
            averageCycleDuration: 0,
            averagePeriodDuration: 0,
            mostCommonMood: null,
            mostCommonSymptom: null,
            averageSleepDuration: 0,
            cycleRegularity: 'unknown',
            lastUpdate: trackers[0].lastUpdated
        };

        // Calculate average cycle duration
        const cycleDurations = trackers.map(t => t.cycleInfo.cycleDuration).filter(d => d);
        if (cycleDurations.length > 0) {
            analytics.averageCycleDuration = Math.round(
                cycleDurations.reduce((a, b) => a + b, 0) / cycleDurations.length
            );
        }

        // Calculate average period duration
        const periodDurations = trackers.map(t => t.cycleInfo.lastPeriodDuration).filter(d => d);
        if (periodDurations.length > 0) {
            analytics.averagePeriodDuration = Math.round(
                periodDurations.reduce((a, b) => a + b, 0) / periodDurations.length
            );
        }

        // Calculate cycle regularity
        if (cycleDurations.length >= 3) {
            const variance = cycleDurations.reduce((acc, duration) => {
                return acc + Math.pow(duration - analytics.averageCycleDuration, 2);
            }, 0) / cycleDurations.length;

            if (variance <= 4) analytics.cycleRegularity = 'regular';
            else if (variance <= 9) analytics.cycleRegularity = 'somewhat_irregular';
            else analytics.cycleRegularity = 'irregular';
        }

        // Analyze mood patterns
        const allMoods = trackers.flatMap(t => t.moodTracking.flatMap(m => m.moodTypes));
        if (allMoods.length > 0) {
            const moodCounts = allMoods.reduce((acc, mood) => {
                acc[mood] = (acc[mood] || 0) + 1;
                return acc;
            }, {});
            analytics.mostCommonMood = Object.keys(moodCounts).reduce((a, b) =>
                moodCounts[a] > moodCounts[b] ? a : b
            );
        }

        // Analyze symptom patterns
        const allSymptoms = trackers.flatMap(t =>
            t.symptomTracking.flatMap(s => s.symptoms.map(sym => sym.name))
        );
        if (allSymptoms.length > 0) {
            const symptomCounts = allSymptoms.reduce((acc, symptom) => {
                acc[symptom] = (acc[symptom] || 0) + 1;
                return acc;
            }, {});
            analytics.mostCommonSymptom = Object.keys(symptomCounts).reduce((a, b) =>
                symptomCounts[a] > symptomCounts[b] ? a : b
            );
        }

        // Calculate average sleep duration
        const allSleep = trackers.flatMap(t => t.sleepTracking.map(s => s.duration)).filter(d => d);
        if (allSleep.length > 0) {
            analytics.averageSleepDuration = Math.round(
                (allSleep.reduce((a, b) => a + b, 0) / allSleep.length) * 10
            ) / 10; // Round to 1 decimal place
        }

        return sendSuccessResponse(res, 200, 'Analytics retrieved successfully', analytics);

    } catch (error) {
        console.error('Get analytics error:', error);
        return sendErrorResponse(res, 500, 'Failed to retrieve analytics', error);
    }
};