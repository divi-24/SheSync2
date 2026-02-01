"use client";
import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Brain,
  AlertCircle,
  ChevronRight,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Plus,
  AlertTriangle,
  BarChart,
  TrendingUp,
  Heart,
  Zap,
  Shield,
  Book,
  Clock,
  Droplets,
  Wind,
  Users,
  Calendar,
} from "lucide-react";
import { Cookie } from "next/font/google";

const cookie = Cookie({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cookie",
});

const symptomCategories = {
  "Pain & Discomfort": [
    "Abdominal cramps",
    "Back pain",
    "Breast tenderness",
    "Headache",
    "Joint pain",
    "Muscle aches",
  ],
  "Emotional & Mental": [
    "Mood swings",
    "Anxiety",
    "Depression",
    "Irritability",
    "Sleep issues",
    "Fatigue",
  ],
  "Physical Changes": [
    "Bloating",
    "Weight changes",
    "Acne",
    "Hair changes",
    "Skin changes",
    "Swelling",
  ],
  "Digestive Issues": [
    "Nausea",
    "Appetite changes",
    "Constipation",
    "Diarrhea",
    "Indigestion",
  ],
};

type AnalysisResult = {
  medicalAnalysis: {
    overview: string;
    symptomDetails: Array<{
      symptom: string;
      severity: string;
      causes: string[];
      frequency: string;
      medicalContext: string;
      prevalence: string;
    }>;
    cycleContext: string;
    severity: string;
  };
  riskAssessment: {
    score: number;
    level: string;
    factors: string[];
    recommendations: string[];
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    dietary: string[];
    lifestyle: string[];
    longTerm: string[];
  };
  communityInsights: {
    prevalenceStats: Record<string, string>;
    commonCombinations: Array<{
      symptoms: string[];
      percentage: number;
      explanation: string;
    }>;
    averageSeverity: string;
    communityTips: string[];
  };
  patterns: {
    cycleRelation: Array<{
      symptom: string;
      commonDays: number[];
      reason: string;
    }>;
    symptomClusters: Array<{
      name: string;
      symptoms: string[];
      explanation: string;
    }>;
    frequency: Record<string, number>;
    predictions: Array<{
      symptom: string;
      day: number;
      likelihood: string;
      reason: string;
    }>;
  };
  timestamp: string;
  disclaimer: string;
};

export default function AdvancedSymptomAnalyzer() {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [customSymptomsList, setCustomSymptomsList] = useState<string[]>([]);
  const [intensity, setIntensity] = useState("");
  const [cycleDay, setCycleDay] = useState<number | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [severity, setSeverity] = useState<Record<string, string>>({});

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
    // Initialize severity for new symptom
    if (!selectedSymptoms.includes(symptom)) {
      setSeverity((prev) => ({ ...prev, [symptom]: "Mild" }));
    }
  };

  const handleAddCustomSymptom = () => {
    if (!customSymptom.trim()) return;
    const formattedSymptom = customSymptom.trim();
    if (!customSymptomsList.includes(formattedSymptom)) {
      setCustomSymptomsList([...customSymptomsList, formattedSymptom]);
      handleSymptomToggle(formattedSymptom);
      setCustomSymptom("");
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const allSymptoms = [...selectedSymptoms, ...customSymptomsList];
      console.log("[handleAnalyze] Sending request with symptoms:", allSymptoms);
      
      // Next.js rewrites /api/* to http://localhost:5000/api/*
      const response = await fetch("/api/symptoms/analyze/advanced", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptoms: allSymptoms,
          severities: severity,
          cycleDay: cycleDay,
        }),
      });

      console.log("[handleAnalyze] Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("[handleAnalyze] Analysis received successfully");
        setAnalysis(data);
        setStep(6);
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Analysis failed:", response.status, response.statusText, errorData);
        alert(`Error: ${response.status} - ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Error during analysis:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Step 1: Cycle Information
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-white">
                What day of your cycle are you on? (optional)
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={cycleDay || ""}
                  onChange={(e) =>
                    setCycleDay(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                  placeholder="Day"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  (1-28 days, helps with pattern analysis)
                </span>
              </div>
              {cycleDay && (
                <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-sm text-blue-700 dark:text-blue-300">
                  {cycleDay <= 5 && "🩸 Menstrual phase - lower hormones, common cramps & fatigue"}
                  {cycleDay > 5 && cycleDay <= 12 && "📈 Follicular phase - rising energy levels"}
                  {cycleDay > 12 && cycleDay <= 15 && "⭐ Ovulation - peak energy & mood"}
                  {cycleDay > 15 && "⚠️ Luteal phase - PMS symptoms most common"}
                </div>
              )}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 rounded-lg transition transform hover:scale-105"
            >
              Continue <ChevronRight className="inline ml-2" size={20} />
            </button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Step 2: Select Symptom Categories
            </h2>

            <div className="grid grid-cols-1 gap-3">
              {Object.keys(symptomCategories).map((category) => (
                <motion.button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg text-left transition-all border-2 ${
                    selectedCategories.includes(category)
                      ? "bg-pink-100 dark:bg-pink-900/30 border-pink-400 dark:border-pink-500"
                      : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-pink-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {category}
                    </span>
                    {selectedCategories.includes(category) && (
                      <CheckCircle size={20} className="text-pink-500" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
              >
                <ArrowLeft className="inline mr-2" size={20} /> Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={selectedCategories.length === 0}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50"
              >
                Continue <ChevronRight className="inline ml-2" size={20} />
              </button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Step 3: Select Your Symptoms
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {(selectedCategories.length > 0
                ? Object.values(symptomCategories).flat()
                : []
              )
                .filter(
                  (symptom, index, self) =>
                    selectedCategories.some((cat) =>
                      symptomCategories[cat as keyof typeof symptomCategories].includes(
                        symptom
                      )
                    ) && self.indexOf(symptom) === index
                )
                .map((symptom) => (
                  <motion.button
                    key={symptom}
                    onClick={() => handleSymptomToggle(symptom)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`p-3 rounded-lg text-sm font-medium transition-all border-2 ${
                      selectedSymptoms.includes(symptom)
                        ? "bg-pink-200 dark:bg-pink-900/50 border-pink-500 text-pink-900 dark:text-pink-100"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-pink-300"
                    }`}
                  >
                    {selectedSymptoms.includes(symptom) && (
                      <CheckCircle size={16} className="inline mr-1" />
                    )}
                    {symptom}
                  </motion.button>
                ))}
            </div>

            {/* Custom Symptom Input */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                Can't find your symptom?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && handleAddCustomSymptom()
                  }
                  placeholder="Add custom symptom..."
                  className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900"
                />
                <button
                  onClick={handleAddCustomSymptom}
                  className="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-lg transition"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {customSymptomsList.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {customSymptomsList.map((symptom) => (
                  <span
                    key={symptom}
                    className="bg-purple-200 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100 px-3 py-1 rounded-full text-sm"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
              >
                <ArrowLeft className="inline mr-2" size={20} /> Back
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={selectedSymptoms.length === 0 && customSymptomsList.length === 0}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50"
              >
                Continue <ChevronRight className="inline ml-2" size={20} />
              </button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Step 4: Rate Severity
            </h2>

            <div className="space-y-4">
              {[...selectedSymptoms, ...customSymptomsList].map((symptom) => (
                <div key={symptom} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <label className="block text-sm font-medium mb-3 text-gray-700 dark:text-white">
                    {symptom}
                  </label>
                  <div className="flex gap-2">
                    {["Mild", "Moderate", "Severe"].map((sev) => (
                      <button
                        key={sev}
                        onClick={() =>
                          setSeverity((prev) => ({
                            ...prev,
                            [symptom]: sev,
                          }))
                        }
                        className={`flex-1 p-2 rounded text-sm font-medium transition ${
                          severity[symptom] === sev
                            ? "bg-pink-500 text-white"
                            : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
              >
                <ArrowLeft className="inline mr-2" size={20} /> Back
              </button>
              <button
                onClick={() => setStep(5)}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition"
              >
                Continue <ChevronRight className="inline ml-2" size={20} />
              </button>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
              Step 5: Additional Info
            </h2>

            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any other details? (optional) E.g., recent stress, diet changes, medication..."
              className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 h-32"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-3 rounded-lg hover:bg-gray-300 transition"
              >
                <ArrowLeft className="inline mr-2" size={20} /> Back
              </button>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-purple-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 size={20} className="animate-spin" /> Analyzing...
                  </>
                ) : (
                  <>
                    Analyze <Zap size={20} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        );

      case 6:
        if (!analysis) return null;
        return <AnalysisResults analysis={analysis} onBack={() => setStep(1)} />;

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AI-Powered Symptom Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Evidence-based, personalized health insights
          </p>
        </div>

        {/* Progress */}
        {step !== 6 && (
          <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Step {step} of 5
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {Math.round((step / 5) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / 5) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <motion.div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-8">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

/**
 * Analysis Results Component
 */
function AnalysisResults({
  analysis,
  onBack,
}: {
  analysis: AnalysisResult;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"overview" | "risks" | "recommendations" | "patterns">(
    "overview"
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Disclaimer */}
      <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 flex gap-3">
        <AlertCircle className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" size={20} />
        <p className="text-sm text-blue-800 dark:text-blue-300">{analysis.disclaimer}</p>
      </div>

      {/* Risk Assessment Card */}
      {analysis.riskAssessment && (
        <div className={`rounded-lg p-6 text-white ${
          analysis.riskAssessment.level === "High" ? "bg-red-600" :
          analysis.riskAssessment.level === "Moderate" ? "bg-yellow-600" :
          "bg-green-600"
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Risk Assessment</h3>
            <Shield size={32} />
          </div>
          <div className="text-4xl font-bold mb-2">{analysis.riskAssessment.level}</div>
          <p className="text-sm opacity-90 mb-4">
            Based on your symptom profile and severity levels
          </p>
          {analysis.riskAssessment.factors.length > 0 && (
            <ul className="space-y-2 text-sm">
              {analysis.riskAssessment.factors.map((factor, i) => (
                <li key={i} className="flex gap-2">
                  <span>•</span>
                  <span>{factor}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {["overview", "risks", "recommendations", "patterns"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === tab
                ? "border-pink-500 text-pink-600 dark:text-pink-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "overview" && (
            <OverviewTab analysis={analysis} />
          )}
          {activeTab === "risks" && (
            <RisksTab analysis={analysis} />
          )}
          {activeTab === "recommendations" && (
            <RecommendationsTab analysis={analysis} />
          )}
          {activeTab === "patterns" && (
            <PatternsTab analysis={analysis} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold py-3 rounded-lg hover:bg-gray-300 transition flex items-center justify-center gap-2"
      >
        <ArrowLeft size={20} /> New Analysis
      </button>
    </motion.div>
  );
}

function OverviewTab({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Brain size={24} className="text-pink-600" />
          Medical Analysis
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          {analysis.medicalAnalysis.overview}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          {analysis.medicalAnalysis.cycleContext}
        </p>
      </div>

      {analysis.medicalAnalysis.symptomDetails.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Symptom Details
          </h4>
          <div className="grid gap-3">
            {analysis.medicalAnalysis.symptomDetails.map((detail, i) => (
              <div
                key={i}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/30"
              >
                <div className="flex items-start justify-between mb-2">
                  <h5 className="font-semibold text-gray-900 dark:text-white">
                    {detail.symptom}
                  </h5>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    detail.severity === "Severe" ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200" :
                    detail.severity === "Moderate" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200" :
                    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200"
                  }`}>
                    {detail.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <strong>Prevalence:</strong> {detail.prevalence}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Common Causes:</strong> {detail.causes.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {analysis.communityInsights.communityTips.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Users size={20} className="text-green-600" />
            Community Insights
          </h4>
          <div className="space-y-2">
            {analysis.communityInsights.communityTips.map((tip, i) => (
              <div key={i} className="flex gap-3 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <Droplets className="text-green-600 flex-shrink-0 mt-1" size={18} />
                <p className="text-sm text-green-800 dark:text-green-300">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RisksTab({ analysis }: { analysis: AnalysisResult }) {
  return (
    <div className="space-y-4">
      {analysis.riskAssessment.recommendations.map((rec, i) => (
        <div key={i} className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-700">
          <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
          <p className="text-gray-700 dark:text-gray-300">{rec}</p>
        </div>
      ))}
    </div>
  );
}

function RecommendationsTab({ analysis }: { analysis: AnalysisResult }) {
  const recommendations = analysis.recommendations;

  return (
    <div className="space-y-6">
      {recommendations.immediate.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Zap size={20} className="text-orange-600" />
            Immediate Relief
          </h4>
          <ul className="space-y-2">
            {recommendations.immediate.map((rec, i) => (
              <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-orange-600 font-bold">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.dietary.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Wind size={20} className="text-green-600" />
            Dietary Recommendations
          </h4>
          <ul className="space-y-2">
            {recommendations.dietary.map((rec, i) => (
              <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-green-600 font-bold">✓</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.lifestyle.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Heart size={20} className="text-red-600" />
            Lifestyle Changes
          </h4>
          <ul className="space-y-2">
            {recommendations.lifestyle.map((rec, i) => (
              <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-red-600 font-bold">♡</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recommendations.longTerm.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-600" />
            Long-term Strategy
          </h4>
          <ul className="space-y-2">
            {recommendations.longTerm.map((rec, i) => (
              <li key={i} className="flex gap-2 text-gray-700 dark:text-gray-300">
                <span className="text-blue-600 font-bold">→</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function PatternsTab({ analysis }: { analysis: AnalysisResult }) {
  const patterns = analysis.patterns;

  return (
    <div className="space-y-6">
      {patterns.cycleRelation.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <Calendar size={20} className="text-purple-600" />
            Cycle Patterns
          </h4>
          <div className="space-y-2">
            {patterns.cycleRelation.map((pattern, i) => (
              <div key={i} className="p-3 bg-purple-50 dark:bg-purple-900/30 rounded-lg border border-purple-200 dark:border-purple-700">
                <p className="font-medium text-gray-900 dark:text-white">{pattern.symptom}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{pattern.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {patterns.predictions.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <BarChart size={20} className="text-cyan-600" />
            Upcoming Symptoms
          </h4>
          <div className="grid gap-2">
            {patterns.predictions.map((pred, i) => (
              <div key={i} className="p-3 bg-cyan-50 dark:bg-cyan-900/30 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {pred.symptom} on Day {pred.day}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{pred.reason}</p>
                  </div>
                  <span className="text-xs bg-cyan-600 text-white px-2 py-1 rounded">
                    {pred.likelihood}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
