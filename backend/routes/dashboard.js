import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import User from '../models/user.js';

const router = express.Router();

// Dashboard data for a user, accessible by:
// - the user themselves
// - their connected parent
// - their connected partner
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const { id: loggedInId, role, parentOf, partnerOf } = req.user;
    const { userId } = req.params;
    
    console.log('[Dashboard] Access check:', {
      loggedInId,
      role,
      parentOf,
      partnerOf,
      requestedUserId: userId
    });

    // Role-based access control
    if (role === 'user') {
      if (loggedInId !== userId) {
        console.log('[Dashboard] User role check failed');
        return res.status(403).json({ message: 'Forbidden' });
      }
    } else if (role === 'parent') {
      if (parentOf !== userId) {
        console.log('[Dashboard] Parent role check failed', { parentOf, userId });
        return res.status(403).json({ message: 'Forbidden' });
      }
      console.log('[Dashboard] Parent role check passed');
    } else if (role === 'partner') {
      if (partnerOf !== userId) {
        console.log('[Dashboard] Partner role check failed', { partnerOf, userId });
        return res.status(403).json({ message: 'Forbidden' });
      }
      console.log('[Dashboard] Partner role check passed');
    } else {
      console.log('[Dashboard] Invalid role');
      return res.status(403).json({ message: 'Forbidden' });
    }

    // Fetch target user's public profile
    const user = await User.findById(userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (err) {
    console.error('Dashboard route error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
