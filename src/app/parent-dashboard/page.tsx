/* eslint-disable */

"use client";

import React, { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getProfile, User } from "../../lib/auth";
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

interface HealthAnalytics {
    averageCycleDuration?: number;
    averagePeriodDuration?: number;
    cycleRegularity?: string;
    mostCommonMood?: string;
    mostCommonSymptom?: string;
    averageSleepDuration?: number;
    healthScore?: number;
    totalTrackers?: number;
    [key: string]: any;
}

interface SymptomData {
    name: string;
    severity: string;
    date: string;
}

interface MoodData {
    moodTypes: string[];
    intensity: string;
    date: string;
}

function ParentDashboardInner() {
    const [user, setUser] = useState<User | null>(null);
    const [childData, setChildData] = useState<ChildProfile | null>(null);
    const [cycleData, setCycleData] = useState<CycleInfo | null>(null);
    const [analytics, setAnalytics] = useState<HealthAnalytics | null>(null);
    const [recentSymptoms, setRecentSymptoms] = useState<SymptomData[]>([]);
    const [recentMoods, setRecentMoods] = useState<MoodData[]>([]);
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

                const dashboardRes = (await apiFetch(`/api/dashboard/${profile.parentOf}`)) as {
                    ok: boolean;
                    status: number;
                    body?: { user?: ChildProfile };
                };

                if (dashboardRes.ok && dashboardRes.body?.user) {
                    console.log('[parent-dashboard] Child data received:', dashboardRes.body.user);
                    setChildData(dashboardRes.body.user);

                    // Fetch cycle data
                    const cycleRes = (await apiFetch(`/api/cycles?userId=${profile.parentOf}`)) as {
                        ok: boolean;
                        status: number;
                        body?: any[];
                    };

                    if (cycleRes.ok && Array.isArray(cycleRes.body) && cycleRes.body.length > 0) {
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

                    // Fetch analytics data
                    const analyticsRes = (await apiFetch(`/api/period-tracker/analytics?userId=${profile.parentOf}`)) as {
                        ok: boolean;
                        status: number;
                        body?: any;
                    };

                    console.log('[parent-dashboard] Analytics response full:', analyticsRes);
                    console.log('[parent-dashboard] Analytics response body:', analyticsRes.body);

                    if (analyticsRes.ok && analyticsRes.body) {
                        // Handle both response formats
                        const analyticsData = analyticsRes.body.data || analyticsRes.body;
                        console.log('[parent-dashboard] Analytics data to use:', analyticsData);
                        setAnalytics(analyticsData);
                    } else {
                        console.log('[parent-dashboard] No analytics data available, status:', analyticsRes.status);
                    }

                    // Fetch period tracker history for recent symptoms and moods
                    const trackerHistoryRes = (await apiFetch(`/api/period-tracker/history?userId=${profile.parentOf}&limit=5`)) as {
                        ok: boolean;
                        status: number;
                        body?: any;
                    };

                    console.log('[parent-dashboard] Tracker history response:', trackerHistoryRes);

                    // Handle both response formats
                    let trackers: any[] = [];
                    if (trackerHistoryRes.ok && trackerHistoryRes.body) {
                        trackers = trackerHistoryRes.body.data?.trackers || trackerHistoryRes.body.trackers || [];
                    }

                    if (trackers.length > 0) {
                        console.log('[parent-dashboard] Processing', trackers.length, 'trackers');

                        // Extract recent symptoms
                        const symptoms: SymptomData[] = [];
                        trackers.forEach((tracker: any) => {
                            console.log('[parent-dashboard] Tracker moodTracking:', tracker.moodTracking);
                            console.log('[parent-dashboard] Tracker symptomTracking:', tracker.symptomTracking);
                            if (tracker.symptomTracking && Array.isArray(tracker.symptomTracking)) {
                                tracker.symptomTracking.forEach((symptom: any) => {
                                    if (symptom.symptoms && Array.isArray(symptom.symptoms)) {
                                        symptom.symptoms.forEach((s: any) => {
                                            symptoms.push({
                                                name: s.name,
                                                severity: s.severity,
                                                date: symptom.date || new Date().toISOString()
                                            });
                                        });
                                    }
                                });
                            }
                        });
                        console.log('[parent-dashboard] Extracted symptoms:', symptoms);
                        setRecentSymptoms(symptoms.slice(0, 5));

                        // Extract recent moods
                        const moods: MoodData[] = [];
                        trackers.forEach((tracker: any) => {
                            if (tracker.moodTracking && Array.isArray(tracker.moodTracking)) {
                                tracker.moodTracking.forEach((mood: any) => {
                                    moods.push({
                                        moodTypes: mood.moodTypes || [],
                                        intensity: mood.intensity,
                                        date: mood.date || new Date().toISOString()
                                    });
                                });
                            }
                        });
                        console.log('[parent-dashboard] Extracted moods:', moods);
                        setRecentMoods(moods.slice(0, 5));
                    } else {
                        console.log('[parent-dashboard] No tracker history available, response status:', trackerHistoryRes.status);
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
                setAnalytics(null);
                setRecentSymptoms([]);
                setRecentMoods([]);
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

                                {/* Health Metrics & Analytics */}
                                <div className="space-y-6">
                                    {/* Overall Health Score */}
                                    {analytics?.healthScore !== undefined && (
                                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-rose-100 p-3 rounded-xl">
                                                        <TrendingUp className="w-6 h-6 text-rose-600" />
                                                    </div>
                                                    <h3 className="text-xl font-semibold text-gray-800">
                                                        Overall Health Score
                                                    </h3>
                                                </div>
                                                <div className="text-4xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text">
                                                    {analytics.healthScore}/100
                                                </div>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-3">
                                                <div
                                                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all"
                                                    style={{ width: `${analytics.healthScore}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Cycle & Period Health */}
                                    {analytics && (
                                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-6">
                                                Cycle & Period Health
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-pink-50 rounded-xl p-4">
                                                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                                                        Avg Cycle Duration
                                                    </p>
                                                    <p className="text-2xl font-bold text-pink-600 mt-2">
                                                        {analytics.averageCycleDuration || "—"} days
                                                    </p>
                                                </div>
                                                <div className="bg-rose-50 rounded-xl p-4">
                                                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                                                        Avg Period Duration
                                                    </p>
                                                    <p className="text-2xl font-bold text-rose-600 mt-2">
                                                        {analytics.averagePeriodDuration || "—"} days
                                                    </p>
                                                </div>
                                                <div className="bg-purple-50 rounded-xl p-4">
                                                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                                                        Cycle Regularity
                                                    </p>
                                                    <p className="text-lg font-semibold text-purple-600 mt-2 capitalize">
                                                        {analytics.cycleRegularity ? analytics.cycleRegularity.replace(/_/g, " ") : "—"}
                                                    </p>
                                                </div>
                                                <div className="bg-indigo-50 rounded-xl p-4">
                                                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                                                        Total Tracked Cycles
                                                    </p>
                                                    <p className="text-2xl font-bold text-indigo-600 mt-2">
                                                        {analytics.totalTrackers || "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Mood & Symptom Patterns */}
                                    {analytics && (
                                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
                                            <h3 className="text-xl font-semibold text-gray-800 mb-6">
                                                Health Patterns
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
                                                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                                                        Most Common Mood
                                                    </p>
                                                    <p className="text-lg font-semibold text-amber-700 mt-2">
                                                        {analytics.mostCommonMood || "—"}
                                                    </p>
                                                </div>
                                                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4">
                                                    <p className="text-xs text-gray-600 uppercase tracking-wide">
                                                        Most Common Symptom
                                                    </p>
                                                    <p className="text-lg font-semibold text-red-700 mt-2">
                                                        {analytics.mostCommonSymptom || "—"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sleep Tracking */}
                                    {analytics?.averageSleepDuration !== undefined && (
                                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="bg-blue-100 p-3 rounded-xl">
                                                    <Clock className="w-6 h-6 text-blue-600" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-800">
                                                    Average Sleep Duration
                                                </h3>
                                            </div>
                                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                                                <p className="text-5xl font-bold text-blue-600 mb-2">
                                                    {analytics.averageSleepDuration} hours
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {analytics.averageSleepDuration >= 7 && analytics.averageSleepDuration <= 9
                                                        ? "Excellent sleep pattern"
                                                        : analytics.averageSleepDuration >= 6
                                                            ? "Good sleep pattern"
                                                            : "Could benefit from more rest"}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Recent Symptoms */}
                                    {recentSymptoms.length > 0 && (
                                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="bg-red-100 p-3 rounded-xl">
                                                    <AlertCircle className="w-6 h-6 text-red-600" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-800">
                                                    Recent Symptoms
                                                </h3>
                                            </div>
                                            <div className="space-y-3">
                                                {recentSymptoms.slice(0, 5).map((symptom, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium text-gray-800">{symptom.name}</p>
                                                            <p className="text-xs text-gray-600">
                                                                {new Date(symptom.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${symptom.severity === 'severe' ? 'bg-red-200 text-red-800' :
                                                            symptom.severity === 'moderate' ? 'bg-orange-200 text-orange-800' :
                                                                symptom.severity === 'mild' ? 'bg-yellow-200 text-yellow-800' :
                                                                    'bg-green-200 text-green-800'
                                                            }`}>
                                                            {symptom.severity}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Recent Moods */}
                                    {recentMoods.length > 0 && (
                                        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="bg-yellow-100 p-3 rounded-xl">
                                                    <Heart className="w-6 h-6 text-yellow-600" />
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-800">
                                                    Recent Moods
                                                </h3>
                                            </div>
                                            <div className="space-y-3">
                                                {recentMoods.slice(0, 5).map((mood, idx) => (
                                                    <div key={idx} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                                        <div>
                                                            <p className="font-medium text-gray-800">
                                                                {mood.moodTypes.join(", ")}
                                                            </p>
                                                            <p className="text-xs text-gray-600">
                                                                {new Date(mood.date).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${mood.intensity === 'high' ? 'bg-red-200 text-red-800' :
                                                            mood.intensity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                                                'bg-green-200 text-green-800'
                                                            }`}>
                                                            {mood.intensity}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
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
