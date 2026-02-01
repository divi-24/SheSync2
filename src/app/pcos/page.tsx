/* eslint-disable */

"use client"
import React, { useState, useRef } from "react";
import { Cookie } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowRight,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Upload,
    X,
    Heart,
    TrendingDown,
    Shield,
    Clock,
    ChevronDown,
    Info,
    AlertTriangle,
    Check,
    Eye,
    EyeOff,
} from "lucide-react";

const cookie = Cookie({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-cookie'
});

const ML_API_URL = process.env.NEXT_PUBLIC_ML_API_URL || "http://localhost:5000/api/ml";

// Feature groups for organizing the form
const featureGroups = {
    "Basic Information": [
        { key: "Age (yrs)", label: "Age (years)", type: "number", min: 0, max: 100 },
        { key: "Weight (Kg)", label: "Weight (Kg)", type: "number", min: 0, max: 200 },
        { key: "Height(Cm)", label: "Height (Cm)", type: "number", min: 0, max: 250 },
        { key: "BMI", label: "BMI", type: "number", min: 0, max: 60 },
    ],
    "Blood & Vitals": [
        { key: "Blood Group", label: "Blood Group (1=A, 2=B, 3=AB, 4=O)", type: "number", min: 1, max: 4 },
        { key: "Pulse rate(bpm)", label: "Pulse Rate (bpm)", type: "number", min: 40, max: 120 },
        { key: "RR (breaths/min)", label: "Respiration Rate (breaths/min)", type: "number", min: 12, max: 30 },
        { key: "Hb(g/dl)", label: "Hemoglobin (g/dl)", type: "number", min: 5, max: 20 },
    ],
    "Menstrual & Pregnancy": [
        { key: "Cycle(R/I)", label: "Cycle (0=Regular, 1=Irregular)", type: "number", min: 0, max: 1 },
        { key: "Cycle length(days)", label: "Cycle Length (days)", type: "number", min: 15, max: 90 },
        { key: "Marraige Status (Yrs)", label: "Marriage Status (Years)", type: "number", min: 0, max: 50 },
        { key: "Pregnant(Y/N)", label: "Currently Pregnant (0=No, 1=Yes)", type: "number", min: 0, max: 1 },
        { key: "No. of aborptions", label: "Number of Abortions", type: "number", min: 0, max: 10 },
    ],
    "Hormonal Levels": [
        { key: "I   beta-HCG(mIU/mL)", label: "Beta-HCG I (mIU/mL)", type: "number", min: 0, max: 100000 },
        { key: "II    beta-HCG(mIU/mL)", label: "Beta-HCG II (mIU/mL)", type: "number", min: 0, max: 100000 },
        { key: "FSH(mIU/mL)", label: "FSH (mIU/mL)", type: "number", min: 0, max: 20 },
        { key: "LH(mIU/mL)", label: "LH (mIU/mL)", type: "number", min: 0, max: 100 },
        { key: "FSH/LH", label: "FSH/LH Ratio", type: "number", min: 0, max: 5 },
        { key: "TSH (mIU/L)", label: "TSH (mIU/L)", type: "number", min: 0, max: 10 },
        { key: "AMH(ng/mL)", label: "AMH (ng/mL)", type: "number", min: 0, max: 15 },
        { key: "PRL(ng/mL)", label: "Prolactin (ng/mL)", type: "number", min: 0, max: 100 },
    ],
    "Vitamin & Metabolic": [
        { key: "Vit D3 (ng/mL)", label: "Vitamin D3 (ng/mL)", type: "number", min: 0, max: 100 },
        { key: "PRG(ng/mL)", label: "Progesterone (ng/mL)", type: "number", min: 0, max: 50 },
        { key: "RBS(mg/dl)", label: "RBS (mg/dl)", type: "number", min: 50, max: 400 },
    ],
    "Symptoms": [
        { key: "Weight gain(Y/N)", label: "Weight Gain (0=No, 1=Yes)", type: "number", min: 0, max: 1 },
        { key: "hair growth(Y/N)", label: "Hair Growth (0=No, 1=Yes)", type: "number", min: 0, max: 1 },
        { key: "Skin darkening (Y/N)", label: "Skin Darkening (0=No, 1=Yes)", type: "number", min: 0, max: 1 },
        { key: "Hair loss(Y/N)", label: "Hair Loss (0=No, 1=Yes)", type: "number", min: 0, max: 1 },
        { key: "Pimples(Y/N)", label: "Pimples/Acne (0=No, 1=Yes)", type: "number", min: 0, max: 1 },
    ],
    "Lifestyle": [
        { key: "Fast food (Y/N)", label: "Fast Food Consumption (0=No, 1=Yes)", type: "number", min: 0, max: 1 },
        { key: "Reg.Exercise(Y/N)", label: "Regular Exercise (0=No, 1=Yes)", type: "number", min: 0, max: 1 },
    ],
    "Blood Pressure & Body Composition": [
        { key: "BP _Systolic (mmHg)", label: "BP Systolic (mmHg)", type: "number", min: 80, max: 200 },
        { key: "BP _Diastolic (mmHg)", label: "BP Diastolic (mmHg)", type: "number", min: 40, max: 130 },
        { key: "Hip(inch)", label: "Hip (inches)", type: "number", min: 20, max: 50 },
        { key: "Waist(inch)", label: "Waist (inches)", type: "number", min: 15, max: 50 },
        { key: "Waist:Hip Ratio", label: "Waist:Hip Ratio", type: "number", min: 0.5, max: 2 },
    ],
    "Ultrasound Findings": [
        { key: "Follicle No. (L)", label: "Follicle Count - Left Ovary", type: "number", min: 0, max: 50 },
        { key: "Follicle No. (R)", label: "Follicle Count - Right Ovary", type: "number", min: 0, max: 50 },
        { key: "Avg. F size (L) (mm)", label: "Average Follicle Size - Left (mm)", type: "number", min: 0, max: 30 },
        { key: "Avg. F size (R) (mm)", label: "Average Follicle Size - Right (mm)", type: "number", min: 0, max: 30 },
        { key: "Endometrium (mm)", label: "Endometrium Thickness (mm)", type: "number", min: 0, max: 20 },
    ],
};

const FEATURE_COLUMNS = [
    'Age (yrs)', 'Weight (Kg)', 'Height(Cm)', 'BMI', 'Blood Group',
    'Pulse rate(bpm)', 'RR (breaths/min)', 'Hb(g/dl)', 'Cycle(R/I)',
    'Cycle length(days)', 'Marraige Status (Yrs)', 'Pregnant(Y/N)',
    'No. of aborptions', 'I   beta-HCG(mIU/mL)', 'II    beta-HCG(mIU/mL)',
    'FSH(mIU/mL)', 'LH(mIU/mL)', 'FSH/LH', 'Hip(inch)', 'Waist(inch)',
    'Waist:Hip Ratio', 'TSH (mIU/L)', 'AMH(ng/mL)', 'PRL(ng/mL)',
    'Vit D3 (ng/mL)', 'PRG(ng/mL)', 'RBS(mg/dl)', 'Weight gain(Y/N)',
    'hair growth(Y/N)', 'Skin darkening (Y/N)', 'Hair loss(Y/N)',
    'Pimples(Y/N)', 'Fast food (Y/N)', 'Reg.Exercise(Y/N)',
    'BP _Systolic (mmHg)', 'BP _Diastolic (mmHg)', 'Follicle No. (L)',
    'Follicle No. (R)', 'Avg. F size (L) (mm)', 'Avg. F size (R) (mm)',
    'Endometrium (mm)'
];

export default function PCOSPage() {
    const [assessmentType, setAssessmentType] = useState<"clinical" | "image" | "combined">("clinical");
    const [formData, setFormData] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState<any>(null);
    const [expandedGroup, setExpandedGroup] = useState<string | null>("Basic Information");
    const [uploadedImage, setUploadedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            setError("Please upload a valid image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError("Image size must be less than 5MB");
            return;
        }

        setUploadedImage(file);
        setError("");

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleImageRemove = () => {
        setUploadedImage(null);
        setImagePreview("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateForm = () => {
        const missingFields = FEATURE_COLUMNS.filter(col => !formData[col]);
        if (missingFields.length > 0) {
            setError(`Missing ${missingFields.length} required field(s). Please fill all fields.`);
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (assessmentType === "clinical" || assessmentType === "combined") {
            if (!validateForm()) {
                return;
            }
        }

        if (assessmentType === "image" || assessmentType === "combined") {
            if (!uploadedImage) {
                setError("Please upload an ultrasound image");
                return;
            }
        }

        setIsLoading(true);
        setError("");
        setResult(null);

        try {
            let clinicalResult = null;
            let imageResult = null;

            // Clinical prediction
            if (assessmentType === "clinical" || assessmentType === "combined") {
                const payload: { [key: string]: number } = {};
                FEATURE_COLUMNS.forEach(col => {
                    payload[col] = parseFloat(formData[col]) || 0;
                });

                const response = await fetch(`${ML_API_URL}/predict`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error(`Clinical API error: ${response.statusText}`);
                }

                clinicalResult = await response.json();
            }

            // Image prediction
            if (assessmentType === "image" || assessmentType === "combined") {
                const formDataImg = new FormData();
                formDataImg.append("file", uploadedImage);

                const response = await fetch(`${ML_API_URL}/predict_image`, {
                    method: "POST",
                    credentials: "include",
                    body: formDataImg,
                });

                if (!response.ok) {
                    throw new Error(`Image API error: ${response.statusText}`);
                }

                imageResult = await response.json();
            }

            // Combine results
            const combinedResult = {
                assessmentType,
                clinical: clinicalResult,
                image: imageResult,
                timestamp: new Date().toISOString(),
            };

            setResult(combinedResult);
        } catch (err) {
            console.error("Error:", err);
            setError("Failed to generate prediction. Please check your inputs and try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const filledCount = Object.keys(formData).length;
    const totalFields = FEATURE_COLUMNS.length;

    return (
        <div className={`${cookie.variable} min-h-screen bg-gradient-to-b from-white via-pink-50/30 to-purple-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 py-8 px-4 sm:px-6 lg:px-8`}>
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl"></div>
                <div className="absolute top-40 -left-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl"></div>
            </div>

            <motion.div
                className="max-w-6xl mx-auto relative z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header with intro */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100/80 dark:bg-pink-900/30 rounded-full text-pink-700 dark:text-pink-300 text-sm font-medium mb-6 border border-pink-200/50 dark:border-pink-700/50">
                        <Heart className="w-4 h-4" />
                        Empowering Women's Health
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        PCOS Risk Assessment
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto mb-2">
                        Get personalized insights powered by advanced AI and machine learning
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Analyze clinical data and medical imaging for comprehensive assessment
                    </p>
                </motion.div>

                {/* Feature cards */}
                <motion.div
                    className="grid md:grid-cols-3 gap-4 mb-10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {[
                        { icon: Shield, title: "Accurate", desc: "91% precision AI model" },
                        { icon: Clock, title: "Fast", desc: "Results in seconds" },
                        { icon: TrendingDown, title: "Comprehensive", desc: "37 clinical features" }
                    ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm hover:border-pink-300 dark:hover:border-pink-600 transition-colors">
                            <item.icon className="w-6 h-6 text-pink-500 mb-2" />
                            <p className="font-semibold text-gray-900 dark:text-white text-sm">{item.title}</p>
                            <p className="text-gray-600 dark:text-gray-400 text-xs">{item.desc}</p>
                        </div>
                    ))}
                </motion.div>

                {!result ? (
                    <motion.div
                        className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-10 mb-8"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {/* Assessment Type Selector */}
                        <div className="mb-10">
                            <div className="flex items-center gap-2 mb-4">
                                <Info className="w-5 h-5 text-pink-500" />
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Select Assessment Method
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {[
                                    { id: "clinical", label: "Clinical Data", desc: "Fill 37 clinical parameters", icon: "📋" },
                                    { id: "image", label: "Ultrasound Image", desc: "Upload ultrasound scan", icon: "🖼️" },
                                    { id: "combined", label: "Combined Analysis", desc: "Both clinical & image", icon: "📊" },
                                ].map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => {
                                            setAssessmentType(type.id as any);
                                            setError("");
                                        }}
                                        className={`p-5 rounded-2xl border-2 transition-all group ${assessmentType === type.id
                                            ? "border-pink-500 bg-gradient-to-br from-pink-50 to-pink-100/50 dark:from-pink-900/30 dark:to-pink-800/20 dark:border-pink-400 shadow-lg shadow-pink-500/10"
                                            : "border-gray-200 dark:border-gray-600 hover:border-pink-300 dark:hover:border-pink-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                            }`}
                                    >
                                        <div className="text-3xl mb-3">{type.icon}</div>
                                        <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                            {type.label}
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                                            {type.desc}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* Progress bar - only for clinical */}
                            {(assessmentType === "clinical" || assessmentType === "combined") && (
                                <motion.div
                                    className="mb-10 p-5 bg-gradient-to-r from-pink-50/50 to-purple-50/50 dark:from-pink-900/10 dark:to-purple-900/10 rounded-2xl border border-pink-200/50 dark:border-pink-700/50"
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Form Progress
                                        </span>
                                        <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                                            {Math.round((filledCount / totalFields) * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-3 overflow-hidden">
                                        <motion.div
                                            className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 h-3 rounded-full shadow-lg shadow-pink-500/30"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(filledCount / totalFields) * 100}%` }}
                                            transition={{ duration: 0.5, ease: "easeOut" }}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                                        {filledCount} of {totalFields} fields completed
                                    </p>
                                </motion.div>
                            )}

                            {/* Error message */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-xl flex items-start gap-3 shadow-lg shadow-red-500/10"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-red-700 dark:text-red-200 text-sm font-medium">{error}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Clinical Data Form - only show if clinical or combined */}
                            {(assessmentType === "clinical" || assessmentType === "combined") && (
                                <>
                                    {/* Feature groups */}
                                    <div className="space-y-3 mb-10">
                                        {Object.entries(featureGroups).map(([groupName, features], groupIndex) => (
                                            <motion.div
                                                key={groupName}
                                                className="border border-gray-200/50 dark:border-gray-700/50 rounded-2xl overflow-hidden hover:border-pink-300/50 dark:hover:border-pink-600/50 transition-colors"
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: groupIndex * 0.05 }}
                                            >
                                                {/* Group header */}
                                                <button
                                                    type="button"
                                                    onClick={() => setExpandedGroup(expandedGroup === groupName ? null : groupName)}
                                                    className={`w-full px-6 py-4 flex justify-between items-center transition-all ${expandedGroup === groupName
                                                        ? "bg-gradient-to-r from-pink-500/10 to-purple-500/10 dark:from-pink-900/40 dark:to-purple-900/40 border-b border-pink-200/50 dark:border-pink-700/50"
                                                        : "bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-800/30 dark:to-gray-800/50 hover:from-pink-50/50 hover:to-purple-50/50 dark:hover:from-pink-900/20 dark:hover:to-purple-900/20"
                                                        }`}
                                                >
                                                    <h3 className={`font-semibold transition-colors ${expandedGroup === groupName
                                                        ? "text-gray-900 dark:text-white"
                                                        : "text-gray-700 dark:text-gray-300"
                                                        }`}>
                                                        {groupName}
                                                    </h3>
                                                    <motion.div
                                                        animate={{ rotate: expandedGroup === groupName ? 180 : 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <ChevronDown className={`w-5 h-5 transition-colors ${expandedGroup === groupName
                                                            ? "text-pink-600 dark:text-pink-400"
                                                            : "text-gray-400 dark:text-gray-500"
                                                            }`} />
                                                    </motion.div>
                                                </button>

                                                {/* Group content */}
                                                <AnimatePresence>
                                                    {expandedGroup === groupName && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: "auto" }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <div className="p-6 bg-white/50 dark:bg-gray-800/30 backdrop-blur-sm space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-200/50 dark:border-gray-700/50">
                                                                {features.map((feature, idx) => (
                                                                    <motion.div
                                                                        key={feature.key}
                                                                        initial={{ opacity: 0 }}
                                                                        animate={{ opacity: 1 }}
                                                                        transition={{ delay: idx * 0.05 }}
                                                                    >
                                                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                                                                            {feature.label}
                                                                            <span className="text-gray-400 dark:text-gray-500 text-xs ml-1">({feature.min}-{feature.max})</span>
                                                                        </label>
                                                                        <input
                                                                            type={feature.type}
                                                                            step="0.01"
                                                                            min={feature.min}
                                                                            max={feature.max}
                                                                            value={formData[feature.key] || ""}
                                                                            onChange={(e) => handleInputChange(feature.key, e.target.value)}
                                                                            className={`w-full px-4 py-2.5 text-sm border-2 rounded-xl transition-all focus:outline-none ${formData[feature.key]
                                                                                ? "border-pink-300 dark:border-pink-600 bg-white dark:bg-gray-700 ring-2 ring-pink-200/50 dark:ring-pink-900/30"
                                                                                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-pink-200/50 dark:focus:ring-pink-900/30 focus:border-pink-400 dark:focus:border-pink-500"
                                                                                } text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
                                                                            placeholder="Enter value"
                                                                        />
                                                                    </motion.div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </motion.div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Image Upload Section - only show if image or combined */}
                            {(assessmentType === "image" || assessmentType === "combined") && (
                                <motion.div
                                    className="mb-10 p-8 border-2 border-dashed border-pink-400 dark:border-pink-600 rounded-3xl bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-900/10 hover:border-pink-500 dark:hover:border-pink-500 transition-colors"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                        <div className="p-2 bg-pink-500/20 rounded-lg">
                                            <Upload className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                        </div>
                                        Upload Ultrasound Image
                                    </h3>

                                    {!uploadedImage ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="cursor-pointer group"
                                        >
                                            <div className="text-center py-12 transition-transform group-hover:scale-105">
                                                <div className="mb-4 flex justify-center">
                                                    <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-shadow">
                                                        <Upload className="w-10 h-10 text-pink-500" />
                                                    </div>
                                                </div>
                                                <p className="text-gray-900 dark:text-white font-semibold mb-2">
                                                    Click to upload or drag and drop
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    PNG, JPG, GIF • Maximum 5MB
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <motion.div
                                            className="space-y-5"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                        >
                                            {imagePreview && (
                                                <div className="relative inline-block rounded-2xl overflow-hidden shadow-xl shadow-pink-500/20">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Ultrasound preview"
                                                        className="max-h-80 border-4 border-white dark:border-gray-800 rounded-2xl"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex gap-3 flex-wrap">
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                                                >
                                                    Change Image
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleImageRemove}
                                                    className="px-6 py-3 border-2 border-red-400 dark:border-red-600 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all font-semibold flex items-center gap-2"
                                                >
                                                    <X className="w-4 h-4" />
                                                    Remove
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                </motion.div>
                            )}

                            {/* Submit button */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-4 px-8 rounded-2xl font-bold text-lg text-white transition-all duration-300 flex items-center justify-center gap-3 shadow-xl ${isLoading
                                    ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-75"
                                    : "bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 hover:from-pink-600 hover:via-purple-600 hover:to-pink-700 shadow-lg shadow-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/60"
                                    }`}
                                whileTap={!isLoading ? { scale: 0.97 } : {}}
                                whileHover={!isLoading ? { scale: 1.03 } : {}}
                            >
                                {isLoading ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                    >
                                        <Loader2 className="w-6 h-6" />
                                    </motion.div>
                                ) : (
                                    <CheckCircle2 className="w-6 h-6" />
                                )}
                                <span>
                                    {isLoading
                                        ? "Analyzing Your Data..."
                                        : assessmentType === "clinical"
                                            ? "Generate PCOS Risk Assessment"
                                            : assessmentType === "image"
                                                ? "Analyze Ultrasound Image"
                                                : "Run Combined Analysis"}
                                </span>
                            </motion.button>
                        </form>
                    </motion.div>
                ) : (
                    /* Results section */
                    <motion.div
                        className="bg-white/95 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-10"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header */}
                        <motion.div
                            className="text-center mb-12"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl mb-4 shadow-lg">
                                <CheckCircle2 className="w-8 h-8 text-white" />
                            </div>
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                                Assessment Complete
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300 text-lg">
                                {result.assessmentType === "clinical"
                                    ? "Clinical Data Analysis Results"
                                    : result.assessmentType === "image"
                                        ? "Ultrasound Image Analysis Results"
                                        : "Combined Clinical & Image Analysis Results"}
                            </p>
                        </motion.div>

                        {/* Clinical Results */}
                        {(result.assessmentType === "clinical" || result.assessmentType === "combined") &&
                            result.clinical && (
                                <motion.div
                                    className="mb-8 p-8 bg-gradient-to-br from-blue-50 via-blue-50 to-cyan-50 dark:from-blue-900/20 dark:via-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-200/50 dark:border-blue-700/50 shadow-lg shadow-blue-500/10"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                        <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                        Clinical Data Analysis
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <motion.div
                                            className="p-6 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-blue-200/50 dark:border-blue-700/50"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                                PCOS Prediction
                                            </p>
                                            <div
                                                className={`px-6 py-4 rounded-xl text-white text-center font-bold text-lg shadow-lg flex items-center justify-center gap-3 ${result.clinical.PCOS_Predicted === 1
                                                    ? "bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 shadow-red-500/30"
                                                    : "bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 shadow-green-500/30"
                                                    }`}
                                            >
                                                {result.clinical.PCOS_Predicted === 1 ? (
                                                    <>
                                                        <AlertTriangle className="w-6 h-6" />
                                                        PCOS Likely
                                                    </>
                                                ) : (
                                                    <>
                                                        <Check className="w-6 h-6" />
                                                        PCOS Unlikely
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="p-6 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-blue-200/50 dark:border-blue-700/50"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                                Risk Probability
                                            </p>
                                            <div className="relative">
                                                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 text-center">
                                                    {(result.clinical.Probability_of_PCOS * 100).toFixed(1)}%
                                                </div>
                                                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    Based on clinical features
                                                </p>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                        {/* Image Results */}
                        {(result.assessmentType === "image" || result.assessmentType === "combined") &&
                            result.image && (
                                <motion.div
                                    className="mb-8 p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 rounded-2xl border-2 border-amber-200/50 dark:border-amber-700/50 shadow-lg shadow-amber-500/10"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                        <div className="p-2 bg-orange-500/20 rounded-lg">
                                            <Upload className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        Ultrasound Image Analysis
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <motion.div
                                            className="p-6 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-amber-200/50 dark:border-amber-700/50"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                                Polycystic Detection
                                            </p>
                                            <div
                                                className={`px-6 py-4 rounded-xl text-white text-center font-bold text-lg shadow-lg flex items-center justify-center gap-3 ${result.image.Predicted_Label === "Visible"
                                                    ? "bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 shadow-orange-500/30"
                                                    : "bg-gradient-to-r from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 shadow-green-500/30"
                                                    }`}
                                            >
                                                {result.image.Predicted_Label === "Visible" ? (
                                                    <>
                                                        <Eye className="w-6 h-6" />
                                                        Visible
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="w-6 h-6" />
                                                        Not Visible
                                                    </>
                                                )}
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="p-6 bg-white/70 dark:bg-gray-800/50 rounded-xl border border-amber-200/50 dark:border-amber-700/50"
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                        >
                                            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                                                Detection Confidence
                                            </p>
                                            <div className="relative">
                                                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 text-center">
                                                    {(result.image.Probability_Visible * 100).toFixed(1)}%
                                                </div>
                                                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                    Based on image analysis
                                                </p>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                            )}

                        <motion.div
                            className="p-6 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-2 border-amber-200/50 dark:border-amber-700/50 rounded-2xl mb-8 shadow-lg shadow-amber-500/10"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="font-bold text-lg text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-3">
                                <AlertCircle className="w-6 h-6" />
                                Important Medical Disclaimer
                            </h3>
                            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                                This assessment is <span className="font-semibold">for informational purposes only</span> and <span className="font-semibold">NOT a substitute for professional medical diagnosis</span>.
                                The results should not be used for self-diagnosis or self-treatment. Please consult with a qualified healthcare professional (gynecologist, endocrinologist, or general practitioner)
                                for proper diagnosis, medical advice, and treatment options tailored to your individual health needs.
                            </p>
                        </motion.div>

                        {/* Action buttons */}
                        <motion.div
                            className="flex gap-4 flex-col sm:flex-row mt-10"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            <motion.button
                                onClick={() => {
                                    setFormData({});
                                    setResult(null);
                                    setError("");
                                }}
                                className="flex-1 px-8 py-4 border-2 border-pink-400 dark:border-pink-600 text-pink-600 dark:text-pink-400 font-bold rounded-2xl hover:bg-pink-50 dark:hover:bg-pink-900/30 transition-all shadow-lg hover:shadow-pink-500/20"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Run Another Assessment
                            </motion.button>
                            <motion.button
                                onClick={() => window.print()}
                                className="flex-1 px-8 py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-600 text-white font-bold rounded-2xl hover:from-pink-600 hover:via-purple-600 hover:to-pink-700 transition-all shadow-xl shadow-pink-500/30 hover:shadow-pink-500/50"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                            >
                                Print & Save Results
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}

                {/* Footer note */}
                <motion.div
                    className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <p className="leading-relaxed">
                        <span className="block font-semibold text-gray-700 dark:text-gray-300 mb-1">Powered by AI & Machine Learning</span>
                        PCOS assessment powered by XGBoost ML model (91% accuracy) trained on clinical data.
                        <span className="block mt-2 text-gray-500 dark:text-gray-500">Always consult qualified healthcare professionals for diagnosis and personalized treatment.</span>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}
