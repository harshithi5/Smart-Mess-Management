// src/User/MessForm.jsx
import React, { useEffect, useState } from "react";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  MESSES,
  isFormOpen,
  getNextMonthKey,
  getUserAllocation,
  submitMessPreference,
} from "../services/messService";

// ── Fullscreen processing overlay ──────────────────────────────────────────
function ProcessingOverlay({ step }) {
  const steps = [
    "Submitting your preference...",
    "Checking available seats...",
    "Processing first-come-first-serve...",
    "Finalising your allocation...",
  ];
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-10 flex flex-col items-center gap-6 w-80 shadow-2xl">
        {/* Spinner */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-[#5352ed] animate-spin" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-gray-800 text-lg">Processing</p>
          <p className="text-gray-500 text-sm mt-1 min-h-[40px] transition-all">
            {steps[Math.min(step, steps.length - 1)]}
          </p>
        </div>
        {/* Step dots */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full transition-all duration-500 ${
                i <= step ? "bg-[#5352ed]" : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Allocation result card ──────────────────────────────────────────────────
function AllocationResult({ allocation, monthName }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-10 animate-fadeIn">
      {/* Success circle */}
      <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
        <svg className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">Mess Allocated!</p>
        <p className="text-gray-500 mt-1">Your mess for {monthName} is</p>
      </div>
      <div className="bg-[#5352ed] text-white rounded-2xl px-10 py-6 text-center shadow-lg">
        <p className="text-3xl font-bold">{allocation.messName}</p>
        <p className="text-indigo-200 text-sm mt-1">Allocated on first-come-first-serve basis</p>
      </div>
      <p className="text-xs text-gray-400">
        Submitted at{" "}
        {allocation.submittedAt?.toDate
          ? allocation.submittedAt.toDate().toLocaleString()
          : "just now"}
      </p>
    </div>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
function MessForm() {
  const { user } = useAuth();
  const [capacities, setCapacities] = useState(
    MESSES.map((m) => ({ ...m, filled: 0 }))
  );
  const [selected, setSelected] = useState(null);
  const [existing, setExisting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [overlayStep, setOverlayStep] = useState(0);
  const [error, setError] = useState(null);

  const monthKey = getNextMonthKey();
  const formOpen = isFormOpen();

  const nextMonthName = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1
  ).toLocaleString("default", { month: "long", year: "numeric" });

  // ── Live listener for all mess seat counts ──────────────────────────────
  useEffect(() => {
    const unsubs = MESSES.map((mess) => {
      const ref = doc(db, "messAllocations", monthKey, "messes", mess.id);
      return onSnapshot(ref, (snap) => {
        const filled = snap.exists() ? snap.data().filled || 0 : 0;
        setCapacities((prev) =>
          prev.map((m) => (m.id === mess.id ? { ...m, filled } : m))
        );
      });
    });
    return () => unsubs.forEach((u) => u());
  }, [monthKey]);

  // ── Check if user already submitted ────────────────────────────────────
  useEffect(() => {
    const check = async () => {
      setLoading(true);
      try {
        const alloc = await getUserAllocation(user.uid, monthKey);
        setExisting(alloc);
      } catch (e) {
        setError("Failed to load your allocation.");
      }
      setLoading(false);
    };
    if (user) check();
  }, [user, monthKey]);

  // ── Submit with animated step overlay ──────────────────────────────────
  const handleSubmit = async () => {
    if (!selected) return;
    setError(null);
    setSubmitting(true);
    setOverlayStep(0);

    // Animate through steps while processing
    const stepTimer = setInterval(() => {
      setOverlayStep((s) => (s < 3 ? s + 1 : s));
    }, 700);

    try {
      await submitMessPreference(user, selected, monthKey);
      clearInterval(stepTimer);
      setOverlayStep(3);
      // Small pause so user sees final step
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
      {/* Processing overlay */}
      {submitting && <ProcessingOverlay step={overlayStep} />}

      <div className="p-6 max-w-2xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mess Allocation</h1>
          <p className="text-gray-500 text-sm mt-1">
            {existing
              ? `Your allocation for ${nextMonthName}`
              : formOpen
              ? `Form is open for ${nextMonthName}. Select your preferred mess.`
              : `The form for ${nextMonthName} opens 3 days before month end.`}
          </p>
        </div>

        {/* Allocation result */}
        {existing ? (
          <AllocationResult allocation={existing} monthName={nextMonthName} />
        ) : (
          <>
            {/* Live capacity grid */}
            <div>
              <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                Live seat availability
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {capacities.map((mess) => {
                  const percent = Math.round((mess.filled / mess.capacity) * 100);
                  const isFull = mess.filled >= mess.capacity;
                  const isSelected = selected === mess.id;

                  return (
                    <div
                      key={mess.id}
                      onClick={() => {
                        if (formOpen && !isFull) setSelected(mess.id);
                      }}
                      className={`rounded-xl p-4 border-2 flex flex-col gap-2 transition-all duration-200
                        ${isSelected
                          ? "border-[#5352ed] bg-indigo-50 shadow-md scale-[1.02]"
                          : isFull
                          ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                          : formOpen
                          ? "border-gray-200 bg-white hover:border-[#5352ed] hover:shadow cursor-pointer"
                          : "border-gray-200 bg-white"
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-800">{mess.name}</span>
                        {isFull ? (
                          <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">Full</span>
                        ) : (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                            {mess.capacity - mess.filled} left
                          </span>
                        )}
                      </div>

                      {/* Animated progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            percent >= 90 ? "bg-red-400" :
                            percent >= 60 ? "bg-yellow-400" : "bg-green-400"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <div className="text-xs text-gray-500">
                        {mess.filled} / {mess.capacity} filled
                      </div>

                      {isSelected && (
                        <div className="text-xs text-[#5352ed] font-medium">✓ Selected</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            {formOpen && (
              <button
                onClick={handleSubmit}
                disabled={!selected || submitting}
                className="bg-[#5352ed] text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {selected
                  ? `Submit — ${capacities.find((m) => m.id === selected)?.name}`
                  : "Select a mess to continue"}
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default MessForm;