import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  sendInvitation,
  getPendingInvitations,
  acceptInvitation,
  rejectInvitation
} from '../controllers/invitationController.js';

const router = express.Router();

// Send invitation to parent or partner
router.post('/send', authMiddleware, sendInvitation);

// Get pending invitations for logged-in user
router.get('/pending', authMiddleware, getPendingInvitations);

// Accept invitation
router.post('/:invitationId/accept', authMiddleware, acceptInvitation);

// Reject invitation
router.post('/:invitationId/reject', authMiddleware, rejectInvitation);

export default router;
