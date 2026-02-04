import Invitation from '../models/invitation.js';
import User from '../models/user.js';
import ParentRequest from '../models/parentRequest.js';
import { sendInvitationEmail, sendAcceptanceNotificationEmail } from '../services/brevoService.js';

/**
 * Send invitation to parent or partner
 * POST /api/invitations/send
 */
export async function sendInvitation(req, res) {
  try {
    const { inviteeEmail, type } = req.body;
    const inviterId = req.user?.id; // from auth middleware

    if (!inviterId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!inviteeEmail || !type) {
      return res.status(400).json({ error: 'inviteeEmail and type are required' });
    }

    if (!['parent', 'partner'].includes(type)) {
      return res.status(400).json({ error: 'type must be "parent" or "partner"' });
    }

    // Check if inviter exists
    const inviter = await User.findById(inviterId);
    if (!inviter) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if invitee is already registered
    const existingUser = await User.findOne({ email: inviteeEmail });
    if (existingUser) {
      // If already registered, establish connection directly
      if (type === 'parent') {
        existingUser.parentOf = inviterId;
        if (existingUser.role === 'user') {
          existingUser.role = 'parent';
        }
        // Create parentRequest record
        await ParentRequest.findOneAndUpdate(
          { user: existingUser._id, parent: inviterId },
          { status: 'accepted' },
          { upsert: true, new: true }
        );
      } else if (type === 'partner') {
        existingUser.partnerOf = inviterId;
        if (existingUser.role === 'user') {
          existingUser.role = 'partner';
        }
      }
      await existingUser.save();

      // Notify inviter
      try {
        await sendAcceptanceNotificationEmail(
          inviter.email,
          inviter.name,
          existingUser.name,
          type
        );
      } catch (error) {
        console.error('Failed to send acceptance notification:', error);
      }

      return res.json({
        success: true,
        message: `${existingUser.name} is already registered. Connection established!`
      });
    }

    // Check if invitation already exists and is pending
    const existingInvitation = await Invitation.findOne({
      inviteeEmail,
      inviterId,
      type,
      status: 'pending'
    });

    if (existingInvitation) {
      return res.status(400).json({
        error: 'Pending invitation already exists for this email'
      });
    }

    // Create invitation
    const invitation = new Invitation({
      inviteeEmail,
      inviterId,
      inviterName: inviter.name,
      inviterEmail: inviter.email,
      type,
      status: 'pending'
    });

    await invitation.save();

    // Create a placeholder parentRequest record for pending invitations (for parent type)
    if (type === 'parent') {
      try {
        // Create a temporary user record or pending parentRequest
        // We'll use a pending parentRequest where parent is the inviter
        // and user field will be updated when the invitee signs up
        // For now, store the invitation ID in a metadata field if needed
        // But more practically, we can just rely on the Invitation model
        // The parent dashboard should check both Invitation and ParentRequest
      } catch (error) {
        console.error('Failed to create parentRequest record:', error);
      }
    }

    // Send invitation email
    try {
      await sendInvitationEmail(
        inviteeEmail,
        inviter.name,
        inviter.email,
        type,
        process.env.APP_URL || 'http://localhost:3000'
      );
    } catch (error) {
      console.error('Failed to send invitation email:', error);
      // Still save the invitation, but return warning
      return res.json({
        success: true,
        warning: 'Invitation saved but email delivery failed. User can still sign up with their email.',
        invitationId: invitation._id
      });
    }

    res.json({
      success: true,
      message: `Invitation sent to ${inviteeEmail}`,
      invitationId: invitation._id
    });
  } catch (error) {
    console.error('Send invitation error:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
}

/**
 * Get pending invitations for a user
 * GET /api/invitations/pending
 */
export async function getPendingInvitations(req, res) {
  try {
    const email = req.user?.email;

    if (!email) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const invitations = await Invitation.find({
      inviteeEmail: email,
      status: 'pending'
    }).populate('inviterId', 'name email');

    res.json({
      success: true,
      invitations: invitations.map(inv => ({
        id: inv._id,
        inviterName: inv.inviterName,
        type: inv.type,
        createdAt: inv.createdAt
      }))
    });
  } catch (error) {
    console.error('Get pending invitations error:', error);
    res.status(500).json({ error: 'Failed to fetch invitations' });
  }
}

/**
 * Accept invitation
 * POST /api/invitations/:invitationId/accept
 */
export async function acceptInvitation(req, res) {
  try {
    const { invitationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const invitation = await Invitation.findById(invitationId).populate('inviterId');

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation has already been processed' });
    }

    // Verify email matches
    const user = await User.findById(userId);
    if (user.email !== invitation.inviteeEmail) {
      return res.status(403).json({ error: 'You cannot accept this invitation' });
    }

    // Update invitation
    invitation.status = 'accepted';
    invitation.acceptedAt = new Date();
    await invitation.save();

    // Establish connection and set role if needed
    if (invitation.type === 'parent') {
      user.parentOf = invitation.inviterId;
      if (user.role === 'user') {
        user.role = 'parent';
      }
      // Create or update parentRequest record for backward compatibility
      await ParentRequest.findOneAndUpdate(
        { user: userId, parent: invitation.inviterId },
        { status: 'accepted' },
        { upsert: true, new: true }
      );
    } else if (invitation.type === 'partner') {
      user.partnerOf = invitation.inviterId;
      if (user.role === 'user') {
        user.role = 'partner';
      }
    }
    await user.save();

    // Notify inviter
    try {
      await sendAcceptanceNotificationEmail(
        invitation.inviterId.email,
        invitation.inviterId.name,
        user.name,
        invitation.type
      );
    } catch (error) {
      console.error('Failed to send acceptance notification:', error);
    }

    res.json({
      success: true,
      message: `You've accepted the ${invitation.type} invitation from ${invitation.inviterName}`
    });
  } catch (error) {
    console.error('Accept invitation error:', error);
    res.status(500).json({ error: 'Failed to accept invitation' });
  }
}

/**
 * Reject invitation
 * POST /api/invitations/:invitationId/reject
 */
export async function rejectInvitation(req, res) {
  try {
    const { invitationId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const invitation = await Invitation.findById(invitationId);

    if (!invitation) {
      return res.status(404).json({ error: 'Invitation not found' });
    }

    if (invitation.status !== 'pending') {
      return res.status(400).json({ error: 'Invitation has already been processed' });
    }

    // Verify user
    const user = await User.findById(userId);
    if (user.email !== invitation.inviteeEmail) {
      return res.status(403).json({ error: 'You cannot reject this invitation' });
    }

    // Update invitation
    invitation.status = 'rejected';
    await invitation.save();

    res.json({
      success: true,
      message: 'Invitation rejected'
    });
  } catch (error) {
    console.error('Reject invitation error:', error);
    res.status(500).json({ error: 'Failed to reject invitation' });
  }
}
