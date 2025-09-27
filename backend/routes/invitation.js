import express from 'express';
import bcrypt from 'bcryptjs';
import Invitation from '../models/invitation.js';
import { authMiddleware
 } from '../middleware/auth.js';

const router = express.Router();

router.post('/invite-parent', authMiddleware, async (req, res) => {
  try {
    const { parentEmail, parentPassword } = req.body;
    if (!parentEmail || !parentPassword) {
      return res.status(400).json({ message: 'Parent email and password required' });
    }

    // Only normal users can send invites
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Only users can send invitations' });
    }

    // Hash parent password before storing
    const passwordHash = await bcrypt.hash(parentPassword, 10);

    const invitation = await Invitation.create({
      userId: req.user.id,
      parentEmail,
      passwordHash,
      used: false,
    });

    res.status(201).json({ message: 'Invitation created', invitation });
  } catch (err) {
    console.error('Invite parent error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
