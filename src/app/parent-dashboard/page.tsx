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
  ArrowLeft,
} from "lucide-react";
import { Cookie } from "next/font/google";
import Link from "next/link";

const cookie = Cookie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cookie",
});

export default function ParentDashboard() {
  return (
    <ProtectedRoute>
      <ParentDashboardInner />
    </ProtectedRoute>
  );
}

interface ChildProfile {
  _id: string;
  name: string;
  email: string;
  lastActive?: string;
  [key: string]: any;
}

interface CycleInfo {
  averageCycleLength?: number;
  lastPeriodDate?: string;
  [key: string]: any;
}

function ParentDashboardInner() {
  const [user, setUser] = useState<{ parentOf?: string; email?: string } | null>(null);
  const [childData, setChildData] = useState<ChildProfile | null>(null);
  const [cycleData, setCycleData] = useState<CycleInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadChildData() {
    try {
      console.log('[parent-dashboard] Starting loadChildData');
      const profile = await getProfile();
      console.log('[parent-dashboard] Parent profile loaded:', profile);
      setUser(profile);

      // If parent has parentOf (pointing to child), fetch child's data
      if (profile && profile.parentOf) {
        console.log('[parent-dashboard] Fetching child data for ID:', profile.parentOf);
        console.log('[parent-dashboard] API_BASE:', API_BASE);
        console.log('[parent-dashboard] Full URL will be:', `${API_BASE}/api/dashboard/${profile.parentOf}`);
        
        const dashboardRes = (await apiFetch(`/api/dashboard/${profile.parentOf}`)) as {
          ok: boolean;
          status: number;
          body?: { user?: ChildProfile };
        };

        console.log('[parent-dashboard] Dashboard response:', dashboardRes);
        console.log('[parent-dashboard] Dashboard response status:', dashboardRes.status);
        console.log('[parent-dashboard] Dashboard response ok:', dashboardRes.ok);
        console.log('[parent-dashboard] Dashboard response body:', dashboardRes.body);
        
        if (dashboardRes.ok && dashboardRes.body?.user) {
          console.log('[parent-dashboard] Child data received:', dashboardRes.body.user);
          setChildData(dashboardRes.body.user);

          // Fetch cycle data
           const cycleRes = (await apiFetch(`/api/cycles?userId=${profile.parentOf}`)) as {
             ok: boolean;
             status: number;
             body?: any[];
           };
           console.log('[parent-dashboard] Cycle response status:', cycleRes.status);
           console.log('[parent-dashboard] Cycle response ok:', cycleRes.ok);
           console.log('[parent-dashboard] Cycle response body:', cycleRes.body);
           
           if (cycleRes.ok && Array.isArray(cycleRes.body) && cycleRes.body.length > 0) {
             // Get the most recent cycle
             const mostRecentCycle = cycleRes.body[0];
             const processedCycleData: CycleInfo = {
               averageCycleLength: mostRecentCycle.cycleLength,
               lastPeriodDate: mostRecentCycle.startDate
             };
             console.log('[parent-dashboard] Cycle data received:', processedCycleData);
             setCycleData(processedCycleData);
           } else {
             console.log('[parent-dashboard] No cycle data available');
             setCycleData(null);
           }
        } else {
          const errorMsg = (dashboardRes.body as any)?.message || `Status: ${dashboardRes.status}`;
          console.error('[parent-dashboard] Dashboard fetch failed:', {
            ok: dashboardRes.ok,
            status: dashboardRes.status,
            body: dashboardRes.body,
            message: errorMsg
          });
          setError(`Could not load child data: ${errorMsg}`);
        }
      } else {
        console.log('[parent-dashboard] No parentOf found in profile or profile is null');
        setChildData(null);
        setCycleData(null);
      }
    } catch (err: any) {
      console.error("[parent-dashboard] Error loading child data:", err);
      setError(`Error: ${err.message || JSON.stringify(err)}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadChildData();

    // Listen for connection acceptance events
    const handleConnectionAccepted = async () => {
      // Reload data after a small delay to ensure backend is updated
      setTimeout(async () => {
        await loadChildData();
      }, 500);
    };

    invitationEvents.addEventListener('connectionAccepted', handleConnectionAccepted);
    return () => {
      invitationEvents.removeEventListener('connectionAccepted', handleConnectionAccepted);
    };
  }, []);

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
          {/* Header with back button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Link
              href="/parent"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-semibold mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Parent Panel
            </Link>
            <h1
              className={`${cookie.className} text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent`}
            >
              Child's Health Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Monitor and support your child's health journey
            </p>
          </motion.div>

          {/* No Connection State */}
          {!childData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 md:p-12 text-center max-w-2xl mx-auto"
            >
              <div className="bg-gradient-to-br from-pink-100 to-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                No Child Connected
              </h2>
              <p className="text-gray-600 mb-8">
                You haven't been invited by any child yet. Once a child invites you, their health data will appear here.
              </p>

              <Link
                href="/parent"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
                Go to Parent Panel
              </Link>
            </motion.div>
          )}

          {/* Child Connected State */}
          {childData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid md:grid-cols-3 gap-6"
            >
              {/* Child Info Card */}
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
                    {childData.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">{childData.email}</p>

                  <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                    <div className="text-left">
                      <p className="text-xs text-gray-600 uppercase tracking-wide font-semibold">
                        Last Active
                      </p>
                      <p className="text-gray-800 font-medium">
                        {childData.lastActive
                          ? new Date(childData.lastActive).toLocaleDateString()
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
