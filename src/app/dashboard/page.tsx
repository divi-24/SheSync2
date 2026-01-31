/* eslint-disable */

"use client";
import { useEffect, useState } from "react";
import ProtectedRoute from "../../components/ProtectedRoute";
import { getProfile } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import CalendarCompo from "@/components/ovulationCalc/Calendar";
import { getCycles, type CycleData } from "@/lib/cycles";
import { getActivePregnancy } from "@/lib/pregnancy";
import { apiFetch } from "@/lib/api";
import {
  CalendarCheck,
  Users,
  ShieldCheck,
  Activity,
  Brain,
  MessageCircle,
  Heart,
  TrendingUp,
  Clock,
  AlertCircle,
  Plus,
  ChevronRight,
  Stethoscope,
  Bot,
  Mic,
  ShoppingBag,
  BookOpen,
  Baby,
  UserPlus,
  BarChart3,
  Timer,
  Zap,
  Target
} from "lucide-react";
import { Cookie } from "next/font/google";

const cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
});

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardInner />
    </ProtectedRoute>
  );
}
function DashboardInner() {
  const [user, setUser] = useState<{ id: string; name: string; role: string } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [cycles, setCycles] = useState<CycleData[]>([]);
  const [isPregnant, setIsPregnant] = useState<boolean>(false);
  const [gestationInfo, setGestationInfo] = useState<any | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    getProfile()
      .then((data) => { if (mounted) setUser(data); })
      .catch(() => router.replace("/login"));
    return () => { mounted = false; };
  }, [router]);

  // Helper: transform active Period Tracker cycleInfo into a CycleData for calendar highlighting
  const toCycleFromTracker = (tracker: any): CycleData | null => {
    try {
      const info = tracker?.cycleInfo;
      if (!info?.lastPeriodStart || !info?.cycleDuration || !info?.lastPeriodDuration) return null;
      const start = new Date(info.lastPeriodStart);
      const cycleLength = Number(info.cycleDuration) || 28;
      const menstrualDuration = Number(info.lastPeriodDuration) || 5;
      const lutealPhaseLength = 14; // default assumption
      const ovulationDate = new Date(start);
      ovulationDate.setDate(start.getDate() + (cycleLength - lutealPhaseLength));
      const fertileStart = new Date(ovulationDate);
      fertileStart.setDate(ovulationDate.getDate() - 4);
      const fertileEnd = new Date(ovulationDate);
      fertileEnd.setDate(ovulationDate.getDate() + 1);
      const nextPeriod = new Date(start);
      nextPeriod.setDate(start.getDate() + cycleLength);
      const menstrualEnd = new Date(start);
      menstrualEnd.setDate(start.getDate() + Math.max(0, menstrualDuration - 1));

      const cycle: CycleData = {
        _id: tracker._id || 'tracker-active',
        startDate: start.toISOString(),
        cycleLength,
        lutealPhaseLength,
        menstrualDuration,
        ovulationDate: ovulationDate.toISOString(),
        fertileStart: fertileStart.toISOString(),
        fertileEnd: fertileEnd.toISOString(),
        nextPeriod: nextPeriod.toISOString(),
        menstrualEnd: menstrualEnd.toISOString(),
        symptoms: {},
        createdAt: tracker.createdAt,
        updatedAt: tracker.updatedAt,
      };
      return cycle;
    } catch (e) {
      console.warn('Failed to transform tracker to cycle', e);
      return null;
    }
  };

  // Load calendar source: prefer Period Tracker active record; fallback to saved cycles
  useEffect(() => {
    let cancelled = false;
    const loadCalendarSource = async () => {
      try {
        const { ok, body } = await apiFetch<any>("/api/period-tracker/active");
        if (cancelled) return;
        if (ok && (body as any)?.data) {
          const tracker = (body as any).data;
          const derived = toCycleFromTracker(tracker);
          if (derived) {
            setCycles([derived]);
            return; // prefer tracker-based cycle
          }
        }
      } catch (e) {
        // No active tracker, continue to fallback
      }

      // Fallback: use stored cycles
      try {
        const list = await getCycles();
        if (cancelled) return;
        const sorted = [...list].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        setCycles(sorted);
      } catch (e) {
        console.warn('Failed to load cycles for calendar', e);
      }
    };

    loadCalendarSource();
    return () => { cancelled = true; };
  }, []);

  // Probe active pregnancy; if found, enable pregnancy overlays in calendar
  useEffect(() => {
    let cancelled = false;
    const probe = async () => {
      try {
        const p = await getActivePregnancy();
        if (cancelled) return;
        setIsPregnant(true);
        setGestationInfo(p);
      } catch (e) {
        if (cancelled) return;
        setIsPregnant(false);
        setGestationInfo(null);
      }
    };
    probe();
    return () => { cancelled = true; };
  }, []);

  // Expose a refresh function (Calendar calls after saving symptoms if provided)
  const refreshCycles = async () => {
    try {
      const list = await getCycles();
      const sorted = [...list].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      setCycles(sorted);
    } catch (e) {
      console.warn('Failed to refresh cycles', e);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Quick action items for health tracking
  const healthActions = [
    {
      title: "Period Tracker",
      description: "Log your cycle and symptoms",
      icon: CalendarCheck,
      color: "bg-pink-500",
      route: "/tracker",
      urgent: true
    },
    {
      title: "Symptom Analyzer",
      description: "AI-powered health assessment",
      icon: Activity,
      color: "bg-purple-500",
      route: "/symptomsanalyzer"
    },
    {
      title: "Ovulation Calculator",
      description: "Track fertility and predictions",
      icon: Target,
      color: "bg-rose-500",
      route: "/ovulationcalc"
    },
    {
      title: "PCOS Support",
      description: "Specialized tools and resources",
      icon: Heart,
      color: "bg-red-500",
      route: "/pcos"
    }
  ];

  // AI and community features
  const aiCommunityFeatures = [
    {
      title: "AI Health Assistant",
      description: "Chat with Eve for health guidance",
      icon: Bot,
      color: "bg-blue-500",
      route: "/chatbot"
    },
    {
      title: "Voice Agent",
      description: "Voice-based health interaction",
      icon: Mic,
      color: "bg-indigo-500",
      route: "/voice-agent"
    },
    {
      title: "Community Forums",
      description: "Connect with other women",
      icon: MessageCircle,
      color: "bg-green-500",
      route: "/forums"
    },
    {
      title: "Expert Consultation",
      description: "Book healthcare sessions",
      icon: Stethoscope,
      color: "bg-teal-500",
      route: "/consultation"
    }
  ];

  // Wellness and lifestyle
  const wellnessFeatures = [
    {
      title: "Diet Planning",
      description: "Personalized nutrition plans",
      icon: BarChart3,
      color: "bg-orange-500",
      route: "/diet-plan"
    },
    {
      title: "Bliss Wellness",
      description: "Mindfulness and relaxation",
      icon: Zap,
      color: "bg-yellow-500",
      route: "/bliss"
    },
    {
      title: "Health Blogs",
      description: "Educational health content",
      icon: BookOpen,
      color: "bg-cyan-500",
      route: "/blogs"
    },
    {
      title: "Period Products",
      description: "Shop menstrual care essentials",
      icon: ShoppingBag,
      color: "bg-emerald-500",
      route: "/periodproducts"
    }
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-fuchsia-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md w-full"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-800">Loading your dashboard...</h3>
          <p className="text-gray-600 mt-2">Preparing your personalized health insights</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-fuchsia-100 ">
      {/* Header Section */}
      <div className=" backdrop-blur-md ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
          >
            <div className="flex-1">
              <h1 className={`${cookie.className} flex items-center gap-3 mb-3`}>
                <span className="text-4xl lg:text-6xl bg-gradient-to-r from-pink-500 via-rose-400 to-purple-500 bg-clip-text text-transparent pb-3">
                  {getGreeting()}, {user.name}!
                </span>
                <span className="text-3xl sm:text-4xl lg:text-5xl animate-pulse">🌷</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl leading-relaxed">
                Track your health, connect with community, and get personalized insights
              </p>
            </div>

            {/* Enhanced Time Display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-pink-100 via-purple-50 to-blue-50 rounded-2xl p-6 shadow-lg border border-pink-200/50"
            >
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-pink-500" />
                  <span className="text-sm font-medium text-gray-600 uppercase tracking-wide">Current Time</span>
                </div>
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {currentTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Daily Health Reminder */}
        <section className="flex gap-3 items-center">

          <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex-1 bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border border-pink-200/60 rounded-3xl p-6 lg:p-8 shadow-xl relative overflow-hidden min-h-[360px] flex flex-col"
            >
              {/* Subtle background pattern */}
              <div className="absolute inset-0 bg-gradient-to-r from-pink-100/30 via-transparent to-purple-100/30 rounded-3xl"></div>

              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-pink-400 to-rose-500 p-3 rounded-2xl shadow-lg">
                      <AlertCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Daily Health Check-in
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">Stay on track with your wellness journey</p>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                    Don't forget to log your health data today! Track your cycle, symptoms, and wellness metrics to get personalized insights.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    onClick={() => router.push("/tracker")}
                    className="group bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                    Start Tracking
                  </button>

                  <button
                    onClick={() => router.push("/symptomsanalyzer")}
                    className="group bg-white border-2 border-pink-200 text-pink-600 px-6 py-3 rounded-2xl font-semibold hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                  >
                    <Activity className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Quick Check
                  </button>
                </div>
              </div>
            </motion.div>

            <div className="w-full lg:w-2/5 flex-shrink-0">
              <div className="h-full rounded-3xl shadow-md p-3 border border-gray-100/80 overflow-hidden min-h-[360px]">
                <div className="h-full flex flex-col">
                  <CalendarCompo
                    currentMonth={currentMonth}
                    setCurrentMonth={setCurrentMonth}
                    cycles={cycles}
                    startDate={cycles[0]?.startDate || new Date().toISOString().slice(0, 10)}
                    isPregnant={isPregnant}
                    gestationInfo={gestationInfo}
                    setGestationInfo={setGestationInfo}
                    results={null}
                    refreshCycles={refreshCycles}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Health Tracking */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="my-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            Core Health Tools
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                onClick={() => router.push(action.route)}
                className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-pink-200 relative overflow-hidden"
              >
                {action.urgent && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                )}
                <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <div className="flex items-center text-pink-600 group-hover:text-pink-700">
                  <span className="text-sm font-medium">Open Tool</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* AI & Community Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-500" />
            AI & Community
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {aiCommunityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                onClick={() => router.push(feature.route)}
                className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-purple-200"
              >
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <div className="flex items-center text-purple-600 group-hover:text-purple-700">
                  <span className="text-sm font-medium">Explore</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Wellness & Lifestyle */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-500" />
            Wellness & Lifestyle
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wellnessFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                onClick={() => router.push(feature.route)}
                className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border hover:border-green-200"
              >
                <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <div className="flex items-center text-green-600 group-hover:text-green-700">
                  <span className="text-sm font-medium">Discover</span>
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Role-based Dashboard Sections */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            {user.role === "parent" ? "Parent Hub" : "Personal Hub"}
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {user.role === "parent" ? (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  onClick={() => router.push("/parent")}
                  className="group bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <Baby className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Parent Dashboard</h3>
                      <p className="text-purple-100">Manage child profiles and health data</p>
                    </div>
                  </div>
                  <div className="flex items-center text-purple-100 group-hover:text-white">
                    <span className="font-medium">Access Parent Hub</span>
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-md border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <ShieldCheck className="w-6 h-6 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Privacy & Security</h3>
                  </div>
                  <p className="text-gray-600 mb-4">
                    Advanced privacy controls and secure data management for family health data.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      End-to-end encrypted health data
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Granular access controls
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      HIPAA compliant storage
                    </li>
                  </ul>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  onClick={() => router.push("/partner")}
                  className="group bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white/20 p-3 rounded-lg">
                      <UserPlus className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Partner Connection</h3>
                      <p className="text-pink-100">Share health journey with your partner</p>
                    </div>
                  </div>
                  <div className="flex items-center text-pink-100 group-hover:text-white">
                    <span className="font-medium">Connect Partner</span>
                    <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="bg-white rounded-xl p-6 shadow-md border"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Timer className="w-6 h-6 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-800">Quick Actions</h3>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push("/tracker")}
                      className="w-full text-left p-3 bg-pink-50 hover:bg-pink-100 rounded-lg transition-colors duration-200 flex items-center justify-between"
                    >
                      <span className="text-gray-800 font-medium">Log Today's Data</span>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => router.push("/symptomsanalyzer")}
                      className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 flex items-center justify-between"
                    >
                      <span className="text-gray-800 font-medium">Symptom Check</span>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => router.push("/chatbot")}
                      className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 flex items-center justify-between"
                    >
                      <span className="text-gray-800 font-medium">Ask AI Assistant</span>
                      <ChevronRight className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </motion.section>

        {/* Health Tips Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8"
        >
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Today's Health Tip</h3>
            </div>
            <p className="text-gray-700 leading-relaxed">
              💧 <strong>Stay Hydrated:</strong> Drinking adequate water helps regulate your menstrual cycle and reduces bloating.
              Aim for 8-10 glasses daily, and consider herbal teas during your period for added comfort.
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
