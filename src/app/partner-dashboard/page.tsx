/* eslint-disable */

"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getProfile } from "../../lib/auth";
import { API_BASE, apiFetch } from "../../lib/api";
import { invitationEvents } from "../../components/PendingInvitations";
import { motion } from "framer-motion";
import {
  Heart,
  Calendar,
  Droplets,
  TrendingUp,
  Clock,
  AlertCircle,
  ChevronRight,
  Mail,
  Send,
  Check,
  MessageSquare,
} from "lucide-react";
import { Cookie } from "next/font/google";
import { sendInvitation } from "../../lib/invitations";

const cookie = Cookie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cookie",
});

export default function PartnerDashboard() {
  return (
    <ProtectedRoute>
      <PartnerDashboardInner />
    </ProtectedRoute>
  );
}

function PartnerDashboardInner() {
  const [user, setUser] = useState<any | null>(null);
  const [partnerData, setPartnerData] = useState<any | null>(null);
  const [cycleData, setCycleData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);

  async function loadPartnerData() {
    try {
      const profile = await getProfile();
      setUser(profile);

      // If partner is already connected, fetch their data
      if (profile.partnerOf) {
        const dashboardRes = (await apiFetch(`/api/dashboard/${profile.partnerOf}`)) as {
          ok: boolean;
          body?: { user?: any };
        };

        if (dashboardRes.ok && dashboardRes.body?.user) {
          setPartnerData(dashboardRes.body.user);

          // Fetch cycle data
          const cycleRes = (await apiFetch(`/api/cycles?userId=${profile.partnerOf}`)) as {
            ok: boolean;
            body?: any;
          };
          if (cycleRes.ok && cycleRes.body) {
            setCycleData(cycleRes.body);
          }
        } else {
          setError("Could not load partner data");
        }
      } else {
        setPartnerData(null);
        setCycleData(null);
      }
    } catch (err: any) {
      console.error("Error loading partner data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPartnerData();

    // Listen for connection acceptance events
    const handleConnectionAccepted = async () => {
      // Reload data after a small delay to ensure backend is updated
      setTimeout(async () => {
        await loadPartnerData();
      }, 500);
    };

    invitationEvents.addEventListener('connectionAccepted', handleConnectionAccepted);
    return () => {
      invitationEvents.removeEventListener('connectionAccepted', handleConnectionAccepted);
    };
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteSending(true);
    setInviteError(null);
    setInviteSuccess(false);

    try {
      const result = await sendInvitation(inviteEmail, "partner");

      if (result.success) {
        setInviteSuccess(true);
        setInviteEmail("");
        setTimeout(() => {
          setShowInviteModal(false);
          setInviteSuccess(false);
        }, 2000);
      } else {
        setInviteError(result.error || "Failed to send invitation");
      }
    } catch (err: any) {
      setInviteError(err.message || "Error sending invitation");
    } finally {
      setInviteSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-fuchsia-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800">Loading...</h3>
        </motion.div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-fuchsia-100 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h1
              className={`${cookie.className} text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent`}
            >
              Partner Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Support and stay connected with your partner's health journey
            </p>
          </motion.div>

          {/* No Connection State */}
          {!partnerData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 text-center max-w-2xl mx-auto"
            >
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Connect with Your Partner
              </h2>
              <p className="text-gray-600 mb-8">
                Send an invitation to your partner to share health insights and
                support each other's wellness journey
              </p>

              <button
                onClick={() => setShowInviteModal(true)}
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Mail className="w-5 h-5" />
                Send Invitation
              </button>

              {/* Invite Modal */}
              {showInviteModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                  onClick={() => setShowInviteModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="bg-white rounded-2xl p-8 max-w-md w-full"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                      Invite Your Partner
                    </h3>

                    {inviteSuccess ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8"
                      >
                        <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                        <p className="text-green-600 font-semibold">
                          Invitation sent successfully!
                        </p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSendInvite} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Partner Email
                          </label>
                          <input
                            type="email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="partner@example.com"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                          />
                        </div>

                        {inviteError && (
                          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                            {inviteError}
                          </div>
                        )}

                        <div className="flex gap-3 pt-4">
                          <button
                            type="button"
                            onClick={() => setShowInviteModal(false)}
                            className="flex-1 px-4 py-2 bg-gray-100 text-gray-800 font-semibold rounded-lg hover:bg-gray-200 transition"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={inviteSending}
                            className="flex-1 px-4 py-2 bg-pink-500 text-white font-semibold rounded-lg hover:bg-pink-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
                          >
                            {inviteSending ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4" />
                                Send
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Partner Connected State */}
          {partnerData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {/* Partner Info Card */}
              <motion.div
                className="md:col-span-1 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {partnerData.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">{partnerData.email}</p>

                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <div className="text-left">
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
                        Last Active
                      </p>
                      <p className="text-gray-800 font-medium">
                        {partnerData.lastActive
                          ? new Date(partnerData.lastActive).toLocaleDateString()
                          : "Never"}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Health Overview */}
              <motion.div
                className="md:col-span-2 space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {/* Cycle Status */}
                {cycleData && (
                  <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-pink-100 p-3 rounded-xl">
                        <Calendar className="w-6 h-6 text-pink-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Cycle Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-pink-50 rounded-xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide">
                          Cycle Length
                        </p>
                        <p className="text-2xl font-bold text-pink-600 mt-1">
                          {cycleData.averageCycleLength || "—"} days
                        </p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4">
                        <p className="text-xs text-gray-600 uppercase tracking-wide">
                          Last Period
                        </p>
                        <p className="text-sm font-semibold text-gray-800 mt-1">
                          {cycleData.lastPeriodDate
                            ? new Date(cycleData.lastPeriodDate).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Health Metrics */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-rose-100 p-3 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-rose-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Health Overview
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-pink-600" />
                        <span className="text-gray-700">Overall Wellness</span>
                      </div>
                      <span className="font-semibold text-pink-600">Good</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-purple-600" />
                        <span className="text-gray-700">Tracking Consistency</span>
                      </div>
                      <span className="font-semibold text-purple-600">
                        {cycleData ? "Active" : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Support Actions */}
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Support
                    </h3>
                  </div>

                  <button className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                    Send a Support Message
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl text-center mt-8"
            >
              {error}
            </motion.div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
