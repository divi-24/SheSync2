import { apiFetch } from './api';

export interface Invitation {
  id: string;
  inviterName: string;
  type: 'parent' | 'partner';
  createdAt: string;
}

/**
 * Send invitation to parent or partner
 */
export async function sendInvitation(
  inviteeEmail: string,
  type: 'parent' | 'partner'
): Promise<{
  success: boolean;
  message: string;
  warning?: string;
  invitationId?: string;
  error?: string;
}> {
  try {
    const response = await apiFetch('/api/invitations/send', {
      method: 'POST',
      body: JSON.stringify({
        inviteeEmail,
        type
      })
    }) as any;

    if (response.ok) {
      return response.body;
    } else {
      return {
        success: false,
        message: response.body?.error || 'Failed to send invitation',
        error: response.body?.error
      };
    }
  } catch (error) {
    console.error('Send invitation error:', error);
    return {
      success: false,
      message: 'Failed to send invitation',
      error: String(error)
    };
  }
}

/**
 * Get pending invitations for current user
 */
export async function getPendingInvitations(): Promise<Invitation[]> {
  try {
    const response = await apiFetch('/api/invitations/pending') as any;

    if (response.ok && response.body?.invitations) {
      return response.body.invitations;
    }
    return [];
  } catch (error) {
    console.error('Get pending invitations error:', error);
    return [];
  }
}

/**
 * Accept invitation
 */
export async function acceptInvitation(invitationId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    const response = await apiFetch(`/api/invitations/${invitationId}/accept`, {
      method: 'POST',
      body: JSON.stringify({})
    }) as any;

    if (response.ok) {
      return response.body;
    } else {
      return {
        success: false,
        message: response.body?.error || 'Failed to accept invitation',
        error: response.body?.error
      };
    }
  } catch (error) {
    console.error('Accept invitation error:', error);
    return {
      success: false,
      message: 'Failed to accept invitation',
      error: String(error)
    };
  }
}

/**
 * Reject invitation
 */
export async function rejectInvitation(invitationId: string): Promise<{
  success: boolean;
  message: string;
  error?: string;
}> {
  try {
    const response = await apiFetch(`/api/invitations/${invitationId}/reject`, {
      method: 'POST',
      body: JSON.stringify({})
    }) as any;

    if (response.ok) {
      return response.body;
    } else {
      return {
        success: false,
        message: response.body?.error || 'Failed to reject invitation',
        error: response.body?.error
      };
    }
  } catch (error) {
    console.error('Reject invitation error:', error);
    return {
      success: false,
      message: 'Failed to reject invitation',
      error: String(error)
    };
  }
}
