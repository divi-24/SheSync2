/* eslint-disable */

"use client"
import React, { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import {
  Calendar,

  HeartPulse,
  Zap,

  ChevronDown,
  ChevronUp,
  Heart,
  ActivitySquare,
  ClipboardList,
  Stethoscope,
  Bot,
  BarChart2,
  CheckCircle2,
} from "lucide-react";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { useRef } from "react";
import { Cookie } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";

const cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
});

// const server_url = "http://localhost:5000/";
// const local_url = "http://localhost:3000/";


// const moodOptions = [
//   { name: "Happy", icon: Smile },
//   { name: "Sad", icon: Frown },
//   { name: "Calm", icon: Coffee },
//   { name: "Angry", icon: Angry },
//   { name: "Tired", icon: Moon },
//   { name: "Energized", icon: Zap },
// ];

// const moodSeverityOptions = [
//   { name: "Low", value: "low" },
//   { name: "Medium", value: "medium" },
//   { name: "High", value: "high" },
// ];

// const symptomOptions = [
//   "Irregular menstruation (Oligomenorrhea)",
//   "Heavy menstrual bleeding (Menorrhagia)",
//   "Excessive Hair growth (face, body - including on back, belly, and chest)",
//   "Acne (face, chest, and upper back)",
//   "Weight gain",
//   "Skin darkening (Neck, in the groin, and under the breasts)",
//   "Skipped or absence of menstruation (Amenorrhea)",
//   "Hair loss (hair on the scalp gets thinner and fall out)",
//   "Skin Tags (Acrochordons)",
//   "Sleep Disturbances",
//   "Mood Disorders",
//   "Infertility",
//   "Pelvic Pain",
//   "Headaches",
//   "Fatigue",
//   "Oily Skin or Scalp",
//   "Appetite Changes or Cravings",
//   "Bladder Issues",
//   "Reduced Libido",
//   "Hoarseness or Voice Changes",
//   "Associated Metabolic and Long-Term Risks",
//   "Insulin Resistance",
//   "Dyslipidemia",
//   "Cardiovascular Risks",
//   "Endometrial Hyperplasia",
//   "Diagnostic Clues (Not Symptoms, but Relevant)",
//   "Ovarian Morphology",
//   "Lab Abnormalities",
// ];

const categorizedSymptoms = {
  "Menstrual Symptoms": [
    "Irregular menstruation (Oligomenorrhea)",
    "Heavy menstrual bleeding (Menorrhagia)",
    "Skipped or absence of menstruation (Amenorrhea)",
  ],
  "Physical Appearance": [
    "Excessive Hair growth (face, body - including on back, belly, and chest)",
    "Acne (face, chest, and upper back)",
    "Skin darkening (Neck, in the groin, and under the breasts)",
    "Hair loss (hair on the scalp gets thinner and fall out)",
    "Skin Tags (Acrochordons)",
    "Oily Skin or Scalp",
  ],
  "Metabolic Signs": [
    "Weight gain",
    "Fatigue",
    "Appetite Changes or Cravings",
    "Reduced Libido",
    "Associated Metabolic and Long-Term Risks",
    "Insulin Resistance",
    "Dyslipidemia",
    "Cardiovascular Risks",
    "Endometrial Hyperplasia",
    "Ovarian Morphology",
    "Lab Abnormalities",
  ],
  "Mental Health": [
    "Mood Disorders",
    "Sleep Disturbances",
    "Infertility",
    "Headaches",
    "Bladder Issues",
    "Hoarseness or Voice Changes",
  ],
  "Other Clues": ["Diagnostic Clues (Not Symptoms, but Relevant)"],
};
const symptomSeverityOptions = ["None", "Mild", "Moderate", "Severe"];

// const sleepQualityOptions = ["Poor", "Fair", "Good", "Excellent"];
const genAI = new GoogleGenerativeAI("AIzaSyDC_nwnZggf8CYID3qvJfazEE8KBnqd9Ro");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// const symptomSeverityMapping = {
//   severe: { value: 100, color: "#ec4899" },
//   moderate: { value: 66, color: "#f472b6" },
//   mild: { value: 33, color: "#fbcfe8" },
//   none: { value: 0, color: "#f9fafb" },
// };

type SymptomChartProps = {
  symptoms: string[];
  severities: { [symptom: string]: string };
};

const SymptomChart = ({ symptoms, severities }: SymptomChartProps) => {
  const chartData = useMemo(() => {
    return symptoms
      .map((symptom) => {
        const severity = (severities[symptom] || "None").toLowerCase();
        const severityInfo = {
          severe: { value: 100, color: "#ef4444", bgColor: "#fee2e2" },
          moderate: { value: 66, color: "#f59e0b", bgColor: "#fef3c7" },
          mild: { value: 33, color: "#ec4899", bgColor: "#fce7f3" },
          none: { value: 0, color: "#9ca3af", bgColor: "#f3f4f6" },
        }[severity] || { value: 0, color: "#9ca3af", bgColor: "#f3f4f6" };

        return {
          name: symptom,
          severity: severity,
          ...severityInfo,
        };
      })
      .filter((item) => item.name && item.severity);
  }, [symptoms, severities]);

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 h-full w-full">
      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Symptom Analysis
      </h3>

      <div className="h-[calc(100%-4rem)] overflow-y-auto pr-2 -mr-2 scroll-smooth">
        <div className="space-y-4">
          {chartData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-700/30 rounded-lg overflow-hidden"
            >
              {/* Symptom header */}
              <div className="p-3 border-b border-gray-100 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium text-gray-900 dark:text-gray-100">
                    {item.name}
                  </h5>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: item.bgColor,
                      color: item.color,
                    }}
                  >
                    {item.severity.charAt(0).toUpperCase() +
                      item.severity.slice(1)}
                  </span>
                </div>
              </div>

              {/* Progress bar section */}
              <div className="p-3 bg-white/50 dark:bg-gray-800/50">
                <div className="relative">
                  {/* Background track */}
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    {/* Severity gradient background */}
                    <div className="absolute inset-0 flex">
                      <div className="w-1/4 bg-gradient-to-r from-gray-100 to-pink-100 dark:from-gray-700 dark:to-pink-900 opacity-20" />
                      <div className="w-1/4 bg-gradient-to-r from-pink-100 to-yellow-100 dark:from-pink-900 dark:to-yellow-900 opacity-20" />
                      <div className="w-1/4 bg-gradient-to-r from-yellow-100 to-red-100 dark:from-yellow-900 dark:to-red-900 opacity-20" />
                      <div className="w-1/4 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 opacity-20" />
                    </div>

                    {/* Progress bar */}
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="relative h-full rounded-full"
                      style={{
                        backgroundColor: item.color,
                        boxShadow: `0 0 10px ${item.color}40`,
                      }}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div
                          className="absolute inset-0 opacity-30 animate-[shimmer_2s_infinite]"
                          style={{
                            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
                            transform: "translateX(-100%)",
                          }}
                        />
                      </div>
                    </motion.div>
                  </div>

                  {/* Severity markers */}
                  <div className="absolute top-3 left-0 right-0 flex justify-between">
                    {["None", "Mild", "Moderate", "Severe"].map((label, i) => (
                      <div key={label} className="flex flex-col items-center">
                        <div
                          className={`w-px h-2 ${item.severity === label.toLowerCase()
                            ? "bg-current"
                            : "bg-gray-300 dark:bg-gray-600"
                            }`}
                        />
                        <span
                          className={`text-xs mt-1 ${item.severity === label.toLowerCase()
                            ? `text-${item.color}`
                            : "text-gray-400 dark:text-gray-500"
                            }`}
                        >
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Gradient overlay for scroll fade */}
      <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
    </div>
  );
};

// const MoodTrendChart = ({
//   moodTypes,
//   moodDate,
// }: {
//   moodTypes: string[];
//   moodDate: string;
// }) => {
//   const moodValues = {
//     Happy: { value: 100, color: "#10B981" }, // Green
//     Energized: { value: 80, color: "#3B82F6" }, // Blue
//     Calm: { value: 60, color: "#8B5CF6" }, // Purple
//     Tired: { value: 40, color: "#F59E0B" }, // Orange
//     Sad: { value: 20, color: "#6B7280" }, // Gray
//     Angry: { value: 0, color: "#EF4444" }, // Red
//   };

//   const chartData = useMemo(() => {
//     type MoodKey = keyof typeof moodValues;
//     return moodTypes
//       .map((mood) => {
//         const moodKey = mood as MoodKey;
//         return {
//           mood,
//           ...(moodValues[moodKey] || { value: 50, color: "#6B7280" }),
//         };
//       })
//       .sort((a, b) => b.value - a.value); // Sort by value for better visualization
//   }, [moodTypes]);

//   return (
//     <div className="relative h-64 bg-white dark:bg-gray-800 rounded-lg p-4">
//       <h3 className="text-lg font-semibold mb-4">Mood Trends</h3>
//       <div className="relative h-48">
//         {/* Grid lines */}
//         {[0, 25, 50, 75, 100].map((y) => (
//           <div
//             key={y}
//             className="absolute w-full border-t border-gray-200 dark:border-gray-700"
//             style={{ bottom: `${y}%` }}
//           >
//             <span className="absolute -left-8 transform -translate-y-1/2 text-xs text-gray-500">
//               {y}%
//             </span>
//           </div>
//         ))}

//         {/* Mood points and connections */}
//         <div className="absolute inset-0 flex items-stretch justify-between px-8">
//           {chartData.map((point, index) => (
//             <div
//               key={index}
//               className="relative flex-1"
//               style={{ height: "100%" }}
//             >
//               {index < chartData.length - 1 && (
//                 <motion.div
//                   initial={{ scaleX: 0 }}
//                   animate={{ scaleX: 1 }}
//                   transition={{ duration: 0.6, delay: index * 0.1 }}
//                   style={{
//                     position: "absolute",
//                     top: `${100 - point.value}%`,
//                     left: "50%",
//                     width: "100%",
//                     height: "2px",
//                     background: `linear-gradient(to right, ${point.color}, ${chartData[index + 1]?.color || point.color
//                       })`,
//                     transformOrigin: "left",
//                   }}
//                 />
//               )}
//               <motion.div
//                 initial={{ scale: 0 }}
//                 animate={{ scale: 1 }}
//                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                 className="absolute w-4 h-4 rounded-full cursor-pointer transform -translate-x-1/2 group hover:scale-125 transition-transform"
//                 style={{
//                   backgroundColor: point.color,
//                   left: "50%",
//                   top: `${100 - point.value}%`,
//                 }}
//               >
//                 <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
//                   <div className="bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
//                     {point.mood}: {point.value}%
//                   </div>
//                 </div>
//               </motion.div>
//             </div>
//           ))}
//         </div>

//         {/* Mood labels */}
//         <div className="absolute bottom-0 left-0 right-0 flex justify-between px-8 pt-4">
//           {chartData.map((item, index) => (
//             <div key={index} className="flex flex-col items-center">
//               <div
//                 className="w-3 h-3 rounded-full mb-1"
//                 style={{ backgroundColor: item.color }}
//               />
//               <span className="text-xs text-gray-600 dark:text-gray-400 transform -rotate-45 origin-top-left">
//                 {item.mood}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// const PCOSRiskChart = ({ pcosReport }: { pcosReport: string }) => {
//   const [riskLevel, riskCategory] = useMemo(() => {
//     if (!pcosReport || typeof pcosReport !== "string") return [0, "Low"];
//     try {
//       // Extract risk percentage from AI analysis
//       const likelihoodMatch = pcosReport.match(/Likelihood:\s*(\d+)%/);
//       const percentage = likelihoodMatch ? parseInt(likelihoodMatch[1]) : 0;

//       // Determine risk category
//       let category = "Low";
//       if (percentage >= 75) category = "High";
//       else if (percentage >= 40) category = "Moderate";

//       return [percentage, category];
//     } catch (error) {
//       console.error("Error parsing PCOS report:", error);
//       return [0, "Low"];
//     }
//   }, [pcosReport]);

//   const circumference = 2 * Math.PI * 60;
//   interface RiskColorFunction {
//     (level: number): string;
//   }

//   const getRiskColor: RiskColorFunction = (level: number): string => {
//     if (level >= 75) return "#EF4444"; // High risk - Red
//     if (level >= 40) return "#F59E0B"; // Moderate risk - Yellow
//     return "#10B981"; // Low risk - Green
//   };

//   return (
//     <div className="relative h-64 bg-white dark:bg-gray-800 rounded-lg p-4">
//       <h3 className="text-lg font-semibold mb-4">PCOS Risk Assessment</h3>
//       <div className="relative h-48 flex items-center justify-center">
//         <div className="relative">
//           <svg className="w-40 h-40 transform -rotate-90">
//             {/* Background circle */}
//             <circle
//               cx="80"
//               cy="80"
//               r="60"
//               fill="none"
//               stroke="#e5e7eb"
//               strokeWidth="12"
//             />
//             {/* Risk level circle */}
//             <motion.circle
//               cx="80"
//               cy="80"
//               r="60"
//               fill="none"
//               stroke={getRiskColor(riskLevel)}
//               strokeWidth="12"
//               strokeLinecap="round"
//               initial={{ strokeDasharray: `0 ${circumference}` }}
//               animate={{
//                 strokeDasharray: `${(riskLevel / 100) * circumference
//                   } ${circumference}`,
//               }}
//               transition={{ duration: 1, ease: "easeOut" }}
//             />
//             {/* Risk level marker */}
//             <motion.circle
//               cx="80"
//               cy="20"
//               r="4"
//               fill={getRiskColor(riskLevel)}
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 1 }}
//             />
//           </svg>
//           <div className="absolute inset-0 flex flex-col items-center justify-center">
//             <motion.div
//               initial={{ scale: 0 }}
//               animate={{ scale: 1 }}
//               transition={{ delay: 0.5, duration: 0.3 }}
//               className="text-center"
//             >
//               <span
//                 className="text-4xl font-bold"
//                 style={{ color: getRiskColor(riskLevel) }}
//               >
//                 {riskLevel}%
//               </span>
//               <span className="block text-sm text-gray-500 mt-1">
//                 {riskCategory} Risk
//               </span>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//       <div className="flex justify-between px-4 mt-4">
//         {["Low Risk", "Moderate Risk", "High Risk"].map((label, index) => (
//           <div key={label} className="flex items-center">
//             <div
//               className="w-3 h-3 rounded-full mr-1"
//               style={{
//                 backgroundColor: getRiskColor(
//                   index === 0 ? 0 : index === 1 ? 50 : 100
//                 ),
//               }}
//             />
//             <span className="text-xs text-gray-600 dark:text-gray-400">
//               {label}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

type RecommendationCardProps = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

// const RecommendationCard = ({
//   title,
//   description,
//   icon: Icon,
// }: RecommendationCardProps) => (
//   <motion.div
//     initial={{ opacity: 0, y: 20 }}
//     animate={{ opacity: 1, y: 0 }}
//     className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md"
//   >
//     <div className="flex items-start space-x-3">
//       <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
//         <Icon className="h-6 w-6 text-pink-600 dark:text-pink-400" />
//       </div>
//       <div>
//         <h4 className="font-semibold text-gray-900 dark:text-gray-100">
//           {title}
//         </h4>
//         <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//           {description}
//         </p>
//       </div>
//     </div>
//   </motion.div>
// );

// const Tooltip = ({
//   children,
//   content,
// }: {
//   children: React.ReactNode;
//   content: React.ReactNode;
// }) => (
//   <div className="relative group">
//     {children}
//     <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
//       {content}
//     </div>
//   </div>
// );

const AnalysisSummaryChart = ({ pcosReport }: { pcosReport: string }) => {
  const analysisData = useMemo(() => {
    if (!pcosReport) return null;

    // Extract risk percentage
    const riskMatch = pcosReport.match(/Likelihood:\s*(\d+)%/);
    const riskPercentage = riskMatch ? parseInt(riskMatch[1]) : 0;

    // Determine risk level and color
    interface RiskInfo {
      level: "Low" | "Moderate" | "High";
      color: string;
      bgColor: string;
    }

    const getRiskInfo = (percentage: number): RiskInfo => {
      if (percentage >= 75)
        return { level: "High", color: "#ef4444", bgColor: "#fee2e2" };
      if (percentage >= 40)
        return { level: "Moderate", color: "#f59e0b", bgColor: "#fef3c7" };
      return { level: "Low", color: "#10b981", bgColor: "#d1fae5" };
    };

    // Extract key findings
    const findingsSection =
      pcosReport.split("## Symptom Analysis")[1]?.split("##")[0] || "";
    const keyFindings = findingsSection
      .split("\n")
      .filter((line) => line.trim().length > 0 && line.includes("**"))
      .map((finding) => {
        const match = finding.match(/\*\*(.*?)\((.*?)\):\*\*(.*)/);
        if (match) {
          return {
            symptom: match[1].trim(),
            severity: match[2].trim(),
            description: match[3].trim(),
          };
        }
        return null;
      })
      .filter(Boolean)
      .slice(0, 3);

    const riskInfo = getRiskInfo(riskPercentage);
    return {
      riskPercentage,
      ...riskInfo,
      keyFindings,
    };
  }, [pcosReport]);

  if (!analysisData) return null;

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 h-full w-full flex flex-col">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Analysis Summary
      </h3>

      <div className="flex-1 flex flex-col min-h-0">
        {/* Risk meter section */}
        <div className="mb-4">
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4">
            <div className="flex items-center justify-center">
              {/* Risk circle */}
              <div className="relative w-40 h-40">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="78"
                    cy="78"
                    r="70"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-gray-200 dark:text-gray-600"
                  />
                  <motion.circle
                    cx="78"
                    cy="78"
                    r="70"
                    fill="none"
                    stroke={analysisData.color}
                    strokeWidth="10"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: analysisData.riskPercentage / 100 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    style={{
                      strokeDasharray: `${2 * Math.PI * 80}`,
                      strokeDashoffset: `${2 *
                        Math.PI *
                        80 *
                        (1 - analysisData.riskPercentage / 100)
                        }`,
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: analysisData.color }}
                  >
                    {analysisData.riskPercentage}%
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: analysisData.color }}
                    />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      {analysisData.level} Risk
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key findings section */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3 px-1">
            Key Findings
          </h4>
          <div className="overflow-y-auto h-[calc(100%-2rem)] space-y-3 pr-2 -mr-2 scroll-smooth">
            {analysisData.keyFindings.map((finding, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700/30 rounded-lg overflow-hidden"
              >
                {/* Finding header */}
                <div className="p-3 border-b border-gray-100 dark:border-gray-600">
                  <div className="flex items-start justify-between gap-3">
                    <h5 className="font-medium text-gray-900 dark:text-gray-100 text-sm">

                    </h5>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 whitespace-nowrap"
                      style={{
                        backgroundColor:
                          finding && finding.severity && finding.severity.toLowerCase() === "severe"
                            ? "#fee2e2"
                            : finding && finding.severity && finding.severity.toLowerCase() === "moderate"
                              ? "#fef3c7"
                              : "#d1fae5",
                        color:
                          finding && finding.severity && finding.severity.toLowerCase() === "severe"
                            ? "#ef4444"
                            : finding && finding.severity && finding.severity.toLowerCase() === "moderate"
                              ? "#f59e0b"
                              : "#10b981",
                      }}
                    >
                      {finding ? finding.severity : ""}
                    </span>
                  </div>
                </div>

                {/* Finding description */}
                <div className="p-3 bg-white/50 dark:bg-gray-800/50">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed break-words">
                    {finding ? finding.description : ""}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scroll fade overlay */}
        <div className="absolute bottom-0 left-0 right-2 h-12 bg-gradient-to-t from-white dark:from-gray-800 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default function Diagnosis() {
  // const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  // const [cycleDuration, setCycleDuration] = useState("");
  // const [lastPeriodStart, setLastPeriodStart] = useState("");
  // const [lastPeriodDuration, setLastPeriodDuration] = useState("");
  const [moodTypes, setMoodTypes] = useState<string[]>([]);
  // setMoodTypes([]);
  // const [moodSeverity, setMoodSeverity] = useState("");
  const [moodDate, setMoodDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [symptomDates, setSymptomDates] = useState<{ [key: string]: string }>({});
//  setMoodDate(format(new Date(), "yyyy-MM-dd"));
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomSeverities, setSymptomSeverities] = useState<{ [key: string]: string }>({});
  // const [symptomDate, setSymptomDate] = useState(
  //   format(new Date(), "yyyy-MM-dd")
  // );
  // console.log("Selected Symptoms:", symptoms);
  // const [sleepDuration, setSleepDuration] = useState("");
  // const [sleepQuality, setSleepQuality] = useState("");
  // const [nextPeriodPrediction, setNextPeriodPrediction] = useState("");
  // console.log("Symptom Severities:", symptomSeverities);
  const [expandedSections, setExpandedSections] = useState({
    cycleInfo: true,
    moodTracking: true,
    symptomTracking: true,
    sleepTracking: true,
    healthTips: true,
  });
  // console.log("Expanded Sections:", expandedSections);
  const [pcosReport, setPcosReport] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHealthTips, setShowHealthTips] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [chartData, setChartData] = useState<{
    symptoms: { name: string; severity: string }[];
    moods: { type: string; date: string }[];
    riskLevel: number;
  }>({
    symptoms: [],
    moods: [],
    riskLevel: 0,
  });
  const [recommendations, setRecommendations] = useState<RecommendationCardProps[]>([]);
  // console.log("Recommendations:", recommendations);
  useEffect(() => {
    if (pcosReport) {
      setShowCharts(true);
      try {
        // Extract data for charts from the AI report
        const extractedData = {
          symptoms: symptoms.map((symptom) => ({
            name: symptom,
            severity: symptomSeverities[symptom] || "Low",
          })),
          moods: moodTypes.map((mood) => ({
            type: mood,
            date: moodDate,
          })),
          riskLevel:
            typeof pcosReport === "string" &&
              pcosReport.match(/Likelihood: (\d+)%/)
              ? (() => {
                const match = pcosReport.match(/Likelihood: (\d+)%/);
                return match ? parseInt(match[1]) : 0;
              })()
              : 0,
        };
        setChartData(extractedData);
      } catch (error) {
        console.error("Error processing chart data:", error);
        setChartData({
          symptoms: [],
          moods: [],
          riskLevel: 0,
        });
      }
    }
  }, [pcosReport, symptoms, symptomSeverities, moodTypes, moodDate]);

  useEffect(() => {
    if (pcosReport) {
      // Generate recommendations based on the AI report
      const newRecommendations = [
        {
          title: "Lifestyle Changes",
          description:
            "Consider incorporating regular exercise and a balanced diet to manage PCOS symptoms.",
          icon: ActivitySquare,
        },
        {
          title: "Medical Consultation",
          description:
            "Schedule a visit with your healthcare provider for a comprehensive evaluation.",
          icon: Stethoscope,
        },
        {
          title: "Stress Management",
          description:
            "Practice mindfulness and stress-reduction techniques to help balance hormones.",
          icon: Heart,
        },
      ];
      setRecommendations(newRecommendations);
    }
  }, [pcosReport]);

  // interface InputChangeEvent {
  //   target: {
  //     name: string;
  //     value: string;
  //   };
  // }

  // const handleInputChange = (e: InputChangeEvent) => {
  //   const { name, value } = e.target;
  //   switch (name) {
  //     case "cycleDuration":
  //       setCycleDuration(value);
  //       break;
  //     case "lastPeriodStart":
  //       setLastPeriodStart(value);
  //       break;
  //     case "lastPeriodDuration":
  //       setLastPeriodDuration(value);
  //       break;
  //     case "moodDate":
  //       setMoodDate(value);
  //       break;
  //     case "symptomDate":
  //       setSymptomDate(value);
  //       break;
  //     case "sleepDuration":
  //       setSleepDuration(value);
  //       break;
  //     case "sleepQuality":
  //       setSleepQuality(value);
  //       break;
  //     default:
  //       break;
  //   }
  // };

  // interface HandleMoodTypeChange {
  //   (moodName: string): void;
  // }

  // const handleMoodTypeChange: HandleMoodTypeChange = (moodName) => {
  //   setMoodTypes((prev: string[]) =>
  //     prev.includes(moodName)
  //       ? prev.filter((mood) => mood !== moodName)
  //       : [...prev, moodName]
  //   );
  // };

  interface HandleSymptomChange {
    (symptom: string): void;
  }

  const handleSymptomChange: HandleSymptomChange = (symptom) => {
    setSymptoms((prev: string[]) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  interface SymptomSeverityChangeEvent {
    symptom: string;
    severity: string;
  }

  const handleSymptomSeverityChange = (
    symptom: SymptomSeverityChangeEvent["symptom"],
    severity: SymptomSeverityChangeEvent["severity"]
  ) => {
    setSymptomSeverities((prev: { [key: string]: string }) => ({
      ...prev,
      [symptom]: severity,
    }));
  };

  interface SymptomDateChangeEvent {
    symptom: string;
    date: string;
  }

  const handleSymptomDateChange = (
    symptom: SymptomDateChangeEvent["symptom"],
    date: SymptomDateChangeEvent["date"]
  ) => {
    setSymptomDates((prevDates: { [key: string]: string }) => ({
      ...prevDates,
      [symptom]: date,
    }));
  };


  // const predictNextPeriod = () => {
  //   if (lastPeriodStart && cycleDuration) {
  //     const nextPeriodDate = addDays(
  //       new Date(lastPeriodStart),
  //       parseInt(cycleDuration)
  //     );
  //     setNextPeriodPrediction(format(nextPeriodDate, "yyyy-MM-dd"));
  //   }
  // };

  const handleSubmit = async () => {
    if (symptoms.length === 0) {
      setError("Please select at least one symptom");
      return;
    }

    setIsLoading(true);
    setError("");
    setShowCharts(false);
    setPcosReport("");

    try {
      // Format symptoms with severities for better analysis
      const formattedSymptoms = symptoms
        .map((symptom) => {
          const severity = symptomSeverities[symptom] || "None";
          return `${symptom} (${severity})`;
        })
        .join("\n- ");

      const prompt = `Analyze the following symptoms for PCOS risk assessment:
- ${formattedSymptoms}

Please provide a structured analysis in the following format:

## Symptom Analysis
[Analyze each symptom's severity and relevance to PCOS]

## Risk Assessment
Likelihood: {X}% (provide a number between 0-100 based on symptoms)
Risk Level: [Low/Moderate/High]

## Severity Levels
[List each symptom with its severity level: None/Mild/Moderate/Severe]

## Recommended Tests
[List recommended medical tests]

## Action Steps
[Provide immediate action steps]`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const analysisText = response.text();

      // Process the AI response
      const processedData = processAIResponse(
        analysisText,
        symptoms,
        symptomSeverities
      );

      setPcosReport(analysisText);
      setChartData(processedData);
      setShowCharts(true);
      setShowHealthTips(true);
    } catch (err) {
      console.error("Error generating report:", err);
      setError("Failed to generate report. Please try again.");
      setShowCharts(false);
      setShowHealthTips(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to process AI response
  interface ProcessedSymptom {
    name: string;
    severity: string;
  }

  interface ProcessedMood {
    type: string;
    date: string;
  }

  interface ProcessedAIResponse {
    symptoms: ProcessedSymptom[];
    riskLevel: number;
    moods: ProcessedMood[];
  }

  const processAIResponse = (
    text: string,
    symptoms: string[],
    severities: { [key: string]: string }
  ): ProcessedAIResponse => {
    try {
      // Extract risk percentage
      const riskMatch = text.match(/Likelihood:\s*(\d+)%/);
      const riskPercentage = riskMatch ? parseInt(riskMatch[1]) : 0;

      // Extract severity levels for each symptom
      const severitySection =
        text.split("## Severity Levels")[1]?.split("##")[0] || "";
      const processedSymptoms: ProcessedSymptom[] = symptoms.map((symptom) => {
        let severity = "None";
        if (severitySection.toLowerCase().includes(symptom.toLowerCase())) {
          if (
            severitySection
              .toLowerCase()
              .includes(symptom.toLowerCase() + ".*severe")
          ) {
            severity = "Severe";
          } else if (
            severitySection
              .toLowerCase()
              .includes(symptom.toLowerCase() + ".*moderate")
          ) {
            severity = "Moderate";
          } else if (
            severitySection
              .toLowerCase()
              .includes(symptom.toLowerCase() + ".*mild")
          ) {
            severity = "Mild";
          }
        }
        return {
          name: symptom,
          severity: severity,
        };
      });

      // Process mood data if available
      const moodData: ProcessedMood[] = moodTypes.map((mood) => ({
        type: mood,
        date: moodDate,
      }));

      return {
        symptoms: processedSymptoms,
        riskLevel: riskPercentage,
        moods: moodData,
      };
    } catch (error) {
      console.error("Error processing AI response:", error);

      const processedAIResponse: ProcessedAIResponse = {
        symptoms: symptoms.map((s: string): ProcessedSymptom => ({
          name: s,
          severity: "None",
        })),
        riskLevel: 0,
        moods: [],
      };

      return processedAIResponse;
    }
  };

  // Icon mapping for categories
  const categoryIcons: { [key: string]: React.ComponentType<{ className?: string }> } = {
    "Menstrual Symptoms": Calendar,
    "Physical Appearance": HeartPulse,
    "Metabolic Signs": BarChart2,
    "Mental Health": Bot,
    "Other Clues": ClipboardList,
  };

  // Color mapping for categories
  const categoryColors: { [key: string]: string } = {
    "Menstrual Symptoms": "from-pink-400 to-pink-600",
    "Physical Appearance": "from-purple-400 to-purple-600",
    "Metabolic Signs": "from-yellow-400 to-yellow-600",
    "Mental Health": "from-blue-400 to-blue-600",
    "Other Clues": "from-gray-400 to-gray-600",
  };

  // State for expanded categories
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({});

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  type SectionKey = "cycleInfo" | "moodTracking" | "symptomTracking" | "sleepTracking" | "healthTips";

  const toggleSection = (section: SectionKey): void => {
    setExpandedSections((prev) => ({
      cycleInfo: section === "cycleInfo" ? !prev.cycleInfo : prev.cycleInfo,
      moodTracking: section === "moodTracking" ? !prev.moodTracking : prev.moodTracking,
      symptomTracking: section === "symptomTracking" ? !prev.symptomTracking : prev.symptomTracking,
      sleepTracking: section === "sleepTracking" ? !prev.sleepTracking : prev.sleepTracking,
      healthTips: section === "healthTips" ? !prev.healthTips : prev.healthTips,
    }));
  }

  interface RenderSectionProps {
    title: React.ReactNode;
    content: React.ReactNode;
    section: SectionKey;
  }

  // const renderSection = (
  //   title: RenderSectionProps["title"],
  //   content: RenderSectionProps["content"],
  //   section: SectionKey
  // ) => (
  //   <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
  //     <div
  //       className="flex justify-between items-center cursor-pointer"
  //       onClick={() => toggleSection(section)}
  //     >
  //       <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
  //         {title}
  //       </h3>
  //       {expandedSections[section] ? (
  //         <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
  //       ) : (
  //         <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
  //       )}
  //     </div>
  //     {expandedSections[section] && <div className="mt-4">{content}</div>}
  //   </div>
  // );

  // const generateHealthTips = useMemo(() => {
  //   const tips = [];

  //   if (cycleDuration) {
  //     const cycleDurationInt = parseInt(cycleDuration);
  //     if (cycleDurationInt < 21) {
  //       tips.push(
  //         "Your cycle is shorter than average. Consider consulting with a healthcare professional to ensure everything is normal."
  //       );
  //     } else if (cycleDurationInt > 35) {
  //       tips.push(
  //         "Your cycle is longer than average. This can be normal, but you may want to discuss it with your doctor."
  //       );
  //     } else {
  //       tips.push(
  //         "Your cycle length is within the normal range. Keep tracking to notice any changes."
  //       );
  //     }
  //   }

  //   if (lastPeriodDuration) {
  //     const periodDuration = parseInt(lastPeriodDuration);
  //     if (periodDuration > 7) {
  //       tips.push(
  //         "Your period duration is longer than average. If this is consistent, consider discussing it with your healthcare provider."
  //       );
  //     } else if (periodDuration < 3) {
  //       tips.push(
  //         "Your period duration is shorter than average. This can be normal, but keep an eye on it and consult your doctor if you're concerned."
  //       );
  //     }
  //   }

  //   if (moodTypes.includes("Sad") || moodTypes.includes("Angry")) {
  //     tips.push(
  //       "Mood swings can be common during your cycle. Try relaxation techniques or gentle exercise to help manage your emotions."
  //     );
  //   }
  //   if (moodTypes.includes("Tired")) {
  //     tips.push(
  //       "Fatigue is common during menstruation. Ensure you're getting enough rest and consider iron-rich foods to combat tiredness."
  //     );
  //   }

  //   if (symptoms.includes("Lower Abdomen Cramps")) {
  //     tips.push(
  //       "For menstrual cramps, try using a heating pad or taking a warm bath to alleviate discomfort."
  //     );
  //   }
  //   if (symptoms.includes("Bloating")) {
  //     tips.push(
  //       "To reduce bloating, try to avoid salty foods and increase your water intake."
  //     );
  //   }
  //   if (symptoms.includes("Headaches")) {
  //     tips.push(
  //       "Headaches can be common during your cycle. Stay hydrated and consider over-the-counter pain relievers if needed."
  //     );
  //   }
  //   if (symptoms.includes("Sleep Disruption")) {
  //     tips.push(
  //       "To improve sleep during your cycle, try to maintain a consistent sleep schedule and create a relaxing bedtime routine."
  //     );
  //   }

  //   if (sleepDuration) {
  //     const sleepDurationInt = parseFloat(sleepDuration);
  //     if (sleepDurationInt < 7) {
  //       tips.push(
  //         "You might not be getting enough sleep. Aim for 7-9 hours of sleep per night for optimal health and well-being."
  //       );
  //     } else if (sleepDurationInt > 9) {
  //       tips.push(
  //         "You're getting more sleep than average. While this can be normal, excessive sleep might indicate other health issues. Consider discussing with your doctor if this persists."
  //       );
  //     } else {
  //       tips.push(
  //         "Your sleep duration is within the recommended range. Keep maintaining this healthy sleep pattern!"
  //       );
  //     }
  //   }

  //   if (sleepQuality === "Poor" || sleepQuality === "Fair") {
  //     tips.push(
  //       "To improve sleep quality, try establishing a consistent bedtime routine, avoiding screens before bed, and creating a comfortable sleep environment."
  //     );
  //   }

  //   tips.push(
  //     "Stay hydrated by drinking plenty of water throughout your cycle."
  //   );
  //   tips.push(
  //     "Regular exercise can help alleviate many menstrual symptoms and improve overall well-being."
  //   );
  //   tips.push(
  //     "A balanced diet rich in fruits, vegetables, and whole grains can help support your body during your cycle."
  //   );

  //   return tips;
  // }, [
  //   cycleDuration,
  //   lastPeriodDuration,
  //   moodTypes,
  //   sleepDuration,
  //   sleepQuality,
  //   symptoms,
  // ]);
  const downloadPDF = async () => {
    const report = document.getElementById("report-section");
    if (!report) return;

    const html = report.outerHTML;

    const res = await fetch("/api/export-pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html }),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "analysis-report.pdf";
    a.click();
  };


  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -40, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
      >
        <h1 className={` text-4xl md:text-5xl font-bold pb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent`}>
        <span className="tracking-tighter leading-relaxed">PCOS</span> <span className={`${cookie.className} text-6xl`}>Health Assessment</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
        Track your symptoms and get personalized insights to better understand your health
        </p>
      </motion.div>

      {/* Main Content Card */}
      <motion.div
        className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 overflow-hidden"
        initial={{ opacity: 0, scale: 0.98, filter: "blur(12px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >

        {/* Symptom Categories */}
        <div className="p-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
          Select Your Symptoms
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
          Choose the symptoms you've been experiencing recently
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          initial="hidden"
          animate="visible"
          variants={{
          hidden: {},
          visible: {
            transition: {
            staggerChildren: 0.08,
            },
          },
          }}
        >
          {Object.entries(categorizedSymptoms).map(([category, symptomsList], idx) => {
          const IconComponent = categoryIcons[category];
          const isExpanded = expandedCategories[category] !== false; // Default to expanded

          return (
            <motion.div
            key={category}
            className="group bg-white/80 dark:bg-gray-700/50 rounded-2xl border border-gray-200/50 dark:border-gray-600/30 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.2 + idx * 0.08, ease: "easeOut" }}
            >
            {/* Category Header */}
            <div
              className="p-6 cursor-pointer"
              onClick={() => toggleCategory(category)}
            >
              <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${categoryColors[category]} flex items-center justify-center shadow-lg`}
                whileHover={{ scale: 1.08, filter: "blur(1.5px)" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                <IconComponent className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {category}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {symptomsList.filter(s => symptoms.includes(s)).length} selected
                </p>
                </div>
              </div>
              <motion.div
                initial={false}
                animate={{ rotate: isExpanded ? 0 : 180 }}
                transition={{ duration: 0.3 }}
              >
                {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </motion.div>
              </div>
            </div>

            {/* Category Content */}
            <AnimatePresence>
              {isExpanded && (
              <motion.div
                className="px-6 pb-6 space-y-3"
                initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {symptomsList.map((symptom) => {
                const isSelected = symptoms.includes(symptom);
                return (
                  <motion.div
                  key={symptom}
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                  {/* Symptom Checkbox */}
                  <label className="flex items-center group/item cursor-pointer">
                    <div className="relative">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSymptomChange(symptom)}
                      className="sr-only"
                    />
                    <motion.div
                      className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 ${isSelected
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-transparent'
                      : 'border-gray-300 dark:border-gray-600 group-hover/item:border-pink-400'
                      }`}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isSelected && (
                      <CheckCircle2 className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
                      )}
                    </motion.div>
                    </div>
                    <span className={`ml-3 text-sm transition-colors ${isSelected
                    ? 'text-gray-800 dark:text-white font-medium'
                    : 'text-gray-600 dark:text-gray-300'
                    }`}>
                    {symptom}
                    </span>
                  </label>

                  {/* Severity and Date Selection - only show if symptom is selected */}
                  <AnimatePresence>
                    {isSelected && (
                    <motion.div
                      className="ml-8 space-y-3"
                      initial={{ opacity: 0, x: -16, filter: "blur(6px)" }}
                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, x: -16, filter: "blur(6px)" }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Severity */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Severity
                        </label>
                        <select
                        value={symptomSeverities[symptom] || ""}
                        onChange={(e) => handleSymptomSeverityChange(symptom, e.target.value)}
                        className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-400 focus:border-transparent text-gray-800 dark:text-white transition-all"
                        >
                        <option value="">Select</option>
                        {symptomSeverityOptions.map((severity) => (
                          <option key={severity} value={severity}>
                          {severity}
                          </option>
                        ))}
                        </select>
                      </div>

                      {/* Date */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        When noticed
                        </label>
                        <div className="relative">
                        <input
                          type="date"
                          value={symptomDates[symptom] || ""}
                          onChange={(e) => handleSymptomDateChange(symptom, e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 dark:focus:ring-pink-400 focus:border-transparent text-gray-800 dark:text-white transition-all"
                        />
                        </div>
                      </div>
                      </div>
                    </motion.div>
                    )}
                  </AnimatePresence>
                  </motion.div>
                );
                })}
              </motion.div>
              )}
            </AnimatePresence>
            </motion.div>
          );
          })}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-600"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.5, ease: "easeOut" }}
        >
          <div className="text-sm text-gray-600 dark:text-gray-400">
          {symptoms.length > 0 ? (
            <span className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-green-500 mr-1" />
            {symptoms.length} symptom{symptoms.length !== 1 ? 's' : ''} selected
            </span>
          ) : (
            "No symptoms selected"
          )}
          </div>

          <motion.button
          onClick={handleSubmit}
          disabled={isLoading || symptoms.length === 0}
          className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 transform ${isLoading || symptoms.length === 0
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
            }`}
          whileTap={{ scale: 0.97 }}
          whileHover={!isLoading && symptoms.length > 0 ? { scale: 1.04, filter: "blur(1px)" } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
          {isLoading ? (
            <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Analyzing...
            </div>
          ) : (
            <div className="flex items-center">
            <Zap className="w-4 h-4 mr-2" />
            Generate Analysis
            </div>
          )}
          </motion.button>
        </motion.div>
        </div>

        {/* Results Section */}
        {isLoading ? (
        <motion.div
          className="text-center py-4"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-2 text-pink-600">Analyzing symptoms...</p>
        </motion.div>
        ) : error ? (
        <motion.div
          className="text-red-500 p-4 rounded bg-red-50 dark:bg-red-900/20"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {error}
        </motion.div>
        ) : (
        <motion.div
          className="p-8"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        >
          <motion.div
          ref={reportRef}
          id="report-section"
          className="mt-8"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
          {showCharts && (
            <motion.div
            className="flex flex-col justify-center items-start md:flex-row gap-6"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            >
            <SymptomChart
              symptoms={chartData.symptoms.map((s) => s.name)}
              severities={Object.fromEntries(
              chartData.symptoms.map((s) => [s.name, s.severity])
              )}
            />
            <AnalysisSummaryChart pcosReport={pcosReport} />
            </motion.div>
          )}

          {showHealthTips && pcosReport && (
            <motion.div
            className="my-8 p-6 mx-12 bg-gray-50 rounded-4xl"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
            >
            <h3 className="text-3xl text-center font-semibold mb-4">
              AI Analysis Report
            </h3>
            <div className="prose dark:prose-invert max-w-none">
              {pcosReport
              .split(/(## .+)/)
              .filter(Boolean)
              .map((section, index) => (
                <div key={index} className="mb-4">
                {section.startsWith("## ") ? (
                  <h2 className="text-xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                  {section.replace("## ", "")}
                  </h2>
                ) : (
                  <div className="text-gray-700 dark:text-gray-300">
                  <ReactMarkdown>{section}</ReactMarkdown>
                  </div>
                )}
                </div>
              ))}
            </div>
            </motion.div>
          )}
          </motion.div>
          <motion.button
          className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 transform ${isLoading || symptoms.length === 0
            ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
            }`}
          onClick={downloadPDF}
          whileTap={{ scale: 0.97 }}
          whileHover={!isLoading && symptoms.length > 0 ? { scale: 1.04, filter: "blur(1px)" } : {}}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
          Download PDF
          </motion.button>
        </motion.div>
        )}

        {/* Error State */}
        {error && (
        <motion.div
          className="p-6 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 mx-8 mb-6 rounded-r-xl"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
          </div>
        </motion.div>
        )}
      </motion.div>

      {/* Footer Note */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, delay: 0.7, ease: "easeOut" }}
      >
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        This assessment is for informational purposes only and should not replace professional medical advice.
        Please consult with a healthcare provider for proper diagnosis and treatment.
        </p>
      </motion.div>
      </div>
    </motion.div>
  );
}

