/* eslint-disable */

"use client"
import React, { useState } from "react";
import { format, addDays } from "date-fns";
import { Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

interface PeriodTrackingProps {
    onDataChange: (data: PeriodData) => void;
}

export interface PeriodData {
    cycleDuration: string;
    lastPeriodStart: string;
    lastPeriodDuration: string;
    nextPeriodPrediction: string;
}

export default function PeriodTracking({ onDataChange }: PeriodTrackingProps) {
    const [cycleDuration, setCycleDuration] = useState("");
    const [lastPeriodStart, setLastPeriodStart] = useState("");
    const [lastPeriodDuration, setLastPeriodDuration] = useState("");
    const [nextPeriodPrediction, setNextPeriodPrediction] = useState("");
    const [isExpanded, setIsExpanded] = useState(true);

    interface InputChangeEvent extends React.ChangeEvent<HTMLInputElement> { }

    const handleInputChange = (e: InputChangeEvent) => {
        const { name, value } = e.target;
        let newData: Partial<PeriodData> = {};

        switch (name) {
            case "cycleDuration":
                setCycleDuration(value);
                newData = { cycleDuration: value, lastPeriodStart, lastPeriodDuration, nextPeriodPrediction };
                break;
            case "lastPeriodStart":
                setLastPeriodStart(value);
                newData = { cycleDuration, lastPeriodStart: value, lastPeriodDuration, nextPeriodPrediction };
                break;
            case "lastPeriodDuration":
                setLastPeriodDuration(value);
                newData = { cycleDuration, lastPeriodStart, lastPeriodDuration: value, nextPeriodPrediction };
                break;
        }

        onDataChange(newData as PeriodData);
    };

    const predictNextPeriod = () => {
        if (lastPeriodStart && cycleDuration) {
            const nextPeriodDate = addDays(
                new Date(lastPeriodStart),
                parseInt(cycleDuration)
            );
            const prediction = format(nextPeriodDate, "yyyy-MM-dd");
            setNextPeriodPrediction(prediction);

            onDataChange({
                cycleDuration,
                lastPeriodStart,
                lastPeriodDuration,
                nextPeriodPrediction: prediction,
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg shadow-pink-500/5 border border-gray-100 overflow-hidden"
        >
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center px-6 py-5 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-inset"
            >
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl">
                        <Calendar className="w-6 h-6 text-pink-600" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-xl font-bold text-gray-900">Period Tracking</h3>
                        <p className="text-sm text-gray-500">Cycle information and predictions</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                </div>
            </button>

            {/* Content */}
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-6 bg-gradient-to-br from-pink-50/30 to-rose-50/30"
                >
                    <div className="space-y-6 pt-4">
                        {/* Average Cycle Duration */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">
                                Average Cycle Duration (days)
                            </label>
                            <input
                                type="number"
                                name="cycleDuration"
                                value={cycleDuration}
                                onChange={handleInputChange}
                                min="1"
                                max="50"
                                placeholder="e.g., 28"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                            />
                            <p className="text-xs text-gray-500">Normal range: 21-35 days</p>
                        </div>

                        {/* Last Period Start Date */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">
                                Last Period Start Date
                            </label>
                            <input
                                type="date"
                                name="lastPeriodStart"
                                value={lastPeriodStart}
                                onChange={handleInputChange}
                                max={format(new Date(), "yyyy-MM-dd")}
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-900"
                            />
                        </div>

                        {/* Last Period Duration */}
                        <div className="space-y-3">
                            <label className="block text-sm font-semibold text-gray-700">
                                Last Period Duration (days)
                            </label>
                            <input
                                type="number"
                                name="lastPeriodDuration"
                                value={lastPeriodDuration}
                                onChange={handleInputChange}
                                min="1"
                                max="15"
                                placeholder="e.g., 5"
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                            />
                            <p className="text-xs text-gray-500">Normal range: 3-7 days</p>
                        </div>

                        {/* Predict Button */}
                        <motion.button
                            onClick={predictNextPeriod}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={!lastPeriodStart || !cycleDuration}
                            className="w-full py-3 px-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-500/30 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            <Calendar className="w-5 h-5" />
                            Predict Next Period
                        </motion.button>

                        {/* Prediction Result */}
                        {nextPeriodPrediction && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-5 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full">
                                        <Calendar className="w-6 h-6 text-pink-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-1">Next Period Prediction</p>
                                        <p className="text-xl font-bold text-pink-600">
                                            {format(new Date(nextPeriodPrediction), "MMM dd, yyyy")}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {Math.ceil((new Date(nextPeriodPrediction).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days from now
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Period Tips */}
                        <div className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-100 rounded-xl p-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">💡 Period Tracking Tips</h4>
                            <ul className="text-xs text-gray-600 space-y-1">
                                <li>• Track consistently for more accurate predictions</li>
                                <li>• Note any irregularities or unusual symptoms</li>
                                <li>• A normal cycle can vary month to month</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}