import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import User from '../models/user.js';

const router = express.Router();

// Dashboard data for a user, accessible by:
// - the user themselves
// - their connected parent
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const { id: loggedInId, role, parentOf } = req.user;
    const { userId } = req.params;

    // Role-based access control
    if (role === 'user') {
      if (loggedInId !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    } else if (role === 'parent') {
      if (parentOf !== userId) {
        return res.status(403).json({ message: 'Forbidden' });
      }
    } else {
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
