"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Check, X, Clock } from 'lucide-react';
import { getPendingInvitations, acceptInvitation, rejectInvitation } from '@/lib/invitations';

interface Invitation {
  id: string;
  inviterName: string;
  type: 'parent' | 'partner';
  createdAt: string;
}

// Global event emitter for invitation changes
export const invitationEvents = new EventTarget();

export default function PendingInvitations() {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
    
    // Listen for invitation acceptance events from parent/partner pages
    const handleRefresh = () => {
      fetchInvitations();
    };
    
    invitationEvents.addEventListener('refresh', handleRefresh);
    return () => {
      invitationEvents.removeEventListener('refresh', handleRefresh);
    };
  }, []);

  async function fetchInvitations() {
    setLoading(true);
    const data = await getPendingInvitations();
    setInvitations(data);
    setLoading(false);
  }

  async function handleAccept(invitationId: string) {
    setProcessingId(invitationId);
    const result = await acceptInvitation(invitationId);
    
    if (result.success) {
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
      // Emit event so parent/partner pages can refresh their data
      invitationEvents.dispatchEvent(new Event('connectionAccepted'));
      // Could show a success toast here
    }
    setProcessingId(null);
  }

  async function handleReject(invitationId: string) {
    setProcessingId(invitationId);
    const result = await rejectInvitation(invitationId);
    
    if (result.success) {
      setInvitations(invitations.filter(inv => inv.id !== invitationId));
    }
    setProcessingId(null);
  }

  if (loading || invitations.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      {invitations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-0 left-0 right-0 z-50 p-4"
        >
          <div className="max-w-2xl mx-auto space-y-3">
            {invitations.map((invitation) => (
              <motion.div
                key={invitation.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg shadow-lg p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-pink-100 p-3 rounded-lg flex-shrink-0">
                    <Mail className="w-5 h-5 text-pink-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">
                      {invitation.inviterName} invited you as a {invitation.type}
                    </p>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      Invitation sent {new Date(invitation.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleAccept(invitation.id)}
                      disabled={processingId === invitation.id}
                      className="bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleReject(invitation.id)}
                      disabled={processingId === invitation.id}
                      className="bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-700 px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Decline
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
