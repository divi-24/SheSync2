/* eslint-disable */

"use client";
import React, { useState } from "react";
import { CycleData, createCycle } from "@/lib/cycles";
import { upsertSymptom } from "@/lib/symptoms";
import { createPregnancy, deletePregnancy, Pregnancy } from "@/lib/pregnancy";
import {
    addDays,
    format,
} from "date-fns";
import {

    Calendar,
    Heart,

    Info,
    Plus,
    Minus,
    Trash2,
} from "lucide-react";

type CalculatorProps = {
    results: Results | null;
    setResults: React.Dispatch<React.SetStateAction<Results | null>>;
    setCycles: React.Dispatch<React.SetStateAction<CycleData[]>>;
    cycles: CycleData[];
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    isPregnant: boolean;
    setIsPregnant: React.Dispatch<React.SetStateAction<boolean>>;
    gestationInfo: GestationInfo | null;
    setGestationInfo: React.Dispatch<React.SetStateAction<GestationInfo | null>>;
    setConceptionDate: React.Dispatch<React.SetStateAction<Date | null>>;
    conceptionDate: Date | null;
    darkMode: boolean;
    refreshCycles?: () => Promise<void>;
    setCurrentView?: React.Dispatch<React.SetStateAction<string>>;
};

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
};

type GestationInfo = {
    gestationalAge: string;
    dueDate: string;
    currentTrimester: number;
    firstTrimester: string;
    secondTrimester: string;
    thirdTrimester: string;
    milestones?: { week: number; milestone: string; date: Date | string }[];
    daysUntilDue: number;
    babySize?: string;
    babyWeight?: string;
    weeklyTips?: string[];
    conceptionDate?: string;
    active?: boolean;
} | null;

const Calculator: React.FC<CalculatorProps> = ({
    results,
    setResults,
    cycles,
    setCycles,
    startDate,
    setStartDate,
    isPregnant,
    setIsPregnant,
    gestationInfo,
    setGestationInfo,
    setConceptionDate,
    conceptionDate,
    darkMode,
    refreshCycles,
    setCurrentView,
}) => {

    const [symptoms, setSymptoms] = useState({
        cramps: false,
        headaches: false,
        moodSwings: false,
        bloating: false,
        breastTenderness: false,
    });

    const [cycleLength, setCycleLength] = useState(28);
    const [lutealPhaseLength, setLutealPhaseLength] = useState(14);
    const [menstrualDuration, setMenstrualDuration] = useState(5);
    const [successMsg, setSuccessMsg] = useState<string>("");
    const [showCycleModal, setShowCycleModal] = useState(false);
    const [showPregnancyModal, setShowPregnancyModal] = useState(false);
    const calculatePregnancyInfo = async (conceptionDate: Date) => {
        if (!conceptionDate) return;
        const today = new Date();
        const conception = new Date(conceptionDate);
        const lmpDate = addDays(conception, -14);
        const gestationalAgeInDays = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
        const gestationalWeeks = Math.floor(gestationalAgeInDays / 7);
        const gestationalDays = gestationalAgeInDays % 7;
        const dueDate = addDays(lmpDate, 280);
        const firstTrimesterEnd = addDays(lmpDate, 13 * 7);
        const secondTrimesterStart = addDays(lmpDate, 13 * 7 + 1);
        const secondTrimesterEnd = addDays(lmpDate, 27 * 7);
        const thirdTrimesterStart = addDays(lmpDate, 27 * 7 + 1);
        let currentTrimester = 1;
        if (gestationalAgeInDays > 13 * 7) currentTrimester = 2;
        if (gestationalAgeInDays > 27 * 7) currentTrimester = 3;
        const milestones: { [key: string]: { week: number; milestone: string; date: Date }[] } = {
            "1": [
                { week: 4, milestone: "Heart begins to beat", date: addDays(lmpDate, 4 * 7) },
                { week: 6, milestone: "Neural tube closes", date: addDays(lmpDate, 6 * 7) },
                { week: 8, milestone: "All organs present", date: addDays(lmpDate, 8 * 7) },
                { week: 12, milestone: "End of first trimester", date: addDays(lmpDate, 12 * 7) },
            ],
            "2": [
                { week: 16, milestone: "Gender may be visible", date: addDays(lmpDate, 16 * 7) },
                { week: 20, milestone: "Anatomy scan", date: addDays(lmpDate, 20 * 7) },
                { week: 24, milestone: "Viability milestone", date: addDays(lmpDate, 24 * 7) },
                { week: 27, milestone: "End of second trimester", date: addDays(lmpDate, 27 * 7) },
            ],
            "3": [
                { week: 32, milestone: "Rapid brain development", date: addDays(lmpDate, 32 * 7) },
                { week: 36, milestone: "Considered full-term soon", date: addDays(lmpDate, 36 * 7) },
                { week: 40, milestone: "Due date", date: addDays(lmpDate, 40 * 7) },
            ],
        };

        const pregnancyPayload = {
            gestationalAge: `${gestationalWeeks} weeks and ${gestationalDays} days`,
            dueDate: format(dueDate, "EEE MMM dd yyyy"),
            currentTrimester,
            firstTrimester: `${format(lmpDate, "MMM dd")} – ${format(firstTrimesterEnd, "MMM dd yyyy")}`,
            secondTrimester: `${format(secondTrimesterStart, "MMM dd")} – ${format(secondTrimesterEnd, "MMM dd yyyy")}`,
            thirdTrimester: `${format(thirdTrimesterStart, "MMM dd yyyy")} – ${format(dueDate, "MMM dd yyyy")}`,
            milestones: milestones[String(currentTrimester)].map(m => ({ week: m.week, milestone: m.milestone, date: m.date.toISOString() })),
            daysUntilDue: Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))),
            conceptionDate: conceptionDate.toISOString(),
            active: true,
        };

        try {
            const created = await createPregnancy(pregnancyPayload as Partial<Pregnancy>);
            setGestationInfo(created as GestationInfo);
            console.log("success creating pregnancy", created);
            setSuccessMsg("Pregnancy data calculated and saved! Please visit the Pregnancy tab to view your progress and milestones.");
            setTimeout(() => setSuccessMsg(""), 6000);
            // call parent refresh if available
            try {
                if (typeof refreshCycles === "function") await refreshCycles();
            } catch (e) {
                console.error("Error refreshing cycles:", e);
                // ignore refresh errors
            }
        } catch (err: unknown) {
            // fallback to local state so UI still shows info
            setGestationInfo(pregnancyPayload as GestationInfo);
            const msg = (err as any)?.message || "Pregnancy calculated but failed to save.";
            setSuccessMsg(msg);
            setTimeout(() => setSuccessMsg(""), 6000);
        }
    };

    const calculateOvulation = async () => {
        if (!startDate || isNaN(new Date(startDate).getTime())) {
            alert("Please select a valid start date.");
            return;
        }

        const today = new Date();
        const start = new Date(startDate);
        const fiveYearsAgo = addDays(today, -365 * 5);

        if (start > today || start < fiveYearsAgo) {
            alert(
                "Start date must be within the past 5 years and not in the future."
            );
            return;
        }

        if (isNaN(cycleLength) || cycleLength < 20 || cycleLength > 40) {
            alert("Cycle length must be between 20 and 40 days.");
            return;
        }

        // If pregnant, require conception date for pregnancy info
        if (isPregnant) {
            if (!conceptionDate) {
                setSuccessMsg("Please enter your conception date to view pregnancy progress.");
                setTimeout(() => setSuccessMsg(""), 6000);
                return;
            }
            calculatePregnancyInfo(conceptionDate);
            return;
        }

        const ovulationDate = addDays(start, cycleLength - lutealPhaseLength);
        const fertileStart = addDays(ovulationDate, -4);
        const fertileEnd = addDays(ovulationDate, 1);
        const nextPeriod = addDays(start, cycleLength);
        const menstrualEnd = addDays(start, menstrualDuration - 1);
        const pregnancyTestDate = addDays(ovulationDate, 14);

        // Calculate conception probability for each day
        const fertilityWindow = [];
        for (let i = -6; i <= 2; i++) {
            const day = addDays(ovulationDate, i);
            let probability = 0;
            if (i === 0) probability = 30; // Ovulation day
            else if (i === -1) probability = 25; // Day before ovulation
            else if (i >= -3 && i <= 1) probability = 20; // High fertility
            else if (i >= -5 && i <= -4) probability = 10; // Medium fertility
            else probability = 5; // Low fertility

            fertilityWindow.push({
                date: day,
                probability,
                phase:
                    i === 0
                        ? "ovulation"
                        : i >= -4 && i <= 1
                            ? "fertile"
                            : "low",
            });
        }

        const newCyclePayload: Partial<CycleData> = {
            startDate: start.toISOString(),
            cycleLength,
            lutealPhaseLength,
            menstrualDuration,
            ovulationDate: ovulationDate.toISOString(),
            fertileStart: fertileStart.toISOString(),
            fertileEnd: fertileEnd.toISOString(),
            nextPeriod: nextPeriod.toISOString(),
            menstrualEnd: menstrualEnd.toISOString(),
            symptoms: { ...symptoms },
        };

        // optimistic UI update
        const optimistic: CycleData = Object.assign({ _id: Date.now().toString() }, newCyclePayload as CycleData);
        setCycles((prev) => [optimistic, ...prev.slice(0, 4)]); // Keep last 5 cycles

        setResults({
            ovulationDate: format(ovulationDate, "EEE MMM dd yyyy"),
            fertileWindow: `${format(fertileStart, "EEE MMM dd yyyy")} - ${format(fertileEnd, "EEE MMM dd yyyy")}`,
            nextPeriod: format(nextPeriod, "EEE MMM dd yyyy"),
            menstrualEnd: format(menstrualEnd, "EEE MMM dd yyyy"),
            pregnancyTestDate: format(pregnancyTestDate, "EEE MMM dd yyyy"),
            fertilityWindow,
        });
        setSuccessMsg("Fertility and ovulation data calculated! Saving to your profile...");
        setTimeout(() => setSuccessMsg(""), 3000);

        // persist cycle and symptoms
        try {
            const created = await createCycle(newCyclePayload as Partial<CycleData>);
            // replace optimistic with server record
            setCycles((prev) => [created, ...prev.filter((c) => c._id !== optimistic._id).slice(0, 4)]);
            console.log("success creating cycle", created);
            // call parent refresh if available
            try {
                if (typeof refreshCycles === "function") await refreshCycles();
            } catch (e) {
                console.error("Error refreshing cycles:", e);
                // ignore
            }
        } catch (err: unknown) {
            const msg = (err as any)?.message || "Failed to save cycle.";
            setSuccessMsg(msg);
            setTimeout(() => setSuccessMsg(""), 6000);
        }

        try {
            await upsertSymptom({ date: start.toISOString(), ...symptoms });
            console.log("success upserting symptoms")
        } catch (err: unknown) {
            console.warn("Failed to save symptoms", (err as any)?.message || err);
        }
    };



    const resetForm = () => {
        setStartDate("");
        setCycleLength(28);
        setLutealPhaseLength(14);
        setMenstrualDuration(5);
        setIsPregnant(false);
        setConceptionDate(null);
        setResults(null);
        setGestationInfo(null);
        setSymptoms({
            cramps: false,
            headaches: false,
            moodSwings: false,
            bloating: false,
            breastTenderness: false,
        });
    };
    function getHealthTips() {
        if (!results || !cycles[0])
            return "Get personalized tips by calculating your cycle first.";

        const today = new Date();
        const currentCycle = cycles[0];
        const daysSinceStart = Math.floor(
            (today.getTime() - new Date(currentCycle.startDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceStart <= currentCycle.menstrualDuration) {
            return "Stay hydrated, get adequate rest, and consider gentle exercises like yoga. Iron-rich foods can help replenish what's lost.";
        } else if (
            daysSinceStart <=
            currentCycle.cycleLength - currentCycle.lutealPhaseLength - 2
        ) {
            return "Great time for new workouts and challenges. Your energy is building. Focus on balanced nutrition with plenty of fresh foods.";
        } else if (
            Math.abs(
                daysSinceStart -
                (currentCycle.cycleLength - currentCycle.lutealPhaseLength)
            ) <= 1
        ) {
            return "Stay hydrated and maintain a balanced diet. If trying to conceive, ensure you're taking folic acid and maintaining healthy habits.";
        } else {
            return "You might experience PMS symptoms. Consider reducing caffeine, staying active with light exercise, and practicing stress management.";
        }
    }
    function getCurrentPhaseInfo() {
        if (!results || !cycles[0])
            return "Calculate your cycle to see phase information.";

        const today = new Date();
        const currentCycle = cycles[0];
        const daysSinceStart = Math.floor(
            (today.getTime() - new Date(currentCycle.startDate).getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceStart <= currentCycle.menstrualDuration) {
            return "You are currently in your menstrual phase. Your body is shedding the uterine lining. This is a natural cleansing process.";
        } else if (
            daysSinceStart <=
            currentCycle.cycleLength - currentCycle.lutealPhaseLength - 2
        ) {
            return "You are in your follicular phase. Your body is preparing for ovulation. Energy levels may start to increase.";
        } else if (
            Math.abs(
                daysSinceStart -
                (currentCycle.cycleLength - currentCycle.lutealPhaseLength)
            ) <= 1
        ) {
            return "You are approaching or at ovulation! This is your most fertile time. Consider this your peak fertility window.";
        } else {
            return "You are in your luteal phase. Your body is either preparing for pregnancy or the next menstrual cycle.";
        }
    }
    return (
        <div className="max-w-2xl mx-auto min-h-screen">
            {successMsg && (
                <div className={`my-4 px-4 py-3 rounded-lg shadow text-center font-semibold transition-colors duration-300 ${darkMode ? "bg-pink-900 text-pink-100 border border-pink-700" : "bg-pink-100 text-pink-700 border border-pink-300"}`}>
                    {successMsg}
                </div>
            )}

            {/* Inform user when they have opted that they are pregnant */}
            {isPregnant && (
                <div className="my-4 p-4 rounded-lg border-l-4 border-pink-500 bg-pink-50 dark:bg-pink-900 dark:text-pink-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="font-semibold">You're marked as pregnant</div>
                            {gestationInfo ? (
                                <div className="text-sm mt-1">
                                    <div>Due: {gestationInfo?.dueDate || '—'}</div>
                                    <div>Gestational age: {gestationInfo?.gestationalAge || '—'}</div>
                                    <div>Trimester: {gestationInfo?.currentTrimester || '—'}</div>
                                </div>
                            ) : (
                                <div className="text-sm mt-1">We don't have pregnancy details yet. Click "Add Pregnancy" to record your conception date so we can calculate milestones.</div>
                            )}
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            <button onClick={() => { if (typeof setCurrentView === 'function') { setCurrentView('pregnancy'); } else { setShowPregnancyModal(true); } }} className="bg-white dark:bg-gray-800 border border-pink-500 text-pink-600 dark:text-pink-200 px-3 py-1 rounded hover:bg-pink-50 transition">Open Pregnancy</button>
                            <button onClick={() => { setShowCycleModal(false); if (typeof setCurrentView === 'function') { setCurrentView('pregnancy'); } else { setShowPregnancyModal(true); } }} className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600 transition">Add / Edit Pregnancy</button>
                            <button 
                              onClick={async () => {
                                if (!confirm('Delete this pregnancy record? This action cannot be undone.')) return;
                                try {
                                  setIsPregnant(false);
                                  setGestationInfo(null);
                                  setConceptionDate(null);
                                  setSuccessMsg('Pregnancy record deleted');
                                  setTimeout(() => setSuccessMsg(''), 3000);
                                } catch (err) {
                                  setSuccessMsg('Error deleting pregnancy record');
                                  setTimeout(() => setSuccessMsg(''), 3000);
                                }
                              }}
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition flex items-center gap-1"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Action buttons when modals are closed */}
            {!showCycleModal && !showPregnancyModal && (
                <div className="flex gap-4 justify-center mb-6">
                    <button onClick={() => setShowCycleModal(true)} className="bg-pink-500 text-white px-6 py-3 rounded-lg">Add Cycle</button>
                    <button onClick={() => { setIsPregnant(true); setShowPregnancyModal(true); }} className="bg-purple-600 text-white px-6 py-3 rounded-lg">Add Pregnancy</button>
                </div>
            )}

            {/* If no results, show instruction */}
            {!results && !showCycleModal && !showPregnancyModal && (
                <div className="mb-6 text-center text-gray-700 dark:text-gray-300">No calculations yet — click "Add Cycle" to record a cycle or "Add Pregnancy" to record conception.</div>
            )}

            {/* Cycle Modal (reuses the existing form content) */}
            {showCycleModal && (
                <div className=" z-40 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-[95%] max-w-3xl relative">
                        <button onClick={() => setShowCycleModal(false)} className="absolute right-3 top-3 text-gray-600">Close</button>
                        <div className="grid md:grid-cols-2 gap-6 mb-6">
                            {/* Basic Inputs */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Cycle Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-100">Last Period Start Date</label>
                                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} max={format(new Date(), "yyyy-MM-dd")} min={format(addDays(new Date(), -365 * 5), "yyyy-MM-dd")} className="w-full p-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-100 transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-100">Cycle Length (days)</label>
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setCycleLength(Math.max(20, cycleLength - 1))} className="p-2 rounded bg-gray-600 dark:bg-gray-600 text-gray-200 dark:text-gray-200 transition-colors duration-300"><Minus size={16} /></button>
                                            <input type="number" min={20} max={40} value={cycleLength} onChange={(e) => setCycleLength(parseInt(e.target.value) || 28)} className="flex-1 p-3 rounded-lg border  border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-center text-gray-700 dark:text-gray-100 transition-colors duration-300" />
                                            <button onClick={() => setCycleLength(Math.min(40, cycleLength + 1))} className="p-2 rounded bg-gray-600 dark:bg-gray-600 text-gray-200 dark:text-gray-200 transition-colors duration-300"><Plus size={16} /></button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-100">Luteal Phase Length (days)</label>
                                        <input type="number" min={10} max={18} value={lutealPhaseLength} onChange={(e) => setLutealPhaseLength(parseInt(e.target.value) || 14)} className="w-full p-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-100 transition-colors duration-300" />
                                    </div>
                                    <div>
                                        <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-100">Menstrual Duration (days)</label>
                                        <input type="number" min={2} max={10} value={menstrualDuration} onChange={(e) => setMenstrualDuration(parseInt(e.target.value) || 5)} className="w-full p-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-100 transition-colors duration-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Symptoms column */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Additional Information</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                            <input type="checkbox" checked={isPregnant} onChange={(e) => setIsPregnant(e.target.checked)} className="rounded border-gray-300 dark:border-gray-600" />
                                            <span className="font-semibold">I might be pregnant</span>
                                        </label>
                                    </div>
                                    {isPregnant && (
                                        <div>
                                            <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-100">Conception Date (if known)</label>
                                            <input type="date" value={conceptionDate ? format(conceptionDate, "yyyy-MM-dd") : ""} onChange={(e) => setConceptionDate(e.target.value ? new Date(e.target.value) : null)} max={format(new Date(), "yyyy-MM-dd")} className="w-full p-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-100 transition-colors duration-300" />
                                        </div>
                                    )}

                                    <div>
                                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Current Symptoms</h4>
                                        <div className="space-y-2">
                                            {Object.entries({ cramps: "Cramps", headaches: "Headaches", moodSwings: "Mood Swings", bloating: "Bloating", breastTenderness: "Breast Tenderness", }).map(([key, label]) => (
                                                <label key={key} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                                    <input type="checkbox" checked={symptoms[key as keyof typeof symptoms]} onChange={(e) => setSymptoms((prev) => ({ ...prev, [key as keyof typeof symptoms]: e.target.checked }))} className="rounded border-gray-300 dark:border-gray-600" />
                                                    <span className="text-sm">{label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <button onClick={async () => { await calculateOvulation(); setShowCycleModal(false); }} className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-lg">Save Cycle</button>
                            <button onClick={() => { resetForm(); setShowCycleModal(false); }} className="bg-gray-500 text-white px-8 py-3 rounded-lg">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pregnancy Modal */}
            {showPregnancyModal && (
                <div className="mt-12 z-40 flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg w-[90%] max-w-xl relative">
                        <button onClick={() => setShowPregnancyModal(false)} className="absolute right-3 top-3 text-gray-600 hover:text-gray-900">Close</button>
                        <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Add / Edit Pregnancy</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2 font-semibold text-gray-800 dark:text-gray-100">Conception Date</label>
                                <input type="date" value={conceptionDate ? format(conceptionDate, "yyyy-MM-dd") : ""} onChange={(e) => setConceptionDate(e.target.value ? new Date(e.target.value) : null)} max={format(new Date(), "yyyy-MM-dd")} className="w-full p-3 rounded-lg border border-gray-300 dark:bg-gray-700 dark:border-gray-600 text-gray-700 dark:text-gray-100" />
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">Notes / Symptoms (optional)</h4>
                                <div className="space-y-2">
                                    {Object.entries({ cramps: "Cramps", headaches: "Headaches", moodSwings: "Mood Swings", bloating: "Bloating", breastTenderness: "Breast Tenderness", }).map(([key, label]) => (
                                        <label key={key} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                                            <input type="checkbox" checked={symptoms[key as keyof typeof symptoms]} onChange={(e) => setSymptoms((prev) => ({ ...prev, [key as keyof typeof symptoms]: e.target.checked }))} className="rounded border-gray-300 dark:border-gray-600" />
                                            <span className="text-sm">{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-center mt-4 flex-wrap">
                            <button onClick={async () => { if (conceptionDate) { await calculatePregnancyInfo(conceptionDate); setShowPregnancyModal(false); } else { setSuccessMsg('Please select a conception date.'); setTimeout(() => setSuccessMsg(''), 3000); } }} className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition">Save Pregnancy</button>
                            {isPregnant && (
                              <button 
                                onClick={async () => {
                                  if (!confirm('Delete this pregnancy record? This action cannot be undone.')) return;
                                  try {
                                    setIsPregnant(false);
                                    setGestationInfo(null);
                                    setConceptionDate(null);
                                    setShowPregnancyModal(false);
                                    setSuccessMsg('Pregnancy record deleted');
                                    setTimeout(() => setSuccessMsg(''), 3000);
                                  } catch (err) {
                                    setSuccessMsg('Error deleting pregnancy record');
                                    setTimeout(() => setSuccessMsg(''), 3000);
                                  }
                                }}
                                className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-1"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            )}
                            <button onClick={() => setShowPregnancyModal(false)} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition">Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/** Results */}
            {results && !isPregnant && (
                <div className="">
                    <div className="mt-8 min-h-screen">
                        <h2 className="text-3xl font-bold text-center mb-6 text-pink-700 dark:text-pink-400">
                            Your Fertility Timeline
                        </h2>
                        <div className="relative max-w-2xl mx-auto">
                            {/* Timeline vertical line */}
                            <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-300 via-purple-300 to-blue-300 dark:from-pink-800 dark:via-purple-800 dark:to-blue-800 rounded-full"></div>
                            <div className="space-y-10 pl-14">
                                {/* Fertile Window */}
                                <div className="relative">
                                    <div className="absolute -left-7 top-1.5 w-6 h-6 bg-pink-200 dark:bg-pink-700 rounded-full flex items-center justify-center shadow">
                                        <Heart size={16} className="text-pink-600" />
                                    </div>
                                    <div className="bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-900 dark:to-pink-800 p-6 rounded-lg shadow-lg">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                            Fertile Window
                                        </h3>
                                        <p className="text-xl font-bold text-pink-700 dark:text-pink-400 mb-1">
                                            {results.fertileWindow}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Most fertile days for conception
                                        </p>
                                    </div>
                                </div>
                                {/* Ovulation Date */}
                                <div className="relative">
                                    <div className="absolute -left-7 top-1.5 w-6 h-6 bg-purple-200 dark:bg-purple-700 rounded-full flex items-center justify-center shadow">
                                        <Calendar size={16} className="text-purple-600" />
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 p-6 rounded-lg shadow-lg">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                            Ovulation Date
                                        </h3>
                                        <p className="text-xl font-bold text-purple-700 dark:text-purple-400 mb-1">
                                            {results.ovulationDate}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Peak fertility day
                                        </p>
                                    </div>
                                </div>
                                {/* Next Period */}
                                {results.nextPeriod && (
                                    <div className="relative">
                                        <div className="absolute -left-7 top-1.5 w-6 h-6 bg-red-200 dark:bg-red-700 rounded-full flex items-center justify-center shadow">
                                            <Calendar size={16} className="text-red-600" />
                                        </div>
                                        <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800 p-6 rounded-lg shadow-lg">
                                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                                Next Period
                                            </h3>
                                            <p className="text-xl font-bold text-red-700 dark:text-red-400 mb-1">
                                                {results.nextPeriod}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Expected period start
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {/* Pregnancy Test */}
                                <div className="relative">
                                    <div className="absolute -left-7 top-1.5 w-6 h-6 bg-blue-200 dark:bg-blue-700 rounded-full flex items-center justify-center shadow">
                                        <Info size={16} className="text-blue-600" />
                                    </div>
                                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 p-6 rounded-lg shadow-lg">
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                                            Pregnancy Test
                                        </h3>
                                        <p className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-1">
                                            {results.pregnancyTestDate}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Earliest test date
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Daily Tips */}
                    <div className="mt-8 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 rounded-lg p-6 transition-colors duration-300">
                        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
                            Cycle Phase Tips
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                                    Current Phase Insights
                                </h4>
                                <p className="text-sm mb-2 text-gray-800 dark:text-gray-100">
                                    {getCurrentPhaseInfo()}
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                                    Health & Wellness Tips
                                </h4>
                                <p className="text-sm text-gray-800 dark:text-gray-100">
                                    {getHealthTips()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Calculator
