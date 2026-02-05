import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import PeriodTracker from '../models/PeriodTracker.js';
import User from '../models/user.js';

const router = express.Router();

// Debug endpoint to check parent-child relationships and data
router.get('/check-parent-child', authMiddleware, async (req, res) => {
    try {
        const { id, role, parentOf, partnerOf } = req.user;
        
        console.log('[DEBUG] User info:', {
            userId: id,
            role,
            parentOf,
            partnerOf
        });

        // If parent, check child's data
        if (role === 'parent' && parentOf) {
            console.log('[DEBUG] Checking child data for childId:', parentOf);
            
            // Check if child exists
            const child = await User.findById(parentOf).select('name email role');
            console.log('[DEBUG] Child found:', child);
            
            // Check trackers for child
            const trackers = await PeriodTracker.find({ userId: parentOf });
            console.log('[DEBUG] Child trackers count:', trackers.length);
            if (trackers.length > 0) {
                console.log('[DEBUG] First tracker:', JSON.stringify(trackers[0], null, 2));
            }
            
            return res.json({
                userRole: role,
                childId: parentOf,
                childExists: !!child,
                child: child,
                trackerCount: trackers.length,
                trackers: trackers.map(t => ({
                    _id: t._id,
                    userId: t.userId,
                    cycleInfo: t.cycleInfo,
                    moodTrackingCount: t.moodTracking?.length || 0,
                    symptomTrackingCount: t.symptomTracking?.length || 0,
                    sleepTrackingCount: t.sleepTracking?.length || 0,
                    createdAt: t.createdAt
                }))
            });
        }

        // If user, check their own data
        const userTrackers = await PeriodTracker.find({ userId: id });
        console.log('[DEBUG] User own trackers count:', userTrackers.length);
        
        return res.json({
            userRole: role,
            userId: id,
            parentOf,
            partnerOf,
            trackerCount: userTrackers.length,
            trackers: userTrackers.map(t => ({
                _id: t._id,
                userId: t.userId,
                cycleInfo: t.cycleInfo,
                moodTrackingCount: t.moodTracking?.length || 0,
                symptomTrackingCount: t.symptomTracking?.length || 0,
                sleepTrackingCount: t.sleepTracking?.length || 0,
                createdAt: t.createdAt
            }))
        });
    } catch (error) {
        console.error('[DEBUG] Error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
