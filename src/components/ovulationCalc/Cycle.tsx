/* eslint-disable */
"use client"
import React from 'react'
import { useState } from 'react';
import {
  format,
} from "date-fns";
import {
  Info,
} from "lucide-react";
import { getCycles, CycleData, updateCycle, deleteCycle } from "@/lib/cycles";

type Cycle = {
  id: number;
  startDate: Date;
  cycleLength: number;
  lutealPhaseLength: number;
  menstrualDuration: number;
  ovulationDate: Date;
  fertileStart: Date;
  fertileEnd: Date;
  nextPeriod: Date;
  menstrualEnd: Date;
  pregnancyTestDate: Date;
  fertilityWindow: {
    date: Date;
    probability: number;
    phase: string;
  }[];
  symptoms: {
    cramps: boolean;
    headaches: boolean;
    moodSwings: boolean;
    bloating: boolean;
    breastTenderness: boolean;
  };
};
type CycleProps = {
  currentView: string;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
  cycles: CycleData[];
  refreshCycles?: () => Promise<void>;
};

const Cycle: React.FC<CycleProps> = ({ currentView, setCurrentView, cycles, refreshCycles }) => {
  const [cyclesState, setCyclesState] = useState<CycleData[]>(cycles || []);
  console.log(currentView)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ cycleLength: 0, lutealPhaseLength: 0, menstrualDuration: 0 });

  // keep local copy in sync when prop changes
  React.useEffect(() => {
    setCyclesState(cycles || []);
  }, [cycles]);

  const refresh = async () => {
    try {
      setLoading(true);
      const res = await getCycles();
      setCyclesState(res || []);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (c: CycleData) => {
    const id = (c as any)._id || (c as any).id || null;
    setEditingId(id);
    setEditForm({ cycleLength: c.cycleLength, lutealPhaseLength: c.lutealPhaseLength, menstrualDuration: c.menstrualDuration });
  };

  const handleSave = async (id?: string | null) => {
    const safeId = id || null;
    if (!safeId) {
      console.error('[Cycle] updateCycle: missing id, aborting');
      setError('Missing cycle id. Could not update.');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      console.log('[Cycle] updateCycle: updating', safeId, editForm);
      const res = await updateCycle(safeId, {
        cycleLength: editForm.cycleLength,
        lutealPhaseLength: editForm.lutealPhaseLength,
        menstrualDuration: editForm.menstrualDuration,
      });
      console.log('[Cycle] updateCycle: result', res);
      setEditingId(null);
      // Prefer parent refreshCycles to keep single source of truth
      if (typeof refreshCycles === "function") {
        try {
          await refreshCycles();
        } catch (err) {
          console.warn("refreshCycles failed", err);
          await refresh();
        }
      } else {
        await refresh();
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id?: string | null) => {
    const safeId = id || null;
    if (!safeId) {
      console.error('[Cycle] deleteCycle: missing id, aborting');
      setError('Missing cycle id. Could not delete.');
      return;
    }
    if (!confirm('Delete this cycle? This cannot be undone.')) return;
    try {
      setLoading(true);
      setError(null);
      console.log('[Cycle] deleteCycle: deleting', safeId);
      const res = await deleteCycle(safeId);
      console.log('[Cycle] deleteCycle: result', res);
      if (typeof refreshCycles === "function") {
        try {
          await refreshCycles();
        } catch (err) {
          console.warn("refreshCycles failed", err);
          await refresh();
        }
      } else {
        await refresh();
      }
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  const renderCycleHistory = () => {
    if (cycles.length === 0) return null;

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg transition-colors duration-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Cycle History
        </h3>
        <div className="space-y-4">
          {cyclesState.map((cycle, index) => {
            const id = (cycle as any)._id || (cycle as any).id || String(index);
            return (
              <div
                key={id}
                className="border-l-4 border-pink-400 dark:border-pink-600 pl-4 py-2 bg-gray-50 dark:bg-gray-900 rounded transition-colors duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-100">
                      Cycle {cyclesState.length - index}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Started: {format(new Date(cycle.startDate), "MMM dd, yyyy")}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Length: {cycle.cycleLength} days</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="text-purple-700 dark:text-purple-300">Ovulation: {format(new Date(cycle.ovulationDate), "MMM dd")}</p>
                    <p className="text-red-700 dark:text-red-300">Next Period: {format(new Date(cycle.nextPeriod), "MMM dd")}</p>
                  </div>
                </div>

                {/* Edit / Delete controls */}
                <div className="mt-3 flex items-center gap-3">
                  {editingId === cycle._id ? (
                    <>
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Length</label>
                        <input type="number" className="w-20 p-1 rounded border" value={editForm.cycleLength} onChange={(e) => setEditForm((s) => ({ ...s, cycleLength: Number(e.target.value) }))} />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Luteal</label>
                        <input type="number" className="w-20 p-1 rounded border" value={editForm.lutealPhaseLength} onChange={(e) => setEditForm((s) => ({ ...s, lutealPhaseLength: Number(e.target.value) }))} />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Menstrual</label>
                        <input type="number" className="w-20 p-1 rounded border" value={editForm.menstrualDuration} onChange={(e) => setEditForm((s) => ({ ...s, menstrualDuration: Number(e.target.value) }))} />
                      </div>
                      <button className="bg-pink-500 text-white px-3 py-1 rounded" onClick={() => handleSave(id)}>Save</button>
                      <button className="px-3 py-1 rounded border" onClick={() => setEditingId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button className="px-3 py-1 rounded border" onClick={() => handleStartEdit(cycle)}>Edit</button>
                      <button className="px-3 py-1 rounded border text-red-600" onClick={() => handleDelete(id)}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {loading && <p className="text-sm text-gray-500 mt-3">Loading...</p>}
        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </div>
    );
  };
  return (
    <div className="max-w-4xl mx-auto">
      {cycles.length > 0 ? (
        renderCycleHistory()
      ) : (
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-8">
          <Info
            size={64}
            className="mx-auto mb-4 text-gray-400"
          />
          <h3 className="text-xl font-semibold mb-2">
            No Cycle History
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Start tracking your cycles to build a
            history for better predictions.
          </p>
          <button
            onClick={() => setCurrentView("calculator")}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
          >
            Start Tracking
          </button>
        </div>
      )}
    </div>
  );
};

export default Cycle
