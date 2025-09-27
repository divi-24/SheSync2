/* eslint-disable */

"use client";
import React, { useState, useEffect } from "react";
import {
    isSameDay,
    addDays,
    format,
} from "date-fns";
import {
    Calendar,
    Baby,
    TrendingUp,
    Info,
} from "lucide-react";
import Calculator from "@/components/ovulationCalc/Calculator";
import CalendarCompo from "@/components/ovulationCalc/Calendar";
import Fertility from "@/components/ovulationCalc/Fertility";
import Pregnancy from "@/components/ovulationCalc/Pregnancy";
import Cycle from "@/components/ovulationCalc/Cycle";
import { getCycles, CycleData } from "@/lib/cycles";
import { Cookie } from "next/font/google";
import { AnimatePresence, motion } from "framer-motion";

const cookie = Cookie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-cookie'
});

const OvulationCalculator = () => {
    const [startDate, setStartDate] = useState("");
    const [isPregnant, setIsPregnant] = useState(false);
    type Results = {
        ovulationDate: string;
        fertileWindow: string;
        nextPeriod: string;
        menstrualEnd: string;
        pregnancyTestDate: string;
        fertilityWindow: {
            date: Date;
            probability: number;
            phase: string;
        }[];
    } | null;

    const [results, setResults] = useState<Results>(null);
    const [darkMode, setDarkMode] = useState(false);
    const [currentView, setCurrentView] = useState("calculator"); // 'calculator', 'calendar', 'pregnancy', 'tracker'
    const [cycles, setCycles] = useState<CycleData[]>([]);
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(
        new Date()
    );


    type GestationInfo = {
        gestationalAge: string;
        dueDate: string;
        currentTrimester: number;
        firstTrimester: string;
        secondTrimester: string;
        thirdTrimester: string;
        milestones: { week: number; milestone: string; date: Date }[];
        daysUntilDue: number;
        babySize?: string;
        babyWeight?: string;
        weeklyTips?: string[];
        conceptionDate?: string;
    } | null;

    const [gestationInfo, setGestationInfo] = useState<GestationInfo>(null);

    // central refreshCycles used by children to keep cycles in sync across components
    const refreshCycles = async () => {
        try {
            const data = await getCycles();
            console.log("success loading cycles", data);
            setCycles(data);
            // set page startDate from first cycle so child components (Calculator/Fertility) can use it
            try {
                if (data && data.length > 0) {
                    const firstStart = new Date(data[0].startDate);
                    setStartDate(format(firstStart, "yyyy-MM-dd"));
                }
            } catch (err) {
                console.warn('Failed to set startDate from cycles', err);
            }
            // If we have at least one cycle, derive results (ovulation, fertile window, next period, etc.)
            if (data && data.length > 0) {
                const c = data[0];
                try {
                    const start = new Date(c.startDate);
                    const ov = new Date(c.ovulationDate);
                    const fertileStart = new Date(c.fertileStart);
                    const fertileEnd = new Date(c.fertileEnd);
                    const next = new Date(c.nextPeriod);
                    const menstrualEnd = new Date(c.menstrualEnd);
                    const pregnancyTestDate = addDays(ov, 14);
                    console.log("start", start);

                    // build fertilityWindow days (similar heuristic used in Calculator)
                    const fertilityWindow = [] as { date: Date; probability: number; phase: string }[];
                    for (let i = -6; i <= 2; i++) {
                        const day = addDays(ov, i);
                        let probability = 0;
                        if (i === 0) probability = 30;
                        else if (i === -1) probability = 25;
                        else if (i >= -3 && i <= 1) probability = 20;
                        else if (i >= -5 && i <= -4) probability = 10;
                        else probability = 5;

                        fertilityWindow.push({ date: day, probability, phase: i === 0 ? 'ovulation' : (i >= -4 && i <= 1 ? 'fertile' : 'low') });
                    }

                    const newResults = {
                        ovulationDate: format(ov, "EEE MMM dd yyyy"),
                        fertileWindow: `${format(fertileStart, "EEE MMM dd yyyy")} - ${format(fertileEnd, "EEE MMM dd yyyy")}`,
                        nextPeriod: format(next, "EEE MMM dd yyyy"),
                        menstrualEnd: format(menstrualEnd, "EEE MMM dd yyyy"),
                        pregnancyTestDate: format(pregnancyTestDate, "EEE MMM dd yyyy"),
                        fertilityWindow,
                    };
                    setResults(newResults);
                    console.log("Fertility results calculated:", newResults);
                } catch (err) {
                    console.warn('Failed to build results from first cycle', err);
                }
            } else {
                setResults(null);
            }
        } catch (err) {
            console.error("Failed to load cycles:", err);
        }
    };

    // load cycles on mount
    useEffect(() => { refreshCycles(); }, []);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [darkMode]);




    // type DayType = "period" | "ovulation" | "fertile" | "next-period" | "dueDate" | "milestone" | "pregnancyDay" | "normal";

    // const getDayType = (date: Date): DayType => {
    //     if (!results) return "normal";

    //     const currentCycle = cycles[0];
    //     if (!currentCycle) return "normal";

    //     if (isSameDay(date, new Date(startDate))) return "period";
    //     if (date >= new Date(startDate) && date <= new Date(currentCycle.menstrualEnd))
    //         return "period";
    //     if (isSameDay(date, currentCycle.ovulationDate)) return "ovulation";
    //     if (
    //         date >= new Date(currentCycle.fertileStart) &&
    //         date <= new Date(currentCycle.fertileEnd)
    //     )
    //         return "fertile";
    //     if (isSameDay(date, currentCycle.nextPeriod)) return "next-period";

    //     return "normal";
    // };


    const [conceptionDate, setConceptionDate] = useState<Date | null>(null);

    return (
        <div
            className={`flex min-h-screen justify-center items-center mx-auto bg-gradient-to-br from-pink-50 via-white to-pink-100`}
        >
            {/* Main Content */}
            <div
            className={`container max-w-5xl mx-auto px-4 py-8`}
            >
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className={`${cookie.className} text-4xl md:text-6xl font-bold pb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent`}>
                Advanced Ovulation & Pregnancy Calculator
                </h1>
                <p className="text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
                Track your fertility, predict ovulation, monitor
                pregnancy milestones, and gain insights into your
                reproductive health with our comprehensive calculator.
                </p>
            </div>
            {/* Navigation Tabs */}
            <nav className="mb-8 flex justify-center">
                <ul className="flex flex-wrap gap-2 rounded-lg p-2">
                {[
                    { id: "calculator", label: "Calculator", icon: Calendar },
                    { id: "calendar", label: "Calendar View", icon: Calendar },
                    { id: "chart", label: "Fertility Chart", icon: TrendingUp },
                    { id: "pregnancy", label: "Pregnancy Tracker", icon: Baby },
                    { id: "history", label: "Cycle History", icon: Info },
                ]
                    .filter(tab => !(tab.id === "pregnancy" && !isPregnant) && !(tab.id === "chart" && isPregnant))
                    .map((tab) => (
                    <li key={tab.id}>
                        <button
                        onClick={() => setCurrentView(tab.id)}
                        className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 shadow-sm
                            ${currentView === tab.id
                            ? "bg-pink-500 text-white scale-105 shadow-lg"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-pink-100 dark:hover:bg-pink-900"}
                        `}
                        aria-current={currentView === tab.id ? "page" : undefined}
                        >
                        <tab.icon size={18} />
                        <span>{tab.label}</span>
                        </button>
                    </li>
                    ))}
                </ul>
            </nav>

            {/* Animated Views */}
            <div className="relative min-h-screen overflow-y-scroll">
                <AnimatePresence mode="wait">
                {currentView === "calculator" && (
                    <motion.div
                    key="calculator"
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(12px)" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                    >
                    <Calculator
                        results={results}
                        cycles={cycles}
                        setCycles={setCycles}
                        startDate={startDate}
                        setStartDate={setStartDate}
                        isPregnant={isPregnant}
                        setIsPregnant={setIsPregnant}
                        gestationInfo={gestationInfo}
                        setResults={setResults}
                        setGestationInfo={setGestationInfo as any}
                        setConceptionDate={setConceptionDate}
                        conceptionDate={conceptionDate}
                        darkMode={darkMode}
                        refreshCycles={refreshCycles}
                        setCurrentView={setCurrentView}
                    />
                    </motion.div>
                )}

                {currentView === "calendar" && (
                    <motion.div
                    key="calendar"
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(12px)" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                    >
                    <CalendarCompo
                        results={results}
                        currentMonth={currentCalendarMonth}
                        setCurrentMonth={setCurrentCalendarMonth}
                        cycles={cycles}
                        startDate={startDate}
                        isPregnant={isPregnant}
                        gestationInfo={gestationInfo as any}
                        setGestationInfo={setGestationInfo as any}
                        refreshCycles={refreshCycles}
                    />
                    </motion.div>
                )}

                {currentView === "chart" && !isPregnant && (
                    <motion.div
                    key="chart"
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(12px)" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                    >
                    <Fertility
                        results={results}
                        startDate={startDate}
                        isPregnant={isPregnant}
                    />
                    </motion.div>
                )}

                {currentView === "pregnancy" && isPregnant && (
                    <motion.div
                    key="pregnancy"
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(12px)" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                    >
                    <Pregnancy
                        isPregnant={isPregnant}
                        gestationInfo={gestationInfo}
                        setGestationInfo={setGestationInfo}
                        setCurrentView={setCurrentView}
                    />
                    </motion.div>
                )}

                {currentView === "history" && (
                    <motion.div
                    key="history"
                    initial={{ opacity: 0, filter: "blur(12px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(12px)" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0"
                    >
                    <Cycle
                        currentView={currentView}
                        setCurrentView={setCurrentView}
                        cycles={cycles}
                        refreshCycles={refreshCycles}
                    />
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            {/* Footer Disclaimer */}
            <div className="mt-12 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                <strong>Important:</strong> This calculator provides
                estimates based on general patterns and should not
                replace professional medical advice. Consult with your
                healthcare provider for personalized guidance on
                fertility, pregnancy, and reproductive health.
                </p>
            </div>
            </div>
        </div>
    );

};

export default OvulationCalculator;

