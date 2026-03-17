// src/User/Onboarding.jsx
import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import { MESSES } from "../services/messService";

function Onboarding({ onComplete }) {
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        currentMess: selected,
        onboardingDone: true,
      });
      onComplete(); // tell Dashboard we're done
    } catch (e) {
      setError("Failed to save. Please try again.");
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-6">

        {/* Header */}
        <div className="text-center">
          <div className="text-4xl mb-3">👋</div>
          <h2 className="text-2xl font-bold text-gray-800">Welcome to Mess Diary!</h2>
          <p className="text-gray-500 text-sm mt-2">
            Before we get started, which mess are you currently enrolled in?
          </p>
        </div>

        {/* Mess options */}
        <div className="grid grid-cols-2 gap-3">
          {MESSES.map((mess) => (
            <div
              key={mess.id}
              onClick={() => setSelected(mess.name)}
              className={`rounded-xl border-2 px-4 py-3 cursor-pointer text-center transition-all duration-200
                ${selected === mess.name
                  ? "border-[#5352ed] bg-indigo-50 text-[#5352ed] font-semibold scale-[1.02] shadow"
                  : "border-gray-200 text-gray-700 hover:border-[#5352ed] hover:shadow"
                }`}
            >
              {mess.name}
            </div>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!selected || saving}
          className="bg-[#5352ed] text-white py-3 rounded-xl font-semibold hover:bg-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Saving..." : selected ? `Continue with ${selected}` : "Select a mess to continue"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          You can update this later from your profile.
        </p>
      </div>
    </div>
  );
}

export default Onboarding;