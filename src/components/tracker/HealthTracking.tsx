/* eslint-disable */

"use client"
import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import {
    Frown,
    Smile,
    Angry,
    Coffee,
    Zap,
    Moon,
    ChevronDown,
    ChevronUp,
    Activity,
    Brain,
    Clock,
} from "lucide-react";
import { motion } from "framer-motion";

interface HealthTrackingProps {
    onDataChange: (data: HealthData) => void;
    periodData?: {
        cycleDuration: string;
        lastPeriodDuration: string;
    };
}

export interface HealthData {
    moodTypes: string[];
    moodSeverity: string;
    moodDate: string;
    symptoms: string[];
    symptomSeverities: { [symptom: string]: string };
    symptomDate: string;
    sleepDuration: string;
    sleepQuality: string;
}

const moodOptions = [
    { name: "Happy", icon: Smile, color: "text-yellow-500" },
    { name: "Sad", icon: Frown, color: "text-blue-500" },
    { name: "Calm", icon: Coffee, color: "text-green-500" },
    { name: "Angry", icon: Angry, color: "text-red-500" },
    { name: "Tired", icon: Moon, color: "text-purple-500" },
    { name: "Energized", icon: Zap, color: "text-orange-500" },
];

const moodSeverityOptions = [
    { name: "Low", value: "low", color: "bg-green-100 text-green-700 border-green-200" },
    { name: "Medium", value: "medium", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { name: "High", value: "high", color: "bg-red-100 text-red-700 border-red-200" },
];

const symptomOptions = [
    "Lower Abdomen Cramps",
    "Back Pain",
    "Bloating",
    "Fatigue",
    "Headaches",
    "Nausea",
    "Sleep Disruption",
    "Digestive Issues",
];

const symptomSeverityOptions = [
    { name: "None", value: "none", color: "bg-gray-100 text-gray-700 border-gray-200" },
    { name: "Mild", value: "mild", color: "bg-green-100 text-green-700 border-green-200" },
    { name: "Moderate", value: "moderate", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { name: "Severe", value: "severe", color: "bg-red-100 text-red-700 border-red-200" },
];

const sleepQualityOptions = [
    { name: "Poor", value: "poor", color: "bg-red-100 text-red-700 border-red-200" },
    { name: "Fair", value: "fair", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    { name: "Good", value: "good", color: "bg-green-100 text-green-700 border-green-200" },
    { name: "Excellent", value: "excellent", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

export default function HealthTracking({ onDataChange, periodData }: HealthTrackingProps) {
    const [moodTypes, setMoodTypes] = useState<string[]>([]);
    const [moodSeverity, setMoodSeverity] = useState("");
    const [moodDate, setMoodDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [symptomSeverities, setSymptomSeverities] = useState<{ [symptom: string]: string }>({});
    const [symptomDate, setSymptomDate] = useState(format(new Date(), "yyyy-MM-dd"));
    const [sleepDuration, setSleepDuration] = useState("");
    const [sleepQuality, setSleepQuality] = useState("");
    const [expandedSections, setExpandedSections] = useState({
        moodTracking: true,
        symptomTracking: true,
        sleepTracking: true,
        healthTips: true,
    });
    // const [showHealthTips, setShowHealthTips] = useState(false);

    // Update parent component whenever data changes
    const updateParentData = () => {
        onDataChange({
            moodTypes,
            moodSeverity,
            moodDate,
            symptoms,
            symptomSeverities,
            symptomDate,
            sleepDuration,
            sleepQuality,
        });
    };

    React.useEffect(() => {
        updateParentData();
    }, [moodTypes, moodSeverity, moodDate, symptoms, symptomSeverities, symptomDate, sleepDuration, sleepQuality]);

    interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement | HTMLSelectElement> { }

    const handleInputChange = (e: InputChangeEvent) => {
        const { name, value } = e.target;
        switch (name) {
            case "moodDate":
                setMoodDate(value);
                break;
            case "symptomDate":
                setSymptomDate(value);
                break;
            case "sleepDuration":
                setSleepDuration(value);
                break;
            case "sleepQuality":
                setSleepQuality(value);
                break;
        }
    };

    const handleMoodTypeChange = (moodName: string) => {
        setMoodTypes((prev: string[]) =>
            prev.includes(moodName)
                ? prev.filter((mood) => mood !== moodName)
                : [...prev, moodName]
        );
    };

    const handleSymptomChange = (symptom: string) => {
        setSymptoms((prev: string[]) =>
            prev.includes(symptom)
                ? prev.filter((s) => s !== symptom)
                : [...prev, symptom]
        );
    };

    const handleSymptomSeverityChange = (symptom: string, severity: string) => {
        setSymptomSeverities((prev) => ({
            ...prev,
            [symptom]: severity,
        }));
    };

    type SectionName = keyof typeof expandedSections;

    const toggleSection = (section: SectionName) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const generateHealthTips = useMemo(() => {
        const tips = [];

        if (periodData?.cycleDuration) {
            const cycleDurationInt = parseInt(periodData.cycleDuration);
            if (cycleDurationInt < 21) {
                tips.push(
                    "Your cycle is shorter than average. Consider consulting with a healthcare professional to ensure everything is normal."
                );
            } else if (cycleDurationInt > 35) {
                tips.push(
                    "Your cycle is longer than average. This can be normal, but you may want to discuss it with your doctor."
                );
            } else {
                tips.push(
                    "Your cycle length is within the normal range. Keep tracking to notice any changes."
                );
            }
        }

        if (periodData?.lastPeriodDuration) {
            const periodDuration = parseInt(periodData.lastPeriodDuration);
            if (periodDuration > 7) {
                tips.push(
                    "Your period duration is longer than average. If this is consistent, consider discussing it with your healthcare provider."
                );
            } else if (periodDuration < 3) {
                tips.push(
                    "Your period duration is shorter than average. This can be normal, but tracking consistently will help identify any patterns."
                );
            } else {
                tips.push(
                    "Your period duration is within the normal range. Continue tracking to maintain awareness of your cycle."
                );
            }
        }

        if (symptoms.includes("Lower Abdomen Cramps")) {
            const severity = symptomSeverities["Lower Abdomen Cramps"] || "Not specified";
            if (severity === "severe") {
                tips.push(
                    "For severe cramps, consider over-the-counter pain relievers, a heating pad, and gentle exercise. If pain is debilitating, consult your doctor."
                );
            } else {
                tips.push(
                    "For menstrual cramps, try using a heating pad, gentle yoga, or over-the-counter pain relievers if needed."
                );
            }
        }

        if (symptoms.includes("Fatigue")) {
            tips.push(
                "Combat period fatigue by ensuring adequate iron intake, staying hydrated, and getting enough rest. Consider iron-rich foods like spinach, beans, and lean meats."
            );
        }

        if (symptoms.includes("Bloating")) {
            tips.push(
                "To reduce bloating, try limiting salt intake, avoiding carbonated drinks, and eating smaller, more frequent meals. Gentle exercise can also help."
            );
        }

        if (sleepQuality === "poor" || sleepQuality === "fair") {
            tips.push(
                "Improve sleep quality by maintaining a regular sleep schedule, creating a comfortable sleep environment, and avoiding caffeine and screens before bedtime."
            );
        }

        if (moodTypes.includes("Sad") || moodTypes.includes("Angry")) {
            tips.push(
                "Mood changes during your cycle are normal. Regular exercise, mindfulness practices, and adequate sleep can help manage mood fluctuations."
            );
        }

        if (tips.length === 0) {
            tips.push(
                "Keep tracking your health data regularly to receive personalized insights."
            );
        }

        return tips;
    }, [
        periodData?.cycleDuration,
        periodData?.lastPeriodDuration,
        symptoms,
        symptomSeverities,
        sleepQuality,
        moodTypes,
    ]);

    const renderSection = (
        title: string,
        content: React.ReactNode,
        section: SectionName,
        icon: React.ReactNode
    ) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg shadow-purple-500/5 border border-gray-100 mb-6 overflow-hidden"
        >
            <button
                onClick={() => toggleSection(section)}
                className="w-full flex justify-between items-center px-6 py-5 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
            >
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                        {icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                </div>
                <div className="flex items-center gap-2">
                    {expandedSections[section] ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                </div>
            </button>

            {expandedSections[section] && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 bg-gradient-to-br from-purple-50/30 to-indigo-50/30"
                >
                    {content}
                </motion.div>
            )}
        </motion.div>
    );

    const moodTrackingContent = (
        <div className="space-y-6 pt-4">
            {/* Mood Date */}
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                    Date
                </label>
                <input
                    type="date"
                    name="moodDate"
                    value={moodDate}
                    onChange={handleInputChange}
                    max={format(new Date(), "yyyy-MM-dd")}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900"
                />
            </div>

            {/* Mood Types */}
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                    How are you feeling? (select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {moodOptions.map((mood) => {
                        const MoodIcon = mood.icon;
                        const isSelected = moodTypes.includes(mood.name);
                        return (
                            <button
                                key={mood.name}
                                type="button"
                                onClick={() => handleMoodTypeChange(mood.name)}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 text-sm font-medium ${isSelected
                                    ? "bg-purple-50 text-purple-700 border-purple-200 shadow-md"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                                    }`}
                            >
                                <MoodIcon className={`w-5 h-5 ${isSelected ? mood.color : "text-gray-400"}`} />
                                <span>{mood.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Mood Intensity */}
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                    Mood Intensity
                </label>
                <div className="flex gap-3">
                    {moodSeverityOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setMoodSeverity(option.value)}
                            className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${moodSeverity === option.value
                                ? `${option.color} border-current shadow-md`
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {option.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const symptomTrackingContent = (
        <div className="space-y-6 pt-4">
            {/* Symptom Date */}
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                    Date
                </label>
                <input
                    type="date"
                    name="symptomDate"
                    value={symptomDate}
                    onChange={handleInputChange}
                    max={format(new Date(), "yyyy-MM-dd")}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900"
                />
            </div>

            {/* Symptoms */}
            <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                    Symptoms you're experiencing
                </label>
                <div className="space-y-3">
                    {symptomOptions.map((symptom) => {
                        const isSelected = symptoms.includes(symptom);
                        return (
                            <div key={symptom} className="bg-white border border-gray-200 rounded-xl p-4">
                                <div className="flex items-center gap-3 mb-3">
                                    <input
                                        type="checkbox"
                                        id={`symptom-${symptom}`}
                                        checked={isSelected}
                                        onChange={() => handleSymptomChange(symptom)}
                                        className="h-5 w-5 text-purple-500 focus:ring-purple-400 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor={`symptom-${symptom}`}
                                        className="text-sm font-medium text-gray-700 cursor-pointer"
                                    >
                                        {symptom}
                                    </label>
                                </div>

                                {/* Severity Selector */}
                                {isSelected && (
                                    <div className="ml-8 space-y-2">
                                        <label className="block text-xs font-medium text-gray-500">
                                            Severity Level
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {symptomSeverityOptions.map((severity) => (
                                                <button
                                                    key={`${symptom}-${severity.value}`}
                                                    type="button"
                                                    onClick={() => handleSymptomSeverityChange(symptom, severity.value)}
                                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 border ${symptomSeverities[symptom] === severity.value
                                                        ? `${severity.color} border-current shadow-sm`
                                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {severity.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    const sleepTrackingContent = (
        <div className="space-y-6 pt-4">
            {/* Sleep Duration */}
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                    Sleep Duration (hours)
                </label>
                <input
                    type="number"
                    name="sleepDuration"
                    value={sleepDuration}
                    onChange={handleInputChange}
                    min="0"
                    max="24"
                    step="0.5"
                    placeholder="e.g., 8"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                />
                <p className="text-xs text-gray-500">Recommended: 7-9 hours per night</p>
            </div>

            {/* Sleep Quality */}
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                    Sleep Quality
                </label>
                <div className="grid grid-cols-2 gap-3">
                    {sleepQualityOptions.map((quality) => (
                        <button
                            key={quality.value}
                            type="button"
                            onClick={() => setSleepQuality(quality.value)}
                            className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border-2 ${sleepQuality === quality.value
                                ? `${quality.color} border-current shadow-md`
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {quality.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    // const healthTipsContent = (
    //     <div className="space-y-4 pt-4">
    //         <div className="space-y-4">
    //             {generateHealthTips.map((tip, index) => (
    //                 <motion.div
    //                     key={index}
    //                     initial={{ opacity: 0, x: -20 }}
    //                     animate={{ opacity: 1, x: 0 }}
    //                     transition={{ delay: index * 0.1 }}
    //                     className="flex items-start gap-3 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl"
    //                 >
    //                     <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-full flex-shrink-0 mt-0.5">
    //                         <HeartPulse className="w-4 h-4 text-purple-600" />
    //                     </div>
    //                     <p className="text-sm text-gray-700 leading-relaxed">{tip}</p>
    //                 </motion.div>
    //             ))}
    //         </div>
    //     </div>
    // );

    return (
        <div className="space-y-6">
            {renderSection("Mood Tracking", moodTrackingContent, "moodTracking", <Brain className="w-5 h-5 text-purple-500" />)}
            {renderSection("Symptom Tracking", symptomTrackingContent, "symptomTracking", <Activity className="w-5 h-5 text-rose-500" />)}
            {renderSection("Sleep Tracking", sleepTrackingContent, "sleepTracking", <Clock className="w-5 h-5 text-indigo-500" />)}
        </div>
    );
}