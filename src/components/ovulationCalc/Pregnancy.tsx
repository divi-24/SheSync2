/* eslint-disable */

"use client";
import React, { useEffect, useState } from "react";

import {
  Baby,
} from "lucide-react";

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

type PregnancyProps = {
  isPregnant: boolean;
  gestationInfo: GestationInfo;
  setGestationInfo: React.Dispatch<React.SetStateAction<GestationInfo>>;
  setCurrentView: React.Dispatch<React.SetStateAction<string>>;
};

// import API helpers
import {
  createPregnancy,
  getActivePregnancy,
  updatePregnancy,
  archivePregnancy,
  deletePregnancy,
} from "../../lib/pregnancy";

const Pregnancy: React.FC<PregnancyProps> = ({
  isPregnant,
  gestationInfo,
  setGestationInfo,
  setCurrentView,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [activeRecord, setActiveRecord] = useState<any | null>(null);
  const [form, setForm] = useState({
    dueDate: "",
    babySize: "",
    babyWeight: "",
    weeklyTips: "",
    conceptionDate: "",
    milestonesJson: "",
  });

  // Normalize backend pregnancy object into the GestationInfo shape used by this component
  const normalize = (p: any): GestationInfo => {
    if (!p) return null;
    const milestones = (p.milestones || []).map((m: any) => ({
      week: m.week,
      milestone: m.milestone,
      date: m.date ? new Date(m.date) : new Date(),
    }));
    const dueDateStr = p.dueDate || "";
    const daysUntilDue = typeof p.daysUntilDue === "number" ? p.daysUntilDue : Math.max(0, Math.ceil((new Date(dueDateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
    return {
      gestationalAge: p.gestationalAge || "",
      dueDate: dueDateStr,
      currentTrimester: p.currentTrimester || 0,
      firstTrimester: p.firstTrimester || "",
      secondTrimester: p.secondTrimester || "",
      thirdTrimester: p.thirdTrimester || "",
      milestones,
      daysUntilDue,
      babySize: p.babySize,
      babyWeight: p.babyWeight,
      weeklyTips: p.weeklyTips || [],
      conceptionDate: p.conceptionDate || undefined,
    };
  };

  // load active pregnancy when component mounts or when isPregnant toggles on
  useEffect(() => {
    const load = async () => {
      if (!isPregnant) return;
      setLoading(true);
      setError(null);
      try {
        console.log('[Pregnancy] getActivePregnancy: fetching active pregnancy');
        const p = await getActivePregnancy();
        console.log('[Pregnancy] getActivePregnancy: result', p);
        setActiveRecord(p);
        setGestationInfo(normalize(p));
        // prefill form
        setForm({
          dueDate: p.dueDate ? p.dueDate.split("T")[0] : "",
          babySize: p.babySize || "",
          babyWeight: p.babyWeight || "",
          weeklyTips: (p.weeklyTips || []).join("\n"),
          conceptionDate: p.conceptionDate ? p.conceptionDate.split("T")[0] : "",
          milestonesJson: JSON.stringify(p.milestones || [], null, 2),
        });
      } catch (err: any) {
        // no active pregnancy is not fatal; allow creation
        setActiveRecord(null);
        setGestationInfo(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isPregnant]);
  const renderPregnancyTracker = () => {
    if (!isPregnant || !gestationInfo) return null;

    return (
      <div className="space-y-6">
        {/* Main Progress */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Baby size={24} className="text-pink-600 dark:text-pink-300" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Pregnancy Progress
            </h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-lg mb-2 text-gray-800 dark:text-gray-100"><strong>Gestational Age:</strong> {gestationInfo.gestationalAge}</p>
              <p className="text-lg mb-2 text-gray-800 dark:text-gray-100"><strong>Trimester:</strong> {gestationInfo.currentTrimester}</p>
              <p className="text-lg mb-2 text-gray-800 dark:text-gray-100"><strong>Due Date:</strong> {gestationInfo.dueDate}</p>
              <p className="text-lg text-gray-800 dark:text-gray-100"><strong>Days Until Due:</strong> {gestationInfo.daysUntilDue}</p>
            </div>
            <div>
              <p className="text-lg mb-2 text-gray-800 dark:text-gray-100"><strong>Baby’s Size:</strong> {gestationInfo.babySize}</p>
              <p className="text-lg mb-2 text-gray-800 dark:text-gray-100"><strong>Estimated Weight:</strong> {gestationInfo.babyWeight}</p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
                <div
                  className="bg-pink-500 h-3 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      ((280 - gestationInfo.daysUntilDue) / 280) * 100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Trimester Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "First Trimester", color: "pink", info: gestationInfo.firstTrimester, note: "Organ formation begins" },
            { title: "Second Trimester", color: "green", info: gestationInfo.secondTrimester, note: "Growth and movement" },
            { title: "Third Trimester", color: "blue", info: gestationInfo.thirdTrimester, note: "Final development" }
          ].map((t, i) => (
            <div key={i} className={`bg-${t.color}-100 dark:bg-${t.color}-900 rounded-lg p-4 shadow`}>
              <h4 className={`font-bold text-lg mb-2 text-${t.color}-700 dark:text-${t.color}-200`}>{t.title}</h4>
              <p className="text-sm text-gray-800 dark:text-gray-100">{t.info}</p>
              <p className="text-xs mt-2 text-gray-800 dark:text-gray-100">{t.note}</p>
            </div>
          ))}
        </div>

        {/* Weekly Updates */}
        {gestationInfo.weeklyTips && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h4 className="font-bold text-lg mb-4">This Week’s Highlights</h4>
            <ul className="space-y-2">
              {gestationInfo.weeklyTips.map((tip, idx) => (
                <li key={idx} className="text-sm">• {tip} </li> 
              ))}
            </ul>
          </div>
        )}

        {/* Milestones */}
        {gestationInfo.milestones && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h4 className="font-bold text-lg mb-4">Upcoming Milestones</h4>
            <div className="space-y-3">
              {gestationInfo.milestones.map((milestone, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <div className="w-12 h-12 bg-pink-200 dark:bg-pink-800 rounded-full flex items-center justify-center font-bold">
                    {milestone.week}
                  </div>
                  <div>
                    <p className="font-semibold">Week {milestone.week}</p>
                    <p className="text-sm">{milestone.milestone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Management / Edit Panel */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h4 className="font-bold text-lg mb-4">Manage Pregnancy</h4>

          {/* If not editing and there's an active record, show read-only cards */}
          {!editing && activeRecord ? (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-sm text-gray-500">Due date</p>
                  <p className="font-medium">{activeRecord.dueDate ? new Date(activeRecord.dueDate).toLocaleDateString() : '—'}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-sm text-gray-500">Conception date</p>
                  <p className="font-medium">{activeRecord.conceptionDate ? new Date(activeRecord.conceptionDate).toLocaleDateString() : '—'}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-sm text-gray-500">Baby size</p>
                  <p className="font-medium">{activeRecord.babySize || '—'}</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-sm text-gray-500">Estimated weight</p>
                  <p className="font-medium">{activeRecord.babyWeight || '—'}</p>
                </div>
              </div>

              {activeRecord.weeklyTips && activeRecord.weeklyTips.length > 0 && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-sm text-gray-500">Weekly tips</p>
                  <ul className="list-disc pl-5 mt-2">
                    {activeRecord.weeklyTips.map((t: string, i: number) => (
                      <li key={i} className="text-sm">{t}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeRecord.milestones && activeRecord.milestones.length > 0 && (
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-sm text-gray-500">Milestones</p>
                  <div className="mt-2 space-y-2">
                    {activeRecord.milestones.map((m: any, idx: number) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-pink-200 dark:bg-pink-800 rounded-full flex items-center justify-center font-bold">{m.week}</div>
                        <div>
                          <div className="font-medium">{m.milestone}</div>
                          <div className="text-xs text-gray-500">{m.date ? new Date(m.date).toLocaleDateString() : '—'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition"
                >
                  Edit
                </button>

                <button
                  onClick={async () => {
                    if (!activeRecord || !activeRecord._id) return;
                    if (!confirm('Archive this pregnancy? This will mark it inactive but keep the data.')) return;
                    try {
                      console.log('[Pregnancy] archivePregnancy: archiving', activeRecord._id);
                      setLoading(true);
                      await archivePregnancy(activeRecord._id);
                      console.log('[Pregnancy] archivePregnancy: archived', activeRecord._id);
                      setActiveRecord(null);
                      setGestationInfo(null);
                      setForm({ dueDate: '', babySize: '', babyWeight: '', weeklyTips: '', conceptionDate: '', milestonesJson: '' });
                    } catch (err: any) {
                      setError(err.message || String(err));
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                >
                  Archive
                </button>

                <button
                  onClick={async () => {
                    if (!activeRecord || !activeRecord._id) return;
                    if (!confirm('Delete this pregnancy record permanently? This cannot be undone.')) return;
                    try {
                      console.log('[Pregnancy] deletePregnancy: deleting', activeRecord._id);
                      setLoading(true);
                      await deletePregnancy(activeRecord._id);
                      console.log('[Pregnancy] deletePregnancy: deleted', activeRecord._id);
                      setActiveRecord(null);
                      setGestationInfo(null);
                      setForm({ dueDate: '', babySize: '', babyWeight: '', weeklyTips: '', conceptionDate: '', milestonesJson: '' });
                    } catch (err: any) {
                      setError(err.message || String(err));
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>

                <button
                  onClick={async () => {
                    try {
                      console.log('[Pregnancy] getActivePregnancy: refresh requested');
                      setLoading(true);
                      const p = await getActivePregnancy();
                      console.log('[Pregnancy] getActivePregnancy: refresh result', p);
                      setActiveRecord(p);
                      setGestationInfo(normalize(p));
                    } catch (err: any) {
                      setError(err.message || String(err));
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 transition"
                >
                  Refresh
                </button>
              </div>
            </div>
          ) : (
            // editing mode or no active record: show the form
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm">Due date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm((s) => ({ ...s, dueDate: e.target.value }))}
                    className="mt-1 w-full p-2 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-sm">Conception date</label>
                  <input
                    type="date"
                    value={form.conceptionDate}
                    onChange={(e) => setForm((s) => ({ ...s, conceptionDate: e.target.value }))}
                    className="mt-1 w-full p-2 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-sm">Baby size</label>
                  <input
                    value={form.babySize}
                    onChange={(e) => setForm((s) => ({ ...s, babySize: e.target.value }))}
                    className="mt-1 w-full p-2 rounded border"
                  />
                </div>
                <div>
                  <label className="block text-sm">Estimated weight</label>
                  <input
                    value={form.babyWeight}
                    onChange={(e) => setForm((s) => ({ ...s, babyWeight: e.target.value }))}
                    className="mt-1 w-full p-2 rounded border"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm">Weekly tips (one per line)</label>
                  <textarea
                    rows={3}
                    value={form.weeklyTips}
                    onChange={(e) => setForm((s) => ({ ...s, weeklyTips: e.target.value }))}
                    className="mt-1 w-full p-2 rounded border"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm">Milestones (JSON array of {'{ week, milestone, date }'})</label>
                  <textarea
                    rows={6}
                    value={form.milestonesJson}
                    onChange={(e) => setForm((s) => ({ ...s, milestonesJson: e.target.value }))}
                    className="mt-1 w-full p-2 rounded border font-mono text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={async () => {
                    setLoading(true);
                    setError(null);
                    try {
                      // build payload
                      const payload: any = {
                        dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
                        babySize: form.babySize || undefined,
                        babyWeight: form.babyWeight || undefined,
                        weeklyTips: form.weeklyTips ? form.weeklyTips.split(/\r?\n/).map((s) => s.trim()).filter(Boolean) : undefined,
                        conceptionDate: form.conceptionDate ? new Date(form.conceptionDate).toISOString() : undefined,
                      };
                      // parse milestones JSON if provided
                      if (form.milestonesJson) {
                        try {
                          const arr = JSON.parse(form.milestonesJson);
                          payload.milestones = Array.isArray(arr)
                            ? arr.map((m: any) => ({ ...m, date: m.date ? new Date(m.date).toISOString() : undefined }))
                            : undefined;
                        } catch (e) {
                          throw new Error('Invalid milestones JSON');
                        }
                      }

                      let res: any;
                      if (activeRecord && activeRecord._id) {
                        console.log('[Pregnancy] updatePregnancy: updating', activeRecord._id, payload);
                        res = await updatePregnancy(activeRecord._id, payload);
                        console.log('[Pregnancy] updatePregnancy: result', res);
                      } else {
                        console.log('[Pregnancy] createPregnancy: creating', payload);
                        res = await createPregnancy(payload);
                        console.log('[Pregnancy] createPregnancy: result', res);
                      }
                      setActiveRecord(res);
                      setGestationInfo(normalize(res));
                      setEditing(false);
                    } catch (err: any) {
                      setError(err.message || String(err));
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
                >
                  {activeRecord ? 'Save changes' : 'Create pregnancy'}
                </button>

                <button
                  onClick={() => {
                    // cancel edits and restore form from activeRecord
                    if (activeRecord) {
                      setForm({
                        dueDate: activeRecord.dueDate ? activeRecord.dueDate.split('T')[0] : '',
                        babySize: activeRecord.babySize || '',
                        babyWeight: activeRecord.babyWeight || '',
                        weeklyTips: (activeRecord.weeklyTips || []).join('\n'),
                        conceptionDate: activeRecord.conceptionDate ? activeRecord.conceptionDate.split('T')[0] : '',
                        milestonesJson: JSON.stringify(activeRecord.milestones || [], null, 2),
                      });
                      setEditing(false);
                    } else {
                      // clear when creating new and cancel
                      setForm({ dueDate: '', babySize: '', babyWeight: '', weeklyTips: '', conceptionDate: '', milestonesJson: '' });
                      setEditing(false);
                    }
                  }}
                  className="px-3 py-2 rounded border"
                >
                  Cancel
                </button>

                {activeRecord && (
                  <>
                    <button
                      onClick={async () => {
                        // quick archive from edit view
                        if (!activeRecord || !activeRecord._id) return;
                        if (!confirm('Archive this pregnancy? This will mark it inactive but keep the data.')) return;
                        try {
                          console.log('[Pregnancy] archivePregnancy: archiving', activeRecord._id);
                          setLoading(true);
                          await archivePregnancy(activeRecord._id);
                          console.log('[Pregnancy] archivePregnancy: archived', activeRecord._id);
                          setActiveRecord(null);
                          setGestationInfo(null);
                          setForm({ dueDate: '', babySize: '', babyWeight: '', weeklyTips: '', conceptionDate: '', milestonesJson: '' });
                        } catch (err: any) {
                          setError(err.message || String(err));
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                    >
                      Archive
                    </button>

                    <button
                      onClick={async () => {
                        // quick delete from edit view
                        if (!activeRecord || !activeRecord._id) return;
                        if (!confirm('Delete this pregnancy record permanently? This cannot be undone.')) return;
                        try {
                          console.log('[Pregnancy] deletePregnancy: deleting', activeRecord._id);
                          setLoading(true);
                          await deletePregnancy(activeRecord._id);
                          console.log('[Pregnancy] deletePregnancy: deleted', activeRecord._id);
                          setActiveRecord(null);
                          setGestationInfo(null);
                          setForm({ dueDate: '', babySize: '', babyWeight: '', weeklyTips: '', conceptionDate: '', milestonesJson: '' });
                        } catch (err: any) {
                          setError(err.message || String(err));
                        } finally {
                          setLoading(false);
                        }
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>

              {error && <p className="text-red-500 mt-3">{error}</p>}
              {loading && <p className="text-sm text-gray-500 mt-2">Saving...</p>}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto">
      {gestationInfo ? (
        renderPregnancyTracker()
      ) : (
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg p-8">
          <Baby
            size={64}
            className="mx-auto mb-4 text-gray-400"
          />
          <h3 className="text-xl font-semibold mb-2">
            No Pregnancy Data
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Enable pregnancy tracking in the calculator
            to view milestones and progress.
          </p>
          <button
            onClick={() => setCurrentView("calculator")}
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
          >
            Go to Calculator
          </button>
        </div>
      )}
    </div>
  );
};

export default Pregnancy
