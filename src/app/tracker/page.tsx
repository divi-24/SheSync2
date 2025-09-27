/* eslint-disable */

"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getProfile } from "../../lib/auth";
import PeriodTracking, { PeriodData } from "../../components/tracker/PeriodTracking";
import HealthTracking, { HealthData } from "../../components/tracker/HealthTracking";

import {
  CheckCircle,
  User,
  Calendar,
  HeartPulse,
  TrendingUp,
  History,
  Activity,
  Lightbulb,
  X,
  Eye,
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "next/font/google";

const cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
});

export default function PeriodTracker() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const [periodData, setPeriodData] = useState<PeriodData>({
    cycleDuration: "",
    lastPeriodStart: "",
    lastPeriodDuration: "",
    nextPeriodPrediction: "",
  });
  const [healthData, setHealthData] = useState<HealthData>({
    moodTypes: [],
    moodSeverity: "",
    moodDate: new Date().toISOString().split('T')[0],
    symptoms: [],
    symptomSeverities: {},
    symptomDate: new Date().toISOString().split('T')[0],
    sleepDuration: "",
    sleepQuality: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal states
  const [modals, setModals] = useState({
    analytics: false,
    history: false,
    active: false,
  });

  // Analytics data type
  type AnalyticsData = {
    averageCycleLength?: number;
    healthScore?: number;
    [key: string]: any;
  };

  // Data states

  type TrackerData = {
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
    privacy?: string;
    cycleInfo?: {
      cycleDuration?: number;
      lastPeriodStart?: string;
      lastPeriodDuration?: number;
      nextPeriodPrediction?: string;
    };
    moodTracking?: Array<{
      moodTypes?: string[];
      intensity?: string;
      date?: string;
      notes?: string;
    }>;
    symptomTracking?: Array<{
      symptoms?: Array<{
        name?: string;
        severity?: string;
      }>;
      date?: string;
      notes?: string;
    }>;
    sleepTracking?: Array<{
      duration?: number;
      quality?: string;
      date?: string;
      notes?: string;
    }>;
    [key: string]: any;
  };

  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [historyData, setHistoryData] = useState<TrackerData[] | null>(null);
  const [activeData, setActiveData] = useState<TrackerData | null>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    let mounted = true;
    getProfile()
      .then((data) => { if (mounted) setUser(data); })
      .catch(() => router.push("/login"));
    return () => { mounted = false; };
  }, [router]);

  // Check backend status on mount
  useEffect(() => {
    const checkBackend = async () => {
      setBackendStatus('checking');
      const isOnline = await testBackendConnection();
      setBackendStatus(isOnline ? 'online' : 'offline');
    };
    checkBackend();
  }, []);

  const handlePeriodDataChange = (data: PeriodData) => {
    setPeriodData(data);
  };

  const handleHealthDataChange = (data: HealthData) => {
    setHealthData(data);
  };

  // Modal and data fetching functions
  const openModal = (modalType: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalType]: true }));
    fetchData(modalType);
  };

  const closeModal = (modalType: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modalType]: false }));
  };

  // Test backend connection
  const testBackendConnection = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health', { method: 'GET' });
      return response.ok;
    } catch {
      return false;
    }
  };

  const fetchData = async (dataType: string) => {
    setDataLoading(true);

    // First test if backend is reachable
    const isBackendReachable = await testBackendConnection();
    if (!isBackendReachable) {
      alert('❌ Backend server is not running!\n\nPlease start the backend server by running:\n1. Open terminal\n2. cd backend\n3. npm start\n\nThe server should start on port 5000.');
      setDataLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/period-tracker/${dataType}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        switch (dataType) {
          case 'analytics':
            setAnalyticsData(response.data.data);
            break;
          case 'history':
            setHistoryData(response.data.data);
            break;
          case 'active':
            setActiveData(response.data.data);
            break;
        }
      }
    } catch (error) {
      console.error(`Error fetching ${dataType}:`, error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert('Session expired. Please log in again.');
          router.push('/login');
        } else if (error.code === 'ERR_NETWORK') {
          alert('Network error: Unable to connect to server. Please make sure the backend is running on port 5000.');
        } else if (error.request) {
          alert('No response from server. Please check if the backend server is running.');
        } else {
          alert(`Error: ${error.message}`);
        }
      } else {
        alert('An unexpected error occurred while fetching data.');
      }
    } finally {
      setDataLoading(false);
    }
  };

  // Generate health tips function
  const generateHealthTips = () => {
    const tips = [];

    if (periodData?.cycleDuration) {
      const cycleDurationInt = parseInt(periodData.cycleDuration);
      if (cycleDurationInt < 21) {
        tips.push("Your cycle is shorter than average. Consider consulting with a healthcare professional to ensure everything is normal.");
      } else if (cycleDurationInt > 35) {
        tips.push("Your cycle is longer than average. This can be normal, but you may want to discuss it with your doctor.");
      } else {
        tips.push("Your cycle length is within the normal range. Keep tracking to notice any changes.");
      }
    }

    if (healthData.symptoms.includes("Lower Abdomen Cramps")) {
      tips.push("For menstrual cramps, try using a heating pad, gentle yoga, or over-the-counter pain relievers if needed.");
    }

    if (healthData.symptoms.includes("Fatigue")) {
      tips.push("Combat period fatigue by ensuring adequate iron intake, staying hydrated, and getting enough rest.");
    }

    if (healthData.sleepQuality === "poor" || healthData.sleepQuality === "fair") {
      tips.push("Improve sleep quality by maintaining a regular sleep schedule and avoiding caffeine before bedtime.");
    }

    if (healthData.moodTypes.includes("Sad") || healthData.moodTypes.includes("Angry")) {
      tips.push("Mood changes during your cycle are normal. Regular exercise and mindfulness practices can help.");
    }

    if (tips.length === 0) {
      tips.push("Keep tracking your health data regularly to receive personalized insights.");
      tips.push("Stay hydrated and maintain a balanced diet for optimal menstrual health.");
      tips.push("Regular exercise can help reduce period symptoms and improve overall wellbeing.");
    }

    return tips;
  };

  const handleSubmit = async () => {
    if (!user) {
      alert("You must be logged in to submit data");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);

    // Transform data to match backend API structure
    const submissionData = {
      cycleInfo: {
        cycleDuration: parseInt(periodData.cycleDuration) || 28,
        lastPeriodStart: periodData.lastPeriodStart,
        lastPeriodDuration: parseInt(periodData.lastPeriodDuration) || 5,
        nextPeriodPrediction: periodData.nextPeriodPrediction || undefined
      },
      moodTracking: healthData.moodTypes.length > 0 ? [{
        moodTypes: healthData.moodTypes,
        intensity: healthData.moodSeverity || 'medium',
        date: healthData.moodDate,
        notes: ''
      }] : [],
      symptomTracking: healthData.symptoms.length > 0 ? [{
        symptoms: healthData.symptoms.map(symptom => ({
          name: symptom,
          severity: healthData.symptomSeverities[symptom] || 'mild'
        })),
        date: healthData.symptomDate,
        notes: ''
      }] : [],
      sleepTracking: healthData.sleepDuration ? [{
        duration: parseFloat(healthData.sleepDuration),
        quality: healthData.sleepQuality || 'good',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      }] : [],
      privacy: 'private'
    };

    try {
      // Get JWT token from localStorage or cookies
      const token = localStorage.getItem('token') || '';

      const response = await axios.post(
        `http://localhost:5000/api/period-tracker`,
        submissionData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      console.log("Data submitted successfully:", response.data);

      if (response.data.success) {
        alert("Period tracking data submitted successfully! 🎉");

        // Optionally reset forms or redirect
        // setPeriodData({ cycleDuration: "", lastPeriodStart: "", lastPeriodDuration: "", nextPeriodPrediction: "" });
        // setHealthData({ moodTypes: [], moodSeverity: "", moodDate: new Date().toISOString().split('T')[0], symptoms: [], symptomSeverities: {}, symptomDate: new Date().toISOString().split('T')[0], sleepDuration: "", sleepQuality: "" });
      } else {
        alert(`Error: ${response.data.message || "Failed to submit data"}`);
      }
    } catch (error: unknown) {
      console.error("Error submitting data:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert("Session expired. Please log in again.");
          router.push("/login");
        } else if (error.response?.status === 409) {
          alert("You already have an active period tracker. Please update the existing one.");
        } else if (error.response?.status === 429) {
          alert("Too many requests. Please try again in a few minutes.");
        } else if (error.response?.data?.message) {
          alert(`Error: ${error.response.data.message}`);
        } else if (error.request) {
          alert("No response from server. Please check your network connection and try again.");
        } else {
          alert("Failed to submit data. Please try again.");
        }
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-white flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 text-center"
          >
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-pink-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Loading Period Tracker...</h1>
            <p className="text-gray-500">Please wait while we set up your dashboard</p>
          </motion.div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-pink-50  via-fuchsia-50 to-fuchsia-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
            <motion.div
            initial={{ opacity: 0, y: -20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-8"
            >
            <h1 className={`${cookie.className} text-4xl md:text-6xl`}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
              {(() => {
                const hour = new Date().getHours();
                let greeting = '';
                if (hour < 12) greeting = 'Good Morning';
                else if (hour < 17) greeting = 'Good Afternoon';
                else greeting = 'Good Evening';
                return `${greeting}, ${user.name}!`;
              })()}
              </span>
              <span className="text-4xl pb-3">
              🌷
              </span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 mt-3">
              Track your period, monitor your health, and get personalized insights
            </p>

            {/* Backend Status Indicator */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6">
              {backendStatus === 'checking' && (
                <>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-yellow-700">Checking server...</span>
                </>
              )}
              {backendStatus === 'online' && (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-700">Server connected</span>
                </>
              )}
              {backendStatus === 'offline' && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-700">Server offline - Please start backend on port 5000</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Quick Access Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-purple-600" />
              Quick Data View
              <span className="text-sm font-normal text-gray-500 ml-2">• Click any card to explore your data</span>
            </h2>

            {/* Interactive hint */}
            <div className="flex items-center gap-2 mb-4 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
              <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
              </svg>
              <span>Click on any card below to view detailed information about your tracking data</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Analytics Card */}
              <motion.div
                onClick={() => openModal('analytics')}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200 cursor-pointer group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="p-6 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-600">View cycle insights</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Get detailed analytics about your menstrual cycle patterns and health trends.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-blue-600 font-medium">Click to view details</span>
                    <button
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('analytics');
                      }}
                    >
                      View Analytics
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* History Card */}
              <motion.div
                onClick={() => openModal('history')}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 cursor-pointer group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="p-6 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <History className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">History</h3>
                      <p className="text-sm text-gray-600">Past tracking data</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Review your previous tracking entries and monitor changes over time.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-green-600 font-medium">Click to view details</span>
                    <button
                      className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors group-hover:bg-green-600 group-hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('history');
                      }}
                    >
                      View History
                    </button>
                  </div>
                </div>
              </motion.div>

              {/* Active Data Card */}
              <motion.div
                onClick={() => openModal('active')}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-purple-200 cursor-pointer group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="p-6 relative z-10">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">Active Data</h3>
                      <p className="text-sm text-gray-600">Current tracking</p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">View your current active period tracker and real-time data.</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-600 font-medium">Click to view details</span>
                    <button
                      className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors group-hover:bg-purple-600 group-hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal('active');
                      }}
                    >
                      View Active
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Health Tips Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Lightbulb className="w-6 h-6 text-yellow-600" />
              Personalized Health Tips
            </h2>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generateHealthTips().map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full flex-shrink-0 mt-0.5">
                      <HeartPulse className="w-4 h-4 text-purple-600" />
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Column - Period Tracking */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl">
                  <Calendar className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Period Tracking</h2>
                  <p className="text-gray-600">Monitor your menstrual cycle</p>
                </div>
              </div>
              <PeriodTracking onDataChange={handlePeriodDataChange} />
            </motion.div>

            {/* Right Column - Health Tracking */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                  <HeartPulse className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Health Tracking</h2>
                  <p className="text-gray-600">Track your wellbeing & symptoms</p>
                </div>
              </div>
              <HealthTracking
                onDataChange={handleHealthDataChange}
                periodData={{
                  cycleDuration: periodData.cycleDuration,
                  lastPeriodDuration: periodData.lastPeriodDuration
                }}
              />
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center"
          >
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center px-12 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 gap-3 min-w-[280px]"
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Submitting Data...
                </>
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Submit All Tracking Data
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 mt-3">
              Your data is securely stored and helps provide personalized health insights
            </p>
          </motion.div>
        </div>

        {/* Modals */}
        <AnimatePresence>
          {/* Analytics Modal */}
          {modals.analytics && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => closeModal('analytics')}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                      Analytics Dashboard
                    </h2>
                    <button
                      onClick={() => closeModal('analytics')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  {dataLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-600">Loading analytics...</span>
                    </div>
                  ) : analyticsData ? (
                    <div className="space-y-6">
                      {/* Analytics Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Calendar className="w-4 h-4 text-blue-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Cycle Insights</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Average cycle length</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {analyticsData?.averageCycleLength || 'N/A'} days
                          </p>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-100"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <HeartPulse className="w-4 h-4 text-purple-600" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Health Score</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">Overall wellbeing</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {analyticsData?.healthScore || 'N/A'}%
                          </p>
                        </motion.div>
                      </div>

                      {/* Detailed Analytics */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-blue-600" />
                          Detailed Analytics
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(analyticsData).map(([key, value], index) => (
                            <motion.div
                              key={key}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                              className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded-lg"
                            >
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                              </span>
                              <span className="text-sm text-gray-900 font-semibold">
                                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                              </span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Analytics Available</h3>
                      <p className="text-gray-500">Start tracking your periods to see detailed insights!</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* History Modal */}
          {modals.history && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => closeModal('history')}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <History className="w-6 h-6 text-green-600" />
                      Tracking History
                    </h2>
                    <button
                      onClick={() => closeModal('history')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  {dataLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-600">Loading history...</span>
                    </div>
                  ) : historyData && Array.isArray(historyData) && historyData.length > 0 ? (
                    <div className="space-y-4">
                      {historyData.map((entry: any, index: number) => (
                        <motion.div
                          key={entry._id || index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              <span className="font-semibold text-gray-900">
                                {entry.createdAt ? new Date(entry.createdAt).toLocaleDateString() : 'Unknown Date'}
                              </span>
                            </div>
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                              Entry #{index + 1}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Cycle Info */}
                            {entry.cycleInfo && (
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-pink-600" />
                                  Cycle Information
                                </h4>
                                <div className="text-sm space-y-1">
                                  <p><span className="text-gray-600">Duration:</span> <span className="font-medium">{entry.cycleInfo.cycleDuration || 'N/A'} days</span></p>
                                  <p><span className="text-gray-600">Last Period:</span> <span className="font-medium">{entry.cycleInfo.lastPeriodStart || 'N/A'}</span></p>
                                  <p><span className="text-gray-600">Period Length:</span> <span className="font-medium">{entry.cycleInfo.lastPeriodDuration || 'N/A'} days</span></p>
                                </div>
                              </div>
                            )}

                            {/* Mood & Symptoms */}
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                <HeartPulse className="w-4 h-4 text-purple-600" />
                                Health Tracking
                              </h4>
                              <div className="text-sm space-y-1">
                                {entry.moodTracking && entry.moodTracking.length > 0 && (
                                  <p><span className="text-gray-600">Mood:</span> <span className="font-medium">{entry.moodTracking[0].moodTypes?.join(', ') || 'N/A'}</span></p>
                                )}
                                {entry.symptomTracking && entry.symptomTracking.length > 0 && (
                                  <p><span className="text-gray-600">Symptoms:</span> <span className="font-medium">{entry.symptomTracking[0].symptoms?.length || 0} recorded</span></p>
                                )}
                                {entry.sleepTracking && entry.sleepTracking.length > 0 && (
                                  <p><span className="text-gray-600">Sleep:</span> <span className="font-medium">{entry.sleepTracking[0].duration || 'N/A'}h ({entry.sleepTracking[0].quality || 'N/A'})</span></p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <History className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No History Found</h3>
                      <p className="text-gray-500">Submit some tracking data to see your history!</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Active Data Modal */}
          {modals.active && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => closeModal('active')}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-purple-600" />
                      Active Tracker
                    </h2>
                    <button
                      onClick={() => closeModal('active')}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  {dataLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="ml-3 text-gray-600">Loading active data...</span>
                    </div>
                  ) : activeData ? (
                    <div className="space-y-6">
                      {/* Status Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center"
                      >
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full border border-purple-200">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                            <span className="text-purple-700 font-medium">Active Tracker</span>
                          </div>
                        </div>
                      </motion.div>

                      {/* Current Cycle Info */}
                      {activeData.cycleInfo && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                          className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-lg p-4"
                        >
                          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-pink-600" />
                            Current Cycle
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-pink-600 mb-1">
                                {activeData.cycleInfo.cycleDuration || 28}
                              </div>
                              <div className="text-sm text-gray-600">Cycle Length (days)</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-rose-600 mb-1">
                                {activeData.cycleInfo.lastPeriodDuration || 5}
                              </div>
                              <div className="text-sm text-gray-600">Period Length (days)</div>
                            </div>
                          </div>
                          {activeData.cycleInfo.lastPeriodStart && (
                            <div className="mt-4 p-3 bg-white rounded-lg border border-pink-100">
                              <div className="text-sm text-gray-600">Last Period Started</div>
                              <div className="font-medium text-gray-900">
                                {new Date(activeData.cycleInfo.lastPeriodStart).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                          {activeData.cycleInfo.nextPeriodPrediction && (
                            <div className="mt-2 p-3 bg-white rounded-lg border border-pink-100">
                              <div className="text-sm text-gray-600">Next Period Prediction</div>
                              <div className="font-medium text-gray-900">
                                {new Date(activeData.cycleInfo.nextPeriodPrediction).toLocaleDateString()}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* Recent Tracking */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Mood Tracking */}
                        {activeData.moodTracking && activeData.moodTracking.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-lg p-4"
                          >
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <HeartPulse className="w-4 h-4 text-purple-600" />
                              Recent Mood
                            </h4>
                            <div className="space-y-2">
                              {activeData.moodTracking[0].moodTypes && (
                                <div className="flex flex-wrap gap-1">
                                  {activeData.moodTracking[0].moodTypes.map((mood: string, idx: number) => (
                                    <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                      {mood}
                                    </span>
                                  ))}
                                </div>
                              )}
                              <div className="text-sm text-gray-600">
                                Intensity: <span className="font-medium capitalize">{activeData.moodTracking[0].intensity || 'N/A'}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* Symptom Tracking */}
                        {activeData.symptomTracking && activeData.symptomTracking.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 rounded-lg p-4"
                          >
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <Activity className="w-4 h-4 text-rose-600" />
                              Symptoms
                            </h4>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-rose-600 mb-1">
                                {activeData.symptomTracking[0].symptoms?.length || 0}
                              </div>
                              <div className="text-sm text-gray-600">Tracked Today</div>
                            </div>
                          </motion.div>
                        )}

                        {/* Sleep Tracking */}
                        {activeData.sleepTracking && activeData.sleepTracking.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-lg p-4"
                          >
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                              <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                              </svg>
                              Sleep Quality
                            </h4>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-indigo-600 mb-1">
                                {activeData.sleepTracking[0].duration || 'N/A'}h
                              </div>
                              <div className="text-sm text-gray-600 capitalize">
                                {activeData.sleepTracking[0].quality || 'N/A'} quality
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </div>

                      {/* Quick Stats */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                      >
                        <h3 className="font-semibold text-gray-900 mb-4">Tracker Summary</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Created:</span>
                            <span className="ml-2 font-medium">
                              {activeData.createdAt ? new Date(activeData.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Privacy:</span>
                            <span className="ml-2 font-medium capitalize">{activeData.privacy || 'Private'}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <span className="ml-2 font-medium text-green-600">Active</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Updated:</span>
                            <span className="ml-2 font-medium">
                              {activeData.updatedAt ? new Date(activeData.updatedAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-12"
                    >
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-8 h-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Tracker</h3>
                      <p className="text-gray-500 mb-4">Submit tracking data to create an active tracker!</p>
                      <button
                        onClick={() => closeModal('active')}
                        className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        Start Tracking
                      </button>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ProtectedRoute>
  );
}
