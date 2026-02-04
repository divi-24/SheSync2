/* eslint-disable */

"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getProfile } from "../../lib/auth";
import { API_BASE } from "../../lib/api";
import { sendInvitation } from "../../lib/invitations";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Heart,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Clock,
  AlertCircle,
  CalendarDays,
  Droplets,
  Gift,
  MessageSquare,
  Moon,
  Zap,
  ChevronRight,
  Users,
  Mail,
  Send,
  Check,
} from "lucide-react";
import { Cookie } from "next/font/google";

const cookie = Cookie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cookie",
});

export default function PartnerPage() {
  return (
    <ProtectedRoute>
      <PartnerPageInner />
    </ProtectedRoute>
  );
}

function PartnerPageInner() {
  const [user, setUser] = useState<any | null>(null);
  const [partnerData, setPartnerData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);

        // Fetch partner data if user is a parent
        if (profile.role === "parent" && profile.parentOf) {
          const response = await fetch(`${API_BASE}/api/dashboard/${profile.parentOf}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setPartnerData(data.user);
          } else {
            setError("Could not load partner data");
          }
        }
        // If not a parent yet, just show the invite-only view
      } catch (err: any) {
        console.error("Error loading partner data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800">Loading partner dashboard...</h3>
        </motion.div>
      </div>
    );
  }

  // If user is not a parent yet, show invite-only view
  if (!user || user.role !== "parent") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-fuchsia-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
              <div className="mb-6">
                <Heart className="w-20 h-20 text-red-500 mx-auto animate-pulse mb-6" />
              </div>
              <h1 className={`${cookie.className} text-4xl mb-4`}>
                <span className="bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
                  Connect with Your Partner
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto">
                Send an invitation to your partner to help them understand and support your menstrual health journey. They'll get access to educational content and cycle insights.
              </p>

              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-8 mb-8 border border-pink-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">What They'll Get Access To:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="flex gap-3">
                    <div className="text-2xl">📊</div>
                    <div>
                      <p className="font-semibold text-gray-800">Your Cycle Data</p>
                      <p className="text-sm text-gray-600">View your current phase and predictions</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">📚</div>
                    <div>
                      <p className="font-semibold text-gray-800">Educational Content</p>
                      <p className="text-sm text-gray-600">Learn about menstrual health</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">💡</div>
                    <div>
                      <p className="font-semibold text-gray-800">Support Tips</p>
                      <p className="text-sm text-gray-600">How to be a caring partner</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="text-2xl">💌</div>
                    <div>
                      <p className="font-semibold text-gray-800">Send Care Messages</p>
                      <p className="text-sm text-gray-600">Share love and support</p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowInviteModal(true)}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all font-semibold text-lg inline-flex items-center gap-2 mb-6"
              >
                <Mail className="w-5 h-5" />
                Send Invitation Now
              </button>

              <p className="text-gray-600">
                Not ready yet?{" "}
                <button
                  onClick={() => router.push("/dashboard")}
                  className="text-pink-600 hover:text-pink-700 font-semibold"
                >
                  Return to Dashboard
                </button>
              </p>
            </div>
          </motion.div>
        </div>

        {/* Invitation Modal */}
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-pink-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Invite Your Partner</h2>
              </div>

              {inviteSuccess ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Invitation Sent!</h3>
                  <p className="text-gray-600">They'll receive an email with instructions to join</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSendInvite} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partner's Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="partner@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <p className="text-sm text-gray-600">
                    They'll receive an invitation to view your cycle data and learn how to support you better.
                  </p>

                  {inviteError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                      {inviteError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={inviteSending}
                      className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {inviteSending ? "Sending..." : "Send Invite"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }

  if (error || !partnerData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-fuchsia-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Connection Not Found</h3>
          <p className="text-gray-600">{error || "Partner data is not available"}</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="mt-6 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
          >
            Back to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-fuchsia-100">
      {/* Header */}
      <div className="backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
          >
            <div className="flex-1">
              <h1 className={`${cookie.className} text-4xl lg:text-6xl mb-3`}>
                <span className="bg-gradient-to-r from-pink-500 via-rose-400 to-red-500 bg-clip-text text-transparent">
                  Supporting {partnerData?.name}
                </span>
              </h1>
              <p className="text-gray-600 text-lg max-w-2xl">
                Your compassionate guide to understanding and supporting your partner's menstrual health journey
              </p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl p-6 shadow-lg border border-pink-200"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Connected With</p>
                  <p className="text-lg font-bold text-gray-800">{partnerData?.name}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Invitation Modal */}
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-pink-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Invite Your Partner</h2>
              </div>

              {inviteSuccess ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Invitation Sent!</h3>
                  <p className="text-gray-600">They'll receive an email with instructions to join</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSendInvite} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partner's Email Address
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="partner@example.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>

                  <p className="text-sm text-gray-600">
                    They'll receive an invitation to view your cycle data and learn how to support you better.
                  </p>

                  {inviteError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                      {inviteError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={inviteSending}
                      className="flex-1 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      {inviteSending ? "Sending..." : "Send Invite"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Invitation Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Want to Connect with Another Partner?</h3>
                <p className="text-sm text-gray-600">Invite someone to join and explore this dashboard together</p>
              </div>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium transition-colors flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Send Invitation
            </button>
          </div>
        </motion.section>

        {/* Health Overview Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Health Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Cycle Phase Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-xl p-6 shadow-md border border-pink-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <CalendarDays className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Current Phase</h3>
              </div>
              <p className="text-3xl font-bold text-pink-600 mb-2">Follicular</p>
              <p className="text-sm text-gray-600">Day 7 of cycle</p>
              <div className="mt-4 p-3 bg-pink-50 rounded-lg text-sm text-gray-700">
                Energy levels rising • Mood improving
              </div>
            </motion.div>

            {/* Days Until Period */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-md border border-purple-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Next Period</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600 mb-2">21 days</p>
              <p className="text-sm text-gray-600">Expected: Feb 21, 2026</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: "33%" }}></div>
              </div>
            </motion.div>

            {/* Fertility Window */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-white rounded-xl p-6 shadow-md border border-green-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Fertility</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Low probability</p>
              <p className="text-2xl font-bold text-green-600 mb-2">3%</p>
              <p className="text-xs text-gray-500">Next fertile window: Feb 10-16</p>
            </motion.div>

            {/* Mood & Symptoms */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-md border border-blue-200 hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Droplets className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Today's Status</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Mood: Good</p>
              <div className="space-y-1 text-sm">
                <p className="text-gray-700">✓ No major symptoms</p>
                <p className="text-gray-700">✓ Sleep: 7.5 hours</p>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Educational Hub */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            Educational Hub
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Understanding the Menstrual Cycle",
                description: "Learn about the 4 phases: menstruation, follicular, ovulation, and luteal.",
                icon: CalendarDays,
                color: "pink",
              },
              {
                title: "Hormonal Changes & Mood",
                description: "How estrogen and progesterone affect mood, energy, and emotional wellbeing.",
                icon: TrendingUp,
                color: "purple",
              },
              {
                title: "Common Symptoms & Relief",
                description: "PMS, cramps, bloating, and fatigue - causes and how to help manage them.",
                icon: AlertCircle,
                color: "red",
              },
              {
                title: "Intimacy During the Cycle",
                description: "Communication, comfort, and connection during different cycle phases.",
                icon: Heart,
                color: "rose",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + idx * 0.05 }}
                className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 rounded-xl p-6 shadow-md border border-${item.color}-200 hover:shadow-lg transition-all cursor-pointer group`}
              >
                <div className={`bg-${item.color}-200 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className={`w-6 h-6 text-${item.color}-700`} />
                </div>
                <h3 className={`font-semibold text-gray-800 mb-2 text-${item.color}-900`}>{item.title}</h3>
                <p className="text-gray-700 text-sm mb-4">{item.description}</p>
                <div className="flex items-center text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  Learn More <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Care Suggestions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Gift className="w-6 h-6 text-red-500" />
            Ways to Show Love & Support
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Follicular Phase */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-md border border-green-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-200 px-3 py-1 rounded-full text-sm font-semibold text-green-700">
                  Follicular Phase (Days 1-13)
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                <strong>Energy & Mood:</strong> Rising confidence, outgoing energy, optimism
              </p>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Suggest active dates</p>
                    <p className="text-sm text-gray-600">She'll have more energy - hiking, sports, adventure!</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Plan social events</p>
                    <p className="text-sm text-gray-600">Her social confidence is peaking - perfect for meeting friends</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Compliment her glow</p>
                    <p className="text-sm text-gray-600">Hormonal changes make skin radiant - notice and celebrate it!</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Luteal Phase */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
              className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 shadow-md border border-orange-200"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-orange-200 px-3 py-1 rounded-full text-sm font-semibold text-orange-700">
                  Luteal Phase (Days 14-28)
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                <strong>Energy & Mood:</strong> Introspective, sensitive, needs rest & support
              </p>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Cozy nights in</p>
                    <p className="text-sm text-gray-600">Movies, comfort food, cuddles, and low-key time together</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Take care of chores</p>
                    <p className="text-sm text-gray-600">Cooking, cleaning, errands - ease her workload this week</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-medium text-gray-800">Listen without fixing</p>
                    <p className="text-sm text-gray-600">She may need emotional support - be her safe space</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Quick Care Gifts & Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Thoughtful Gift & Care Ideas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "Heating Pad", description: "Perfect for cramp relief during menstruation", icon: "🔥" },
              { title: "Dark Chocolate", description: "Boosts mood + magnesium helps reduce PMS", icon: "🍫" },
              { title: "Herbal Teas", description: "Ginger, chamomile, peppermint for comfort", icon: "🫖" },
              { title: "Comfort Food", description: "Iron-rich foods during period phase", icon: "🍗" },
              { title: "Spa Gifts", description: "Bath bombs, essential oils, candles for relaxation", icon: "🛁" },
              { title: "Flowers (Not Period)", description: "Surprise her on good mood days!", icon: "🌹" },
            ].map((gift, idx) => (
              <motion.div
                key={gift.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + idx * 0.05 }}
                className="bg-white rounded-lg p-6 shadow-md border border-pink-100 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-3">{gift.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-2">{gift.title}</h3>
                <p className="text-sm text-gray-600">{gift.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Communication Tips */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl p-8 shadow-md border border-purple-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-200 p-3 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-700" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Communication Tips</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-green-500">✓</span> Things to Say
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>"How are you feeling today? Anything I can help with?"</li>
                  <li>"Your period tracker says cramps are high - want a heating pad?"</li>
                  <li>"I love how you share this with me - it helps me support you better"</li>
                  <li>"No pressure on intimacy - I'm happy just being here for you"</li>
                  <li>"You're doing amazing taking care of your health"</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-red-500">✗</span> Things to Avoid
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>"Are you on your period?" (dismissive tone)</li>
                  <li>"It's just PMS" (invalidating her feelings)</li>
                  <li>Making period jokes (even if meant as humor)</li>
                  <li>Treating her differently unless she asks for help</li>
                  <li>Expecting the same energy during low phases</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* My Partner Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-pink-500" />
            Stay Connected
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl p-6 shadow-md border border-pink-200 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-pink-100 p-3 rounded-lg">
                  <Moon className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Sleep & Rest Reminders</h3>
              </div>
              <p className="text-gray-600 mb-4">Get notified when she's in her luteal phase - perfect time to suggest rest days together</p>
              <button className="text-pink-600 font-medium flex items-center gap-2 hover:text-pink-700">
                Enable Notifications <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white rounded-xl p-6 shadow-md border border-purple-200 hover:shadow-lg transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Send Care Messages</h3>
              </div>
              <p className="text-gray-600 mb-4">Write personalized notes of support and encouragement for her to receive</p>
              <button className="text-purple-600 font-medium flex items-center gap-2 hover:text-purple-700">
                Send Message <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* Health Tip */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-pink-100 via-rose-100 to-red-100 rounded-2xl p-8 border border-pink-300">
            <div className="flex items-start gap-4">
              <Zap className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">Did You Know?</h3>
                <p className="text-gray-700 leading-relaxed">
                  During her luteal phase (the 2 weeks before her period), her body temperature is naturally higher, she needs more calories, and her progesterone levels drop - which can cause mood changes. Understanding this helps you be more compassionate and supportive during this time. It's not "just mood swings" - it's biology!
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
