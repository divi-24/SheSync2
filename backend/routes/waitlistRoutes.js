import express from 'express';
import {
    joinWaitlist,
    getWaitlistStats,
    removeFromWaitlist,
    waitlistRateLimit
} from '../controllers/waitlistController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/join', waitlistRateLimit, joinWaitlist);
router.post('/remove', removeFromWaitlist);

// Protected routes (admin only)
router.get('/stats', authMiddleware, getWaitlistStats);

export default router;