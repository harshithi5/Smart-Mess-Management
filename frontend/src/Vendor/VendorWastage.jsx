// src/Vendor/VendorWastage.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  doc, getDoc, setDoc, collection, query,
  where, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { useVendorAuth } from "../context/VendorAuthContext";

const MEALS = [
  { id: "breakfast", label: "Breakfast", icon: "🌅", time: "7:30 – 9:30 AM" },
  { id: "lunch",     label: "Lunch",     icon: "☀️", time: "12:00 – 2:00 PM" },
  { id: "dinner",    label: "Dinner",    icon: "🌙", time: "7:30 – 9:30 PM" },
];

// Format date as "2026-04-29"
const toDateKey = (date) => date.toISOString().split("T")[0];

// Format display date
const formatDate = (dateKey) => {
  const d = new Date(dateKey + "T00:00:00");
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
};

function VendorWastage() {
  const { vendorMess } = useVendorAuth();
  const today      = toDateKey(new Date());
  const [values,   setValues]   = useState({ breakfast: "", lunch: "", dinner: "" });
  const [saved,    setSaved]    = useState({ breakfast: false, lunch: false, dinner: false });
  const [existing, setExisting] = useState(null); // today's doc if already submitted
  const [saving,   setSaving]   = useState(false);
  const [history,  setHistory]  = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load today's wastage if already logged
  useEffect(() => {
    if (!vendorMess) return;
    async function load() {
      const snap = await getDoc(doc(db, "wastage", `${vendorMess.messId}_${today}`));
      if (snap.exists()) setExisting(snap.data());
    }
    load();
  }, [vendorMess, today]);

  // Load past 14 days of wastage history
  useEffect(() => {
    if (!vendorMess) return;
    const q = query(
      collection(db, "wastage"),
      where("messId", "==", vendorMess.messId)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
        .slice(0, 14);
      setHistory(data);
      setLoadingHistory(false);
    });
    return () => unsub();
  }, [vendorMess]);

  const handleSave = async () => {
    const breakfast = parseFloat(values.breakfast) || 0;
    const lunch     = parseFloat(values.lunch)     || 0;
    const dinner    = parseFloat(values.dinner)    || 0;

    if (breakfast === 0 && lunch === 0 && dinner === 0) return;
    setSaving(true);

    try {
      const total = +(breakfast + lunch + dinner).toFixed(2);
      await setDoc(doc(db, "wastage", `${vendorMess.messId}_${today}`), {
        messId:    vendorMess.messId,
        messName:  vendorMess.messName,
        dateKey:   today,
        breakfast,
        lunch,
        dinner,
        total,
        loggedAt:  serverTimestamp(),
      });
      setExisting({ breakfast, lunch, dinner, total, dateKey: today });
      setValues({ breakfast: "", lunch: "", dinner: "" });
      setSaved({ breakfast: true, lunch: true, dinner: true });
      setTimeout(() => setSaved({ breakfast: false, lunch: false, dinner: false }), 3000);
    } catch (err) {
      console.error("Failed to save wastage:", err);
    } finally {
      setSaving(false);
    }
  };

  const totalToday = existing
    ? existing.total
    : [values.breakfast, values.lunch, values.dinner]
        .map(v => parseFloat(v) || 0)
        .reduce((a, b) => a + b, 0);

  const weekTotal = history
    .filter(h => {
      const d = new Date(h.dateKey + "T00:00:00");
      const now = new Date();
      return (now - d) / 86400000 <= 7;
    })
    .reduce((sum, h) => sum + (h.total || 0), 0);

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Food Wastage Log</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          {vendorMess?.messName} · Log today's wastage per meal
        </p>
      </div>

      {/* Stat chips */}
      <div className="flex gap-3 flex-wrap">
        <div className="bg-rose-50 border border-rose-100 rounded-2xl px-4 py-3 flex flex-col">
          <span className="text-xs text-rose-400 font-semibold">Today's Total</span>
          <span className="text-2xl font-black text-rose-500">{totalToday.toFixed(1)} kg</span>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl px-4 py-3 flex flex-col">
          <span className="text-xs text-orange-400 font-semibold">This Week</span>
          <span className="text-2xl font-black text-orange-500">{weekTotal.toFixed(1)} kg</span>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 flex flex-col">
          <span className="text-xs text-green-500 font-semibold">Days Logged</span>
          <span className="text-2xl font-black text-green-600">{history.length}</span>
        </div>
      </div>

      {/* Today's log form */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-gray-800">
            {existing ? "✅ Today's wastage logged" : "Log Today's Wastage"}
          </p>
          <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
            {formatDate(today)}
          </span>
        </div>

        {/* Already logged — show read-only */}
        {existing ? (
          <div className="space-y-3">
            {MEALS.map((meal) => (
              <div key={meal.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meal.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{meal.label}</p>
                    <p className="text-xs text-gray-400">{meal.time}</p>
                  </div>
                </div>
                <span className="text-sm font-black text-gray-800">
                  {existing[meal.id]} kg
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="text-sm font-bold text-gray-600">Total</span>
              <span className="text-lg font-black text-rose-500">{existing.total} kg</span>
            </div>
            <button
              onClick={() => setExisting(null)}
              className="w-full py-2 rounded-xl border-2 border-dashed border-gray-200 text-xs text-gray-400 hover:border-gray-300 hover:text-gray-500 transition">
              ✏️ Edit today's entry
            </button>
          </div>
        ) : (
          /* Input form */
          <div className="space-y-3">
            {MEALS.map((meal) => (
              <div key={meal.id}
                className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl shrink-0">{meal.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-700">{meal.label}</p>
                  <p className="text-xs text-gray-400">{meal.time}</p>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={values[meal.id]}
                    onChange={(e) => setValues(v => ({ ...v, [meal.id]: e.target.value }))}
                    placeholder="0"
                    className="w-20 text-right border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                  />
                  <span className="text-xs text-gray-400 w-5">kg</span>
                </div>
              </div>
            ))}

            {/* Running total */}
            {totalToday > 0 && (
              <div className="flex justify-between items-center px-3 pt-2 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-600">Total</span>
                <span className="text-lg font-black text-rose-500">{totalToday.toFixed(1)} kg</span>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={totalToday === 0 || saving}
              className="w-full py-3 rounded-xl bg-orange-400 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm transition active:scale-95 flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Saving...
                </>
              ) : "Save Today's Wastage"}
            </button>
          </div>
        )}
      </div>

      {/* History */}
      <div className="space-y-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Past 14 Days</p>

        {loadingHistory && (
          <div className="space-y-2 animate-pulse">
            {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl" />)}
          </div>
        )}

        {!loadingHistory && history.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">No wastage logged yet.</div>
        )}

        {!loadingHistory && history.map((entry) => {
          const isToday = entry.dateKey === today;
          return (
            <div key={entry.id}
              className={`bg-white rounded-2xl border shadow-sm p-4 flex items-center gap-4
                ${isToday ? "border-orange-200" : "border-gray-100"}`}>

              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0
                ${isToday ? "bg-orange-50" : "bg-gray-50"}`}>
                🗂️
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-sm font-bold text-gray-800">{formatDate(entry.dateKey)}</p>
                  {isToday && <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full font-semibold">Today</span>}
                </div>
                <div className="flex gap-3 text-xs text-gray-400">
                  <span>🌅 {entry.breakfast}kg</span>
                  <span>☀️ {entry.lunch}kg</span>
                  <span>🌙 {entry.dinner}kg</span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-lg font-black text-rose-500">{entry.total} kg</p>
                <p className="text-xs text-gray-400">total</p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default VendorWastage;