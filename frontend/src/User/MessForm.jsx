// src/User/MessForm.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  MESSES,
  isFormOpen,
  daysUntilFormOpen,
  getNextMonthKey,
  getUserAllocation,
  submitMessPreference,
} from "../services/messService";

// ── Hardcoded fake filled counts ────────────────────────────────────────────
const FAKE_FILLED = {
  mess1: 150, mess2: 134, mess3: 120,
  mess4: 98,  mess5: 90,  mess6: 100,
};

// ── Processing overlay ──────────────────────────────────────────────────────
function ProcessingOverlay({ step }) {
  const steps = [
    "Submitting your preferences...",
    "Checking your 1st choice...",
    "Processing first-come-first-serve...",
    "Finalising your allocation...",
  ];
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-6 w-80 shadow-2xl">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#5352ed] animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800 text-lg">Processing</p>
          <p className="text-gray-500 text-sm mt-1 min-h-[40px]">
            {steps[Math.min(step, steps.length - 1)]}
          </p>
        </div>
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full transition-all duration-500 ${i <= step ? "bg-[#5352ed]" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Allocation result ───────────────────────────────────────────────────────
function AllocationResult({ allocation, monthName }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-10">
      <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">Mess Allocated!</p>
        <p className="text-gray-500 mt-1">Your current mess is</p>
      </div>
      <div className="bg-[#5352ed] text-white rounded-2xl px-10 py-6 text-center shadow-lg">
        <p className="text-3xl font-bold">{allocation.messName}</p>
        <p className="text-indigo-200 text-sm mt-1">Allocated on first-come-first-serve basis</p>
      </div>
      {allocation.submittedAt && (
        <p className="text-xs text-gray-400">
          Submitted at {allocation.submittedAt?.toDate
            ? allocation.submittedAt.toDate().toLocaleString() : "—"}
        </p>
      )}
    </div>
  );
}

// ── Guest info card ─────────────────────────────────────────────────────────
function GuestMessCard({ capacities }) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">👤 Guest Access</p>
        <p>
          As a guest you can view available messes and visit any with available seats.
          Please <span className="font-semibold">pay directly at the mess counter</span> before your meal.
          No prior booking required — just walk in if seats are available!
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {capacities.map((mess) => {
          const percent = Math.round((mess.filled / mess.capacity) * 100);
          const isFull  = mess.filled >= mess.capacity;
          return (
            <div key={mess.id} className={`rounded-xl p-4 border-2 flex flex-col gap-2
              ${isFull ? "border-gray-200 bg-gray-50 opacity-60" : "border-gray-200 bg-white"}`}>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{mess.name}</span>
                {isFull
                  ? <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Full</span>
                  : <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">{mess.capacity - mess.filled} left</span>
                }
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className={`h-2 rounded-full ${percent >= 90 ? "bg-red-400" : percent >= 60 ? "bg-yellow-400" : "bg-green-400"}`}
                  style={{ width: `${percent}%` }} />
              </div>
              {/* filled count shown */}
              <div className="text-xs text-gray-500">{mess.filled} / {mess.capacity} filled</div>
              {!isFull && <div className="text-xs text-green-600 font-medium">✓ Walk-in available</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Priority ranker ─────────────────────────────────────────────────────────
function PriorityRanker({ capacities, priorities, setPriorities }) {
  const moveUp   = (i) => { if (i === 0) return; const p = [...priorities]; [p[i-1], p[i]] = [p[i], p[i-1]]; setPriorities(p); };
  const moveDown = (i) => { if (i === priorities.length - 1) return; const p = [...priorities]; [p[i], p[i+1]] = [p[i+1], p[i]]; setPriorities(p); };

  const MEDAL       = ["1st", "2nd", "3rd", "4th", "5th", "6th"];
  const MEDAL_COLOR = [
    "bg-yellow-100 text-yellow-700 border-yellow-200",
    "bg-gray-100 text-gray-600 border-gray-200",
    "bg-orange-100 text-orange-600 border-orange-200",
    "bg-slate-50 text-slate-500 border-slate-200",
    "bg-slate-50 text-slate-500 border-slate-200",
    "bg-slate-50 text-slate-500 border-slate-200",
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 mb-3">
        Rank your preferences. We'll allocate your highest available choice.
      </p>
      {priorities.map((messId, i) => {
        const mess   = capacities.find((m) => m.id === messId);
        const isFull = mess?.filled >= mess?.capacity;
        return (
          <div key={messId}
            className={`flex items-center gap-3 p-3 rounded-xl border transition
              ${isFull ? "opacity-50 bg-gray-50 border-gray-200" : "bg-white border-gray-200 hover:border-indigo-200"}`}>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${MEDAL_COLOR[i]}`}>
              {MEDAL[i]}
            </span>
            <div className="flex-1">
              <span className="font-medium text-gray-800 text-sm">{mess?.name}</span>
              {/* filled count shown in ranker too */}
              <span className="ml-2 text-xs text-gray-400">{mess?.filled} / {mess?.capacity} filled</span>
            </div>
            {isFull && <span className="text-xs text-red-400">Full</span>}
            <div className="flex flex-col gap-0.5">
              <button onClick={() => moveUp(i)}   disabled={i === 0}
                className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none">▲</button>
              <button onClick={() => moveDown(i)} disabled={i === priorities.length - 1}
                className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none">▼</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────
function MessForm() {
  const { user, userType } = useAuth();
  const isGuest = userType === "guest";

  const [capacities] = useState(
    MESSES.map((m) => ({ ...m, filled: FAKE_FILLED[m.id] ?? 0 }))
  );
  const [priorities,  setPriorities]  = useState(MESSES.map((m) => m.id));
  const [existing,    setExisting]    = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [submitting,  setSubmitting]  = useState(false);
  const [overlayStep, setOverlayStep] = useState(0);
  const [error,       setError]       = useState(null);

  const monthKey     = getNextMonthKey();
  const formOpen     = isFormOpen();
  const daysLeft     = daysUntilFormOpen();

  const nextMonthName = new Date(
    new Date().getFullYear(), new Date().getMonth() + 1, 1
  ).toLocaleString("default", { month: "long", year: "numeric" });

  useEffect(() => {
    const check = async () => {
      setLoading(true);
      try {
        // Only check allocation for non-guest students
        // Hardcoded students (Bhumika/Harshit) return instantly from the map
        if (user && !isGuest) {
          const alloc = await getUserAllocation(user.uid, monthKey);
          setExisting(alloc);
        }
      } catch (e) {
        console.error("Allocation check failed:", e);
        // Don't block the form from showing on error
      } finally {
        setLoading(false);
      }
    };
    check();
  }, [user, monthKey, isGuest]);

  const handleSubmit = async () => {
    if (!formOpen || isGuest) return;
    setError(null);
    setSubmitting(true);
    setOverlayStep(0);

    const stepTimer = setInterval(() => {
      setOverlayStep((s) => (s < 3 ? s + 1 : s));
    }, 700);

    try {
      await submitMessPreference(user, priorities, monthKey);
      clearInterval(stepTimer);
      setOverlayStep(3);
      await new Promise((r) => setTimeout(r, 600));
      const alloc = await getUserAllocation(user.uid, monthKey);
      setExisting(alloc);
    } catch (e) {
      clearInterval(stepTimer);
      setError(e.message);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-10">
        <div className="animate-pulse text-gray-400 text-lg">Loading mess data...</div>
      </div>
    );
  }

  return (
    <>
      {submitting && <ProcessingOverlay step={overlayStep} />}

      <div className="p-6 max-w-2xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mess Allocation</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isGuest
              ? "View available messes and walk in directly."
              : existing
              ? `Your current mess for ${nextMonthName}`
              : formOpen
              ? `Form is open for ${nextMonthName}. Rank your mess preferences.`
              : `Form for ${nextMonthName} opens in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}. You can set your preferences now.`}
          </p>
        </div>

        {/* Guest view */}
        {isGuest && <GuestMessCard capacities={capacities} />}

        {/* Student — already allocated: show result + option to view form below */}
        {!isGuest && existing && (
          <>
            <AllocationResult allocation={existing} monthName={nextMonthName} />

            {/* Still show seat availability below for reference */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Current Seat Availability
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {capacities.map((mess) => {
                  const percent = Math.round((mess.filled / mess.capacity) * 100);
                  const isFull  = mess.filled >= mess.capacity;
                  return (
                    <div key={mess.id} className={`rounded-xl p-3 border flex flex-col gap-1.5
                      ${isFull ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-gray-200"}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800 text-sm">{mess.name}</span>
                        {isFull
                          ? <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Full</span>
                          : <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">{mess.capacity - mess.filled} left</span>
                        }
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${percent >= 90 ? "bg-red-400" : percent >= 60 ? "bg-yellow-400" : "bg-green-400"}`}
                          style={{ width: `${percent}%` }} />
                      </div>
                      <div className="text-xs text-gray-400">{mess.filled} / {mess.capacity} filled</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Student — no allocation yet: show full form */}
        {!isGuest && !existing && (
          <>
            {/* Form closed banner */}
            {!formOpen && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-sm text-indigo-700 flex items-center gap-3">
                <span className="text-2xl">🗓️</span>
                <div>
                  <p className="font-semibold">Form opens in {daysLeft} day{daysLeft !== 1 ? "s" : ""}</p>
                  <p className="opacity-80">You can rank your preferences now — submission unlocks when the form opens.</p>
                </div>
              </div>
            )}

            {/* Seat availability */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Seat Availability</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {capacities.map((mess) => {
                  const percent = Math.round((mess.filled / mess.capacity) * 100);
                  const isFull  = mess.filled >= mess.capacity;
                  return (
                    <div key={mess.id} className={`rounded-xl p-3 border flex flex-col gap-1.5
                      ${isFull ? "bg-gray-50 border-gray-200 opacity-60" : "bg-white border-gray-200"}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800 text-sm">{mess.name}</span>
                        {isFull
                          ? <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Full</span>
                          : <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">{mess.capacity - mess.filled} left</span>
                        }
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${percent >= 90 ? "bg-red-400" : percent >= 60 ? "bg-yellow-400" : "bg-green-400"}`}
                          style={{ width: `${percent}%` }} />
                      </div>
                      <div className="text-xs text-gray-400">{mess.filled} / {mess.capacity} filled</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Priority ranker */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Your Preference Order</p>
              <PriorityRanker
                capacities={capacities}
                priorities={priorities}
                setPriorities={setPriorities}
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">{error}</div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!formOpen || submitting}
              className={`w-full py-3 rounded-xl font-semibold transition text-white
                ${formOpen ? "bg-[#5352ed] hover:bg-indigo-600 cursor-pointer" : "bg-gray-300 cursor-not-allowed"}`}
            >
              {formOpen
                ? `Submit Preferences — 1st choice: ${MESSES.find(m => m.id === priorities[0])?.name}`
                : `Submission opens in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}
            </button>
          </>
        )}

      </div>
    </>
  );
}

export default MessForm;