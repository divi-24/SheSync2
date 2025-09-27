"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Brain,
  Users,
  ThumbsUp,
  AlertCircle,
  ChevronRight,
  Loader2,
  CheckCircle,
  ArrowLeft,
  Plus,
  Info,
  AlertTriangle,
  BarChart,
  Tag,
  CalendarClock,
  Heart,
} from "lucide-react";
import { Cookie } from "next/font/google";
const cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
});
const commonSymptoms = [
  "Abdominal cramps",
  "Fatigue",
  "Headache",
  "Nausea",
  "Back pain",
  "Mood swings",
  "Bloating",
  "Breast tenderness",
  "Acne",
  "Insomnia",
];
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

const severityGuides: Record<string, { mild: string; moderate: string; severe: string }> = {
  "Abdominal cramps": {
    mild: "Noticeable but doesn't affect daily activities",
    moderate: "Interferes with some activities",
    severe: "Significantly impacts daily life",
  },
  Headache: {
    mild: "Slight discomfort, can focus on tasks",
    moderate: "Distracting, difficulty concentrating",
    severe: "Intense pain, sensitivity to light/sound",
  },
  // Add more guides for other symptoms
};

const emergencySymptoms = [
  "Severe chest pain",
  "Difficulty breathing",
  "Severe abdominal pain",
  "Heavy bleeding",
  "Fainting",
  "Severe headache with vision changes",
];

type AnalysisResult = {
  possibleCauses: string[];
  suggestions: string[];
  communityInsights: {
    similarExperiences: number;
    commonRelief: string;
    percentageSeekingMedicalAttention: number;
  };
  patterns: {
    frequentSymptoms: string[];
    cyclePatterns: ({ symptom: string; commonCycleDays: Record<number, number> } | null)[];
    recommendations: string[];
  };
  lifestyle: {
    diet: string[];
    exercise: string[];
    stress: string[];
  };
};

export default function SymptomAnalysis() {
  const [step, setStep] = useState(1);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState("");
  const [customSymptomsList, setCustomSymptomsList] = useState<string[]>([]);
  const [intensity, setIntensity] = useState("");
  const [duration, setDuration] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [symptomHistory, setSymptomHistory] = useState<SymptomHistoryEntry[]>([]);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);


  const toggleCategory = (category: string): void => {
    setSelectedCategories((prev: string[]) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const [symptomPatterns, setSymptomPatterns] = useState<SymptomPatterns>({});
  const [showSeverityGuide, setShowSeverityGuide] = useState(false);
  const [currentSymptomGuide, setCurrentSymptomGuide] = useState<string | null>(null);
  const [cycleDay, setCycleDay] = useState<number | null>(null);



  interface HandleSymptomToggle {
    (symptom: string): void;
  }

  const handleSymptomToggle: HandleSymptomToggle = (symptom) => {
    setSelectedSymptoms((prev: string[]) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleAddCustomSymptom = () => {
    if (!customSymptom.trim()) return;
    const formattedSymptom = customSymptom.trim();
    if (!customSymptomsList.includes(formattedSymptom)) {
      setCustomSymptomsList([...customSymptomsList, formattedSymptom]);
      setCustomSymptom("");
    }
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    setIsAnalyzing(true);
    const result = await mockAiAnalysis();
    setAnalysis(result);
    setIsAnalyzing(false);
    setStep(6);
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
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-white">
              Step 1: Select Your Symptoms
            </h2>

            {/* Cycle Day Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-white">
                Current Day of Menstrual Cycle (optional)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="28"
                  value={cycleDay || ""}
                  onChange={(e) =>
                    setCycleDay(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-20 p-2 border border-gray-300  dark:border-gray-600 rounded-md bg-white dark:bg-gray-900"
                  placeholder="Day"
                />
                <CalendarClock className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Category Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Select Category</h3>
              <div className="grid grid-cols-1 gap-3 ">
                {Object.keys(symptomCategories).map((category) => (
                  <motion.button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`p-4 rounded-lg text-base transition-colors ${
                      selectedCategories.includes(category)
                        ? "bg-pink-200 dark:bg-[#111827]  text-pink-700 font-medium shadow-sm border border-pink-100"
                        : "bg-pink-50 dark:bg-[#1b212e] text-gray-700 hover:bg-pink-100 border border-pink-100"
                    }`}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >

                    <span className={selectedCategories.includes(category) ? "text-pink-700" : "text-gray-700  dark:text-white"}>
                      {category}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>


            {/* Symptom Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Select Symptoms</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {(selectedCategories.length > 0
                  ? selectedCategories.flatMap((cat) => symptomCategories[cat as keyof typeof symptomCategories])
                  : commonSymptoms
                ).map((symptom) => (
                  <motion.button
                    key={symptom}
                    onClick={() => {
                      handleSymptomToggle(symptom);
                      checkEmergencySymptoms([...selectedSymptoms, symptom]);
                    }}
                    className={`p-3 rounded-md text-sm transition-colors relative group ${
                      selectedSymptoms.includes(symptom)
                        ? "bg-pink-200 dark:bg-[#111827] text-pink-700 font-medium shadow-sm border-pink-100"
                        : "bg-pink-50 dark:bg-[#1b212e] text-gray-700 hover:bg-pink-100 border border-pink-100"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span
                      className={
                        selectedSymptoms.includes(symptom)
                          ? "text-pink-700"
                          : "text-gray-700 dark:text-white"
                      }
                    >
                      {symptom}
                    </span>
                    {severityGuides[symptom as string] && (
                      <Info
                        className={`h-4 w-4 absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer ${
                          selectedSymptoms.includes(symptom)
                            ? "text-pink-700"
                            : "text-gray-500"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentSymptomGuide(symptom);
                          setShowSeverityGuide(true);
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Symptom Input */}
            <div className="rounded-md ">
              <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-white">Add Custom Symptoms</h3>
              {/* Input container */}
              <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSymptom()}
                  placeholder="Type your symptom..."
                  className="flex-1 p-3 rounded-md border border-pink-200 dark:border-gray-600 dark:bg-[#1b212e] bg-pink-50 placeholder-gray-400 dark:placeholder-gray-500 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-colors"
              />

              <motion.button
                onClick={handleAddCustomSymptom}
                  disabled={!customSymptom.trim()}
                  className="p-2 bg-pink-200 dark:bg-pink-700 text-pink-700 dark:text-pink-100 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={24} />
              </motion.button>
            </div>

{/* Custom symptoms grid - only show if there are custom symptoms */}
              {customSymptomsList.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {customSymptomsList.map((symptom) => (
                    <motion.div
                      key={`custom-${symptom}`}
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                    >
                      <motion.button
                        onClick={() => handleSymptomToggle(symptom)}
                        className={`w-full p-3  rounded-md text-sm transition-colors  relative group ${selectedSymptoms.includes(symptom)
                          ? "bg-pink-200 dark:bg-[#111827] text-pink-700 font-medium shadow-sm border-pink-100"
                          : "bg-pink-50 dark:bg-[#1b212e] text-gray-700 hover:bg-pink-100 border border-pink-100"
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span
                          className={
                            selectedSymptoms.includes(symptom)
                              ? "text-pink-700"
                              : "text-gray-700 dark:text-white"
                          }
                        >
                          {symptom}
                        </span>

                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            {showEmergencyAlert && <EmergencyAlert />}
            {showSeverityGuide && currentSymptomGuide && (
              <SeverityGuideModal
                symptom={currentSymptomGuide}
                onClose={() => {
                  setShowSeverityGuide(false);
                  setCurrentSymptomGuide(null);
                }}
              />
            )}

            <motion.button
              onClick={handleNext}
              disabled={selectedSymptoms.length === 0}
              className={`w-full py-3 rounded-md text-white font-semibold transition-colors ${
                selectedSymptoms.length > 0
                  ? "bg-pink-600 hover:bg-pink-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              whileHover={selectedSymptoms.length > 0 ? { scale: 1.02 } : {}}
              whileTap={selectedSymptoms.length > 0 ? { scale: 0.98 } : {}}
            >
              Next
              <ChevronRight className="inline ml-2" />
            </motion.button>
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
            <h2 className="text-2xl font-semibold mb-4 text-pink-700">
              Step 2: Rate Symptom Intensity
            </h2>
            <div className="space-y-4 mb-6">
              {["Mild", "Moderate", "Severe"].map((level) => (
                <motion.button
                  key={level}
                  onClick={() => setIntensity(level)}
                  className={`w-full p-4 rounded-lg text-base transition-colors ${
                    intensity === level
                      ? "bg-pink-200 dark:bg-[#111827] text-pink-700 font-medium shadow-sm border-pink-100"
                      : "bg-pink-50 dark:bg-[#1b212e] text-gray-700 dark:text-white hover:bg-pink-100 border border-pink-100"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  {level}
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between">
              <motion.button
                onClick={handleBack}
                className="py-3 px-6 rounded-lg text-white bg-[#db2777] font-medium border border-pink-200 hover:bg-pink-900 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <ArrowLeft className="inline mr-2" />
                Back
              </motion.button>
              <motion.button
                onClick={handleNext}
                disabled={!intensity}
                className={`py-3 px-6 rounded-lg font-medium transition-colors ${
                  intensity
                    ? "bg-pink-200 text-pink-700 hover:bg-pink-300"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
                whileHover={intensity ? { scale: 1.01 } : {}}
                whileTap={intensity ? { scale: 0.99 } : {}}
              >
                Next
                <ChevronRight className="inline ml-2" />
              </motion.button>
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
            <h2 className="text-2xl font-semibold mb-4 text-pink-700">
              Step 3: Symptom Duration
            </h2>
            <div className="space-y-4 mb-6">
              {[
                "Less than a day",
                "1-3 days",
                "4-7 days",
                "More than a week",
              ].map((period) => (
                <motion.button
                  key={period}
                  onClick={() => setDuration(period)}
                  className={`w-full p-4 rounded-lg text-base transition-colors ${
                    duration === period
                      ? "bg-pink-200 dark:bg-[#111827] text-pink-700 font-medium shadow-sm border-pink-100"
                      : "bg-pink-50 dark:bg-[#1b212e] text-gray-700 dark:text-white hover:bg-pink-100 border border-pink-100"
                  }`}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span
                    className={
                      duration === period
                        ? "text-pink-700"
                        : "text-gray-700 dark:text-white"
                    }
                  >
                    {period}
                  </span>
                </motion.button>
              ))}
            </div>
            <div className="flex justify-between">
              <motion.button
                onClick={handleBack}
                className="py-3 px-6 rounded-md font-medium text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-700 bg-white dark:bg-zinc-800 hover:bg-pink-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600 transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <ArrowLeft className="inline mr-2 h-4 w-4" />
                Back
              </motion.button>
              <motion.button
                onClick={handleNext}
                disabled={!duration}
                className={`py-3 px-6 rounded-md font-medium flex items-center justify-center transition-all ${
                  duration
                    ? "text-white bg-pink-500 hover:bg-pink-600 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600"
                    : "bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
                }`}
                whileHover={duration ? { scale: 1.01 } : {}}
                whileTap={duration ? { scale: 0.99 } : {}}
              >
                Next
                <ChevronRight className="inline ml-2 h-4 w-4" />
              </motion.button>
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
            <h2 className="text-2xl font-semibold mb-4 text-pink-700">
              Step 4: Additional Information
            </h2>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any other details you'd like to share..."
              className="w-full p-4 border border-pink-100 rounded-lg bg-pink-50 text-gray-700 placeholder-gray-500 mb-6 
                focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-colors
                hover:border-pink-200 dark:bg-[#111827] dark:text-white"
              rows={4}
            />
            <div className="flex justify-between">
              <motion.button
                onClick={handleBack}
                className="py-3 px-6 rounded-md font-medium text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-700 bg-white dark:bg-zinc-800 hover:bg-pink-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600 transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <ArrowLeft className="inline mr-2 h-4 w-4" />
                Back
              </motion.button>
              <motion.button
                onClick={handleNext}
                disabled={!duration}
                className={`py-3 px-6 rounded-md font-medium flex items-center justify-center transition-all ${
                  duration
                    ? "text-white bg-pink-500 hover:bg-pink-600 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600"
                    : "bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-600 cursor-not-allowed"
                }`}
                whileHover={duration ? { scale: 1.01 } : {}}
                whileTap={duration ? { scale: 0.99 } : {}}
              >
                Next
                <ChevronRight className="inline ml-2 h-4 w-4" />
              </motion.button>
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
            <h2 className="text-2xl font-semibold mb-4 text-pink-700">
              Step 5: Review and Submit
            </h2>
            <div className="bg-pink-50/80 p-6 rounded-lg border border-pink-100 dark:bg-[#111827] dark:text-white">
              <h3 className="font-semibold mb-2 text-pink-700">
                Selected Symptoms:
              </h3>
              <ul className="list-disc pl-5 mb-4 text-gray-700">
                {selectedSymptoms.map((symptom, index) => (
                  <li key={index} className="dark:text-white">
                    {symptom}
                  </li>
                ))}
              </ul>
              <p className="text-gray-700 dark:text-white">
                <strong className="text-pink-700">Intensity:</strong>{" "}
                {intensity}
              </p>
              <p className="text-gray-700 dark:text-white">
                <strong className="text-pink-700">Duration:</strong> {duration}
              </p>
              {additionalInfo && (
                <>
                  <h3 className="font-semibold mt-4 mb-2 text-pink-700">
                    Additional Information:
                  </h3>
                  <p className="text-gray-700 dark:text-white">
                    {additionalInfo}
                  </p>
                </>
              )}
            </div>
            <div className="flex justify-between">
              <motion.button
                onClick={handleBack}
                className="py-3 px-6 rounded-md font-medium text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-700 bg-white dark:bg-zinc-800 hover:bg-pink-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600 transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <ArrowLeft className="inline mr-2 h-4 w-4" />
                Back
              </motion.button>
              <motion.button
                onClick={handleSubmit}
                disabled={isAnalyzing}
                className={`py-3 px-6 rounded-md font-medium flex items-center justify-center transition-all focus:outline-none ${
                  isAnalyzing
                    ? "bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500 cursor-not-allowed"
                    : "bg-pink-500 text-white hover:bg-pink-600 focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600"
                }`}
                whileHover={isAnalyzing ? {} : { scale: 1.01 }}
                whileTap={isAnalyzing ? {} : { scale: 0.99 }}
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    Analyzing...
                  </span>
                ) : (
                  <>
                    Submit for Analysis
                    <ChevronRight className="inline ml-2 h-4 w-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        );
      case 6:
        return (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-pink-700">
              Analysis Results
            </h2>

            {/* Existing analysis sections */}
            <div className="space-y-6">
              {/* Causes section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-pink-50/80 rounded-lg p-6 shadow-sm border border-pink-100"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center text-pink-700">
                  <Brain className="mr-2 text-pink-600" /> Possible Causes
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {analysis &&
                    analysis.possibleCauses.map((cause, index) => (
                      <li
                        key={index}
                        className="flex items-center space-x-2 text-gray-700"
                      >
                        <div className="w-2 h-2 rounded-full bg-pink-400" />
                        <span>{cause}</span>
                      </li>
                    ))}
                </ul>
              </motion.div>

              {/* Pattern Analysis */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-pink-50/80 rounded-lg p-6 shadow-sm border border-pink-100"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center text-pink-700">
                  <BarChart className="mr-2 text-pink-600" /> Symptom Patterns
                </h3>
                {analysis && analysis.patterns.recommendations.map(
                  (recommendation, index) => (
                    <div
                      key={index}
                      className="mb-3 flex items-start space-x-3"
                    >
                      <Tag className="w-5 h-5 text-pink-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-700">{recommendation}</p>
                    </div>
                  )
                )}
              </motion.div>

              {/* Lifestyle Recommendations */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-pink-50/80 rounded-lg p-6 shadow-sm border border-pink-100"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center text-pink-700">
                  <Activity className="mr-2 text-pink-600" /> Lifestyle
                  Recommendations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {analysis &&
                    Object.entries(analysis.lifestyle).map(
                      ([category, items]) => (
                        <div key={category} className="space-y-2">
                          <h4 className="font-medium capitalize mb-2 text-pink-700">
                            {category}
                          </h4>
                          <ul className="space-y-1">
                            {items.map((item, index) => (
                              <li
                                key={index}
                                className="text-sm flex items-start space-x-2"
                              >
                                <CheckCircle className="w-4 h-4 text-pink-500 flex-shrink-0 mt-1" />
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    )
                  }
                </div>
              </motion.div>

              {/* Community Insights */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-pink-50/80 rounded-lg p-6 border border-pink-100"
              >
                <h3 className="text-lg font-semibold mb-4 flex items-center text-pink-700">
                  <Users className="mr-2 text-pink-600" /> Community Insights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <ThumbsUp className="w-8 h-8 text-pink-500" />
                    <div>
                      <div className="text-2xl font-bold text-pink-700">
                        {analysis?.communityInsights?.similarExperiences ?? "--"}%
                      </div>
                      <div className="text-sm text-gray-700">
                        Report Similar Symptoms
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="w-8 h-8 text-pink-500" />
                    <div>
                      <div className="text-2xl font-bold text-pink-700">
                        {
                          analysis?.communityInsights
                            .percentageSeekingMedicalAttention
                        }
                        %
                      </div>
                      <div className="text-sm text-gray-700">
                        Sought Medical Care
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Heart className="w-8 h-8 text-pink-500" />
                    <div>
                      <div className="text-sm font-medium text-pink-700">
                        Common Relief:
                      </div>
                      <div className="text-sm text-gray-700">
                        {analysis?.communityInsights.commonRelief}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Medical Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="bg-pink-50/80 border-l-4 border-pink-300 p-4 rounded"
            >
              <div className="flex space-x-3">
                <AlertTriangle className="w-6 h-6 text-pink-500 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  This analysis is not a substitute for professional medical
                  advice. If symptoms persist or worsen, please consult a
                  healthcare provider.
                </p>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <motion.button
                onClick={() => {
                  setStep(1);
                  setSelectedSymptoms([]);
                  setIntensity("");
                  setDuration("");
                  setAdditionalInfo("");
                  setAnalysis(null);
                }}
                className="flex-1 py-3 px-6 rounded-md font-medium text-white bg-pink-500 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600 transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Start New Analysis
              </motion.button>

              {/* Save to History */}
              <motion.button
                onClick={() => {
                  updateSymptomHistory(selectedSymptoms);
                }}
                className="flex-1 py-3 px-6 rounded-md font-medium text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-700 bg-white dark:bg-zinc-800 hover:bg-pink-50 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600 transition-all"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                Save to History
              </motion.button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  interface CheckEmergencySymptomsProps {
    symptoms: string[];
  }

  const checkEmergencySymptoms = (symptoms: CheckEmergencySymptomsProps["symptoms"]): void => {
    const hasEmergency = symptoms.some((symptom: string) =>
      emergencySymptoms.includes(symptom.toLowerCase())
    );
    setShowEmergencyAlert(hasEmergency);
  };

  interface SymptomHistoryEntry {
    date: Date;
    symptoms: string[];
    intensity: string;
    duration: string;
    cycleDay: number | null;
  }

  const updateSymptomHistory = (newSymptoms: string[]): void => {
    const entry: SymptomHistoryEntry = {
      date: new Date(),
      symptoms: newSymptoms,
      intensity,
      duration,
      cycleDay,
    };
    setSymptomHistory((prev: SymptomHistoryEntry[]) => [...prev, entry]);
    analyzePatterns([...symptomHistory, entry]);
  };

  interface SymptomPattern {
    frequency: number;
    commonIntensity: string[];
    cycleDays: (number | null)[];
  }

  type SymptomPatterns = Record<string, SymptomPattern>;

  interface SymptomHistoryEntry {
    date: Date;
    symptoms: string[];
    intensity: string;
    duration: string;
    cycleDay: number | null;
  }

  const analyzePatterns = (history: SymptomHistoryEntry[]): void => {
    const patterns: SymptomPatterns = {};
    history.forEach((entry: SymptomHistoryEntry) => {
      entry.symptoms.forEach((symptom: string) => {
        if (!patterns[symptom]) {
          patterns[symptom] = {
            frequency: 1,
            commonIntensity: [entry.intensity],
            cycleDays: [entry.cycleDay],
          };
        } else {
          patterns[symptom].frequency++;
          patterns[symptom].commonIntensity.push(entry.intensity);
          patterns[symptom].cycleDays.push(entry.cycleDay);
        }
      });
    });
    setSymptomPatterns(patterns);
  };

  const EmergencyAlert = () => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-sm max-w-xl mx-auto"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-red-600 font-semibold text-base mb-1">
            Emergency Warning
          </h3>
          <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
            Some of your symptoms may require immediate medical attention.
            Please contact emergency services or visit the nearest emergency room.
          </p>
        </div>
      </div>
    </motion.div>
  );

  const SeverityGuideModal = ({
    symptom,
    onClose,
  }: {
    symptom: string;
    onClose: () => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
    >
      <div className="bg-white dark:bg-[#181f2e] rounded-xl shadow-xl p-6 max-w-md w-full border border-pink-100 dark:border-[#232b3d]">
        <h3 className="text-lg font-bold mb-4 text-pink-700 dark:text-pink-200">
          Severity Guide: <span className="font-semibold">{symptom}</span>
        </h3>
        <div className="space-y-3">
          {Object.entries(severityGuides[symptom] || {}).map(
            ([level, description]) => (
              <div
                key={level}
                className="p-3 rounded-lg bg-pink-50 dark:bg-[#232b3d] border border-pink-100 dark:border-[#232b3d] flex flex-col"
              >
                <span className="font-medium capitalize text-pink-700 dark:text-pink-200 mb-1">
                  {level}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-200">{description}</p>
              </div>
            )
          )}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full py-2 rounded-md bg-pink-600 hover:bg-pink-700 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-600"
        >
          Close Guide
        </button>
      </div>
    </motion.div>
  );

  const mockAiAnalysis = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Initialize default patterns if no history exists
    const defaultPatterns = selectedSymptoms.reduce((acc: SymptomPatterns, symptom) => {
      acc[symptom] = {
        frequency: 1,
        commonIntensity: [intensity],
        cycleDays: cycleDay ? [cycleDay] : [],
      };
      return acc;
    }, {} as SymptomPatterns);

    // Use existing patterns or default ones
    const currentPatterns =
      Object.keys(symptomPatterns).length > 0
        ? symptomPatterns
        : defaultPatterns;

    // Analyze patterns for better recommendations
    const mostFrequentSymptoms = Object.entries(currentPatterns)
      .sort(([, a], [, b]) => b.frequency - a.frequency)
      .slice(0, 3)
      .map(([symptom]) => symptom);

    const cyclePatterns = selectedSymptoms
      .map((symptom) => {
        const pattern = currentPatterns[symptom];
        if (pattern && pattern.cycleDays && pattern.cycleDays.length > 0) {
          const commonCycleDays = pattern.cycleDays.reduce((acc: Record<number, number>, day) => {
            if (day) {
              acc[day] = (acc[day] || 0) + 1;
            }
            return acc;
          }, {} as Record<number, number>);
          return { symptom, commonCycleDays };
        }
        return null;
      })
      .filter(Boolean);

    const cycleRecommendation = cycleDay
      ? `Your symptoms are being recorded for day ${cycleDay} of your cycle`
      : "Consider tracking your cycle day for better pattern analysis";

    return {
      possibleCauses: [
        "Hormonal changes",
        "Stress",
        "Dietary factors",
        "Sleep patterns",
        "Exercise habits",
      ],
      suggestions: [
        "Get plenty of rest",
        "Stay hydrated",
        "Consider speaking with a healthcare provider",
        "Track your symptoms regularly",
        "Practice stress management techniques",
      ],
      communityInsights: {
        similarExperiences: 75,
        commonRelief: "Warm compress and over-the-counter pain relievers",
        percentageSeekingMedicalAttention: 30,
      },
      patterns: {
        frequentSymptoms: mostFrequentSymptoms,
        cyclePatterns,
        recommendations: [
          cycleRecommendation,
          "Consider tracking these patterns with your healthcare provider",
          "Preventive measures may be more effective when started before these days",
        ],
      },
      lifestyle: {
        diet: [
          "Increase water intake",
          "Reduce caffeine consumption",
          "Add anti-inflammatory foods",
        ],
        exercise: [
          "Light yoga or stretching",
          "Moderate cardio exercises",
          "Regular walking",
        ],
        stress: [
          "Practice deep breathing",
          "Try meditation",
          "Ensure adequate sleep",
        ],
      },
    };
  };


  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="flex min-h-screen justify-center items-center mx-auto bg-gradient-to-br from-pink-50 via-white to-pink-100"
      style={{ backdropFilter: "blur(2px)" }}
    >
      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-2 py-8 sm:px-6 lg:px-8 dark:bg-transparent">
      <div className="w-full max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <h1 className={`flex justify-center items-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 text-2xl sm:text-3xl gap-2`}>
          <span className="pb-2">AI-Powered</span> <span className={`${cookie.className} text-5xl pb-2 pr-1`}>
            Symptom Analysis
            </span>
        </h1>
        </header>
        <section className="bg-white dark:bg-[#181f2e] rounded-xl shadow-lg border border-pink-100 dark:border-[#232b3d] px-4 sm:px-8 py-6 sm:py-8">
        {/* Progress Bar */}
        <div className="w-full bg-pink-100 dark:bg-[#232b3d] rounded-full h-2 mb-6 overflow-hidden">
          <motion.div
          className="bg-pink-400 dark:bg-pink-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((step - 1) / 5) * 100}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${((step - 1) / 5) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
        {/* Stepper */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center flex-1">
            <motion.div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 ${
              step >= stepNumber
              ? "bg-pink-200 dark:bg-pink-700 text-pink-700 dark:text-white border-pink-400"
              : "bg-pink-50 dark:bg-[#232b3d] text-gray-400 border-pink-100 dark:border-[#232b3d]"
            }`}
            animate={{
              scale: step === stepNumber ? 1.12 : 1,
              boxShadow:
              step === stepNumber
                ? "0 4px 24px 0 rgba(236, 72, 153, 0.15)"
                : "none",
            }}
            transition={{ duration: 0.3 }}
            >
            {step > stepNumber ? (
              <CheckCircle size={20} className="text-pink-700 dark:text-white" />
            ) : (
              <span className="font-semibold">{stepNumber}</span>
            )}
            </motion.div>
            <span className="text-xs mt-2 text-gray-500 dark:text-gray-400 font-medium hidden sm:block">
            Step {stepNumber}
            </span>
          </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
          key={step}
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          >
          {renderStep()}
          </motion.div>
        </AnimatePresence>
        </section>
      </div>
      </main>
    </motion.div>
  );
}
