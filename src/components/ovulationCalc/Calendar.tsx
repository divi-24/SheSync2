/* eslint-disable */
"use client";
import React, { useState, useEffect } from "react";
import { CycleData } from "@/lib/cycles";
import {
  addDays,
  format,
  differenceInDays,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
} from "date-fns";
import { upsertSymptom, getSymptoms, getSymptomByDate, Symptom } from "@/lib/symptoms";
import {
  ChevronRight,
  ChevronLeft,

} from "lucide-react";
import { getActivePregnancy } from "@/lib/pregnancy";
type CalendarCompoProps = {
  currentMonth: Date;
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
  cycles: CycleData[];
  startDate: string;
  isPregnant: boolean;
  // Use a loose type for gestationInfo to avoid duplicate local type conflicts across files
  gestationInfo: any | null;
  setGestationInfo: React.Dispatch<React.SetStateAction<any | null>>;
  refreshCycles?: () => Promise<void>;
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
} | null;

type CalendarCompoPropsWithResults = CalendarCompoProps & {
  results: Results;
};

const CalendarCompo: React.FC<CalendarCompoPropsWithResults> = ({
  currentMonth,
  setCurrentMonth,
  cycles,
  startDate,
  isPregnant,
  gestationInfo,
  setGestationInfo,
  results,
  refreshCycles,
}) => {
  // type Results = {
  //   ovulationDate: string;
  //   fertileWindow: string;
  //   nextPeriod: string;
  //   menstrualEnd: string;
  //   pregnancyTestDate: string;
  //   fertilityWindow: {
  //     date: Date;
  //     probability: number;
  //     phase: string;
  //   }[];
  // } | null;

  // Remove local results state, use prop instead
  console.log("Calendar rendering with results:", results);
  console.log("StartDate:", startDate);
  type DayType = "period" | "ovulation" | "fertile" | "next-period" | "dueDate" | "milestone" | "pregnancyDay" | "normal";

  // Hover tooltip state (moved to component top-level so hooks follow rules)
  const [hoveredDay, setHoveredDay] = useState<Date | null>(null);
  const [hoveredType, setHoveredType] = useState<DayType | null>(null);
  const [hoveredLabel, setHoveredLabel] = useState<string>("");
  console.log(hoveredType)
  // Symptoms state
  const [symptomsMap, setSymptomsMap] = useState<Record<string, Symptom>>({});
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [symptomLoading, setSymptomLoading] = useState(false);
  const [symptomMsg, setSymptomMsg] = useState<string>("");
  // Active pregnancy state (fetched from backend when user is marked pregnant)
  const [activePregnancy, setActivePregnancy] = useState<any | null>(null);

  // Load all symptoms to show indicators on calendar
  const loadAllSymptoms = async () => {
    console.log("Loading all symptoms...");
    try {
      const data = await getSymptoms();
      const map: Record<string, Symptom> = {};
      data.forEach((s) => {
        try {
          const key = new Date(s.date).toISOString().slice(0, 10);
          map[key] = s;
        } catch (e) {
          console.warn("Malformed symptom date:", s.date, e);
        }
      });
      setSymptomsMap(map);
      console.log("Symptoms loaded:", map);
    } catch (err) {
      console.warn("Failed to load symptoms", err);
    }
  };

  useEffect(() => {
    loadAllSymptoms();
  }, []);

  // Load active pregnancy when pregnancy flag changes
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!isPregnant) {
        setActivePregnancy(null);
        return;
      }
      try {
        const p = await getActivePregnancy();
        if (cancelled) return;
        // normalize milestones and dates
        const asAny: any = p;
        const norm = {
          ...p,
          dueDate: asAny.dueDate ? (typeof asAny.dueDate === 'string' ? asAny.dueDate : (asAny.dueDate?.$date || asAny.dueDate)) : null,
          conceptionDate: asAny.conceptionDate ? (typeof asAny.conceptionDate === 'string' ? asAny.conceptionDate : (asAny.conceptionDate?.$date || asAny.conceptionDate)) : null,
          milestones: Array.isArray(asAny.milestones)
            ? asAny.milestones.map((m: any) => ({
              week: m.week,
              milestone: m.milestone,
              date: m.date ? (typeof m.date === 'string' ? m.date : (m.date?.$date || m.date)) : null,
            }))
            : [],
        };
        setActivePregnancy(norm);
        console.log("Active pregnancy loaded:", norm);
        // update parent if setter provided
        try {
          setGestationInfo && setGestationInfo(norm);
        } catch (e) {
          // ignore
        }
      } catch (err) {
        console.warn('Failed to load active pregnancy', err);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [isPregnant, setGestationInfo]);

  const loadSymptomForDay = async (day: Date) => {
    setSymptomLoading(true);
    setSelectedSymptom(null);
    // Normalize to date key (YYYY-MM-DD) to match backend storage (midnight UTC)
    const dateKey = day.toISOString().slice(0, 10);
    console.log("Loading symptom for day:", dateKey);
    try {
      const s = await getSymptomByDate(dateKey);
      setSelectedSymptom(s as Symptom);
      console.log("Loaded symptom:", s);
    } catch (err) {
      console.log("No symptom found for date, preparing empty:", dateKey, err);
      // prepare empty symptom with date set to midnight UTC
      setSelectedSymptom({ date: `${dateKey}T00:00:00.000Z` });
    } finally {
      setSymptomLoading(false);
    }
  };

  const saveSymptomForDay = async (day: Date) => {
    if (!selectedSymptom) return;
    setSymptomLoading(true);
    const dateKey = day.toISOString().slice(0, 10);
    console.log("Saving symptom for day:", dateKey, selectedSymptom);
    try {
      const payload: Symptom = {
        ...selectedSymptom,
        // store as midnight UTC to match backend convention
        date: `${dateKey}T00:00:00.000Z`,
      };
      const saved = await upsertSymptom(payload);
      const key = new Date(saved.date).toISOString().slice(0, 10);
      setSymptomsMap((prev) => ({ ...prev, [key]: saved }));
      setSymptomMsg("Symptoms saved.");
      console.log("Symptom saved:", saved);
      setTimeout(() => setSymptomMsg(""), 3000);
      // prefer parent refresh if available
      try {
        if (typeof refreshCycles === 'function') await refreshCycles();
      } catch (e) {
        // ignore
      }
    } catch (err) {
      console.warn("Failed to save symptom", err);
      setSymptomMsg("Failed to save symptoms.");
      setTimeout(() => setSymptomMsg(""), 3000);
    } finally {
      setSymptomLoading(false);
    }
  };

  const getDayType = (date: Date): DayType => {
    if (!cycles || cycles.length === 0) return "normal";
    const currentCycle = cycles[0];

    // Cycle dates are stored as ISO strings in CycleData — parse to Date for comparisons
    const start = new Date(currentCycle.startDate);
    const menstrualEnd = new Date(currentCycle.menstrualEnd);
    const ovulationDate = new Date(currentCycle.ovulationDate);
    const fertileStart = new Date(currentCycle.fertileStart);
    const fertileEnd = new Date(currentCycle.fertileEnd);
    const nextPeriod = new Date(currentCycle.nextPeriod);

    if (isSameDay(date, start)) return "period";
    if (date >= start && date <= menstrualEnd) return "period";
    if (isSameDay(date, ovulationDate)) return "ovulation";
    if (date >= fertileStart && date <= fertileEnd) return "fertile";
    if (isSameDay(date, nextPeriod)) return "next-period";
    return "normal";
  };

  const dayTypeLabels: { [key in DayType]: string } = {
    period: "Period Day",
    ovulation: "Ovulation Day",
    fertile: "Fertile Window",
    "next-period": "Next Period",
    dueDate: "Due Date",
    milestone: "Pregnancy Milestone",
    pregnancyDay: "Pregnancy Day",
    normal: "Normal Day",
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const today = new Date();

    const dayTypeColors = {
      period: "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200",
      ovulation: "bg-purple-200 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      fertile: "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200",
      "next-period": "bg-orange-200 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      dueDate: "bg-pink-500 text-pink-900 dark:bg-pink-700 dark:text-pink-100 font-bold",
      milestone: "bg-blue-200 text-blue-900 dark:bg-blue-800 dark:text-blue-100",
      pregnancyDay: "bg-pink-100 text-gray-800 dark:bg-pink-900 dark:text-pink-100",
      normal: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
    };

    // Prefer activePregnancy (fetched from backend) if available, otherwise use gestationInfo prop
    const pregnancySource = activePregnancy || gestationInfo;
    const pregnancyDates = isPregnant && pregnancySource
      ? {
        dueDate: pregnancySource.dueDate ? new Date(pregnancySource.dueDate) : null,
        milestones: (pregnancySource.milestones || []).map((m: any) => ({
          week: m.week,
          milestone: m.milestone,
          date: m.date ? new Date(m.date) : null,
        })),
        conceptionDate: pregnancySource.conceptionDate ? new Date(pregnancySource.conceptionDate) : null,
      }
      : null;

    const getPregnancyDayType = (day: Date): DayType => {
      if (pregnancyDates?.dueDate && isSameDay(day, pregnancyDates.dueDate)) return "dueDate";
      if (pregnancyDates?.milestones) {
        const match = pregnancyDates.milestones.find(
          (m: any) => m.date && isSameDay(day, m.date)
        );
        if (match) return "milestone";
      }
      return "pregnancyDay";
    };

    const getPregnancyWeek = (day: Date): number | null => {
      if (!pregnancyDates?.conceptionDate) return null;
      const diffDays = differenceInDays(day, pregnancyDates.conceptionDate);
      if (diffDays < 0) return null;
      const week = Math.floor(diffDays / 7) + 1;
      return week <= 42 ? week : null;
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg relative">
        {/* Month Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <h3 className="text-xl text-gray-800 dark:text-gray-100 font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h3>
          <button
            onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        {/* Important pregnancy info when pregnant */}
        {isPregnant && (activePregnancy || gestationInfo) && (
          <div className="mt-6 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900 dark:to-purple-900 rounded-lg p-4">
            <h4 className="text-lg font-semibold mb-2">Pregnancy Summary</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
              <div>
                <div className="text-sm text-gray-500">Due Date</div>
                <div className="font-medium text-gray-800">{(activePregnancy?.dueDate || gestationInfo?.dueDate) ? format(new Date(activePregnancy?.dueDate || gestationInfo?.dueDate), 'MMM dd, yyyy') : '—'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Gestational Age</div>
                <div className="font-medium text-gray-800">{activePregnancy?.gestationalAge || gestationInfo?.gestationalAge || '—'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Current Trimester</div>
                <div className="font-medium text-gray-800">{activePregnancy?.currentTrimester || gestationInfo?.currentTrimester || '—'}</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold mb-1">Upcoming Milestones</h5>
              <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-200">
                {(activePregnancy?.milestones || gestationInfo?.milestones || []).slice(0, 5).map((m: any, i: number) => (
                  <li key={i}>{m.week ? `Week ${m.week}: ` : ''}{m.milestone} — {m.date ? format(new Date(m.date), 'MMM dd, yyyy') : ''}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-2 mb-4 text-gray-700 dark:text-gray-300 font-semibold">
          {"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => (
            <div key={day} className="text-center font-semibold p-2 text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const dayType = isPregnant ? getPregnancyDayType(day) : getDayType(day);
            const isToday = isSameDay(day, today);
            const pregnancyWeek = isPregnant ? getPregnancyWeek(day) : null;
            const label = dayTypeLabels[dayType];
            const symptomKey = day.toISOString().slice(0, 10);
            const hasSymptom = Boolean(symptomsMap[symptomKey]);

            return (
              <div
                key={day.toISOString()}
                className={`
                  p-2 text-center text-sm rounded-lg cursor-pointer transition-colors calendar-day relative
                  ${dayTypeColors[dayType]}
                  ${isToday ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""}
                  ${!isSameMonth(day, currentMonth) ? "opacity-30" : ""}
                `}
                onMouseEnter={() => {
                  setHoveredDay(day);
                  setHoveredType(dayType);
                  // if this day is a milestone, show milestone text + week
                  if (dayType === 'milestone' && pregnancyDates?.milestones) {
                    const m = pregnancyDates.milestones.find((mm: any) => mm.date && isSameDay(day, mm.date));
                    if (m) {
                      setHoveredLabel(`${m.milestone} (wk ${m.week})`);
                    } else {
                      setHoveredLabel(label);
                    }
                  } else {
                    setHoveredLabel(label);
                  }
                }}
                onClick={() => {
                  setSelectedDay(day);
                  loadSymptomForDay(day);
                }}
                onMouseLeave={() => {
                  setHoveredDay(null);
                  setHoveredType(null);
                  setHoveredLabel("");
                }}
              >
                <div>{format(day, "d")}</div>
                {/* symptom indicator */}
                {hasSymptom && (
                  <div className="w-2 h-2 rounded-full mx-auto mt-1 bg-yellow-400 dark:bg-yellow-300" />
                )}
                {pregnancyWeek && (
                  <div className="text-[10px] mt-1 opacity-70">
                    Wk {pregnancyWeek}
                  </div>
                )}
                {/* Tooltip */}
                {hoveredDay && isSameDay(day, hoveredDay) && (
                  <div className={`absolute z-10 left-1/2 -translate-x-1/2 top-10 min-w-[120px] px-3 py-2 rounded-lg shadow-lg text-xs font-semibold ${dayTypeColors[dayType]} ${isToday ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""}`}
                    style={{ whiteSpace: "nowrap" }}>
                    {hoveredLabel}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          {isPregnant ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-500 dark:bg-pink-700 rounded"></div>
                <span>Due Date</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200 dark:bg-blue-800 rounded"></div>
                <span>Pregnancy Milestone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-pink-100 dark:bg-pink-900 rounded"></div>
                <span>Pregnancy Day</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 dark:bg-red-900 rounded"></div>
                <span>Period</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 dark:bg-green-900 rounded"></div>
                <span>Fertile Window</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-200 dark:bg-purple-900 rounded"></div>
                <span>Ovulation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-200 dark:bg-orange-900 rounded"></div>
                <span>Next Period</span>
              </div>
            </>
          )}
        </div>
        {/* Symptom side panel */}
        {selectedDay && (
          <div className="absolute right-4 top-6 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold">Symptoms — {format(selectedDay, "MMM dd, yyyy")}</div>
              <button onClick={() => { setSelectedDay(null); setSelectedSymptom(null); }} className="text-sm text-gray-500">Close</button>
            </div>
            {symptomLoading ? (
              <div>Loading…</div>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-gray-600">Mark symptoms for this date</div>
                {["cramps", "headaches", "moodSwings", "bloating", "breastTenderness"].map((k) => (
                  <label key={k} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedSymptom && (selectedSymptom as any)[k])}
                      onChange={(e) => setSelectedSymptom((prev) => ({ ...(prev || { date: selectedDay.toISOString() }), [k]: e.target.checked }))}
                      className="rounded border-gray-300 dark:border-gray-600"
                    />
                    <span className="text-sm capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                  </label>
                ))}
                <div>
                  <label className="block text-sm font-medium">Notes</label>
                  <textarea
                    rows={3}
                    value={(selectedSymptom && (selectedSymptom.notes as string)) || ""}
                    onChange={(e) => setSelectedSymptom((prev) => ({ ...(prev || { date: selectedDay.toISOString() }), notes: e.target.value }))}
                    className="w-full mt-1 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => saveSymptomForDay(selectedDay)} className="bg-pink-500 text-white px-3 py-2 rounded">Save</button>
                  <button onClick={() => { setSelectedSymptom({ date: selectedDay.toISOString() }); setSymptomMsg(''); }} className="bg-gray-200 dark:bg-gray-700 px-3 py-2 rounded">Clear</button>
                </div>
                {symptomMsg && <div className="text-sm text-green-600">{symptomMsg}</div>}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <style>
        {`
          .calendar-day {
            transition: background 0.2s, color 0.2s;
          }
          /* Light mode */
          .calendar-day.bg-red-200 { background: #fecaca !important; color: #991b1b !important; }
          .calendar-day.bg-green-200 { background: #bbf7d0 !important; color: #166534 !important; }
          .calendar-day.bg-purple-200 { background: #e9d5ff !important; color: #6d28d9 !important; }
          .calendar-day.bg-orange-200 { background: #fed7aa !important; color: #c2410c !important; }
          .calendar-day.bg-gray-100 { background: #f3f4f6 !important; color: #374151 !important; }
          /* Dark mode */
          .dark .calendar-day.bg-red-200 { background: #7f1d1d !important; color: #fecaca !important; }
          .dark .calendar-day.bg-green-200 { background: #14532d !important; color: #bbf7d0 !important; }
          .dark .calendar-day.bg-purple-200 { background: #581c87 !important; color: #e9d5ff !important; }
          .dark .calendar-day.bg-orange-200 { background: #78350f !important; color: #fed7aa !important; }
          .dark .calendar-day.bg-gray-100 { background: #1f2937 !important; color: #d1d5db !important; }
        `}
      </style>
      {renderCalendar()}
    </div>
  );
};

export default CalendarCompo
