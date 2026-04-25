// src/Vendor/VendorComplaints.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useVendorAuth } from "../context/VendorAuthContext";

const CATEGORIES = {
  food_quality: { label: "Food Quality", emoji: "🍽️" },
  hygiene:      { label: "Hygiene",      emoji: "🧹" },
  service:      { label: "Service",      emoji: "👨‍🍳" },
  quantity:     { label: "Quantity",     emoji: "⚖️" },
  timing:       { label: "Timing",       emoji: "⏰" },
  other:        { label: "Other",        emoji: "📝" },
};

function VendorComplaints() {
  const { vendorMess } = useVendorAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState("pending"); // "pending" | "resolved" | "all"

  useEffect(() => {
    if (!vendorMess) return;

    const q = query(
      collection(db, "complaints"),
      where("messId", "==", vendorMess.messId)
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setComplaints(data);
      setLoading(false);
    });
    return () => unsub();
  }, [vendorMess]);

  const getDaysOld = (createdAt) => {
    if (!createdAt?.toDate) return 0;
    return Math.floor((Date.now() - createdAt.toDate()) / (1000 * 60 * 60 * 24));
  };

  const filtered = complaints.filter((c) => {
    if (filter === "all")      return true;
    if (filter === "pending")  return c.status === "pending";
    if (filter === "resolved") return c.status === "resolved";
    return true;
  });

  const pendingCount  = complaints.filter(c => c.status === "pending").length;
  const resolvedCount = complaints.filter(c => c.status === "resolved").length;
  const overdueCount  = complaints.filter(c => c.status === "pending" && getDaysOld(c.createdAt) >= 7).length;

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Complaints</h1>
        <p className="text-sm text-gray-400 mt-1">
          {vendorMess?.messName} · Student identities are hidden
        </p>
      </div>

      {/* Stat chips */}
      <div className="flex gap-3 flex-wrap">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-2 text-sm">
          <span className="font-bold text-yellow-700">{pendingCount}</span>
          <span className="text-yellow-600 ml-1">Pending</span>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2 text-sm">
          <span className="font-bold text-green-700">{resolvedCount}</span>
          <span className="text-green-600 ml-1">Resolved</span>
        </div>
        {overdueCount > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm">
            <span className="font-bold text-red-600">{overdueCount}</span>
            <span className="text-red-500 ml-1">⚠️ Overdue (&gt;7 days)</span>
          </div>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit">
        {[["pending", "Pending"], ["resolved", "Resolved"], ["all", "All"]].map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
              ${filter === key ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Complaints list */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-12">
          {filter === "pending" ? "No pending complaints 🎉" : "No complaints here."}
        </p>
      )}

      {!loading && filtered.map((c) => {
        const daysOld  = getDaysOld(c.createdAt);
        const isOverdue = c.status === "pending" && daysOld >= 7;
        const cat = CATEGORIES[c.category];

        return (
          <div key={c.id}
            className={`bg-white rounded-2xl border shadow-sm p-5 space-y-3
              ${isOverdue ? "border-red-200" : "border-gray-100"}`}>

            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">{cat?.emoji}</span>
                <span className="font-semibold text-gray-800 text-sm">{cat?.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {isOverdue && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">⚠️ Overdue</span>}
                {c.status === "pending"
                  ? <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                  : <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600">✓ Resolved</span>}
              </div>
            </div>

            <p className="text-sm text-gray-700 leading-relaxed">{c.text}</p>

            {c.photoURL && (
              <img src={c.photoURL} alt="complaint" className="w-full max-w-xs h-32 object-cover rounded-xl border border-gray-200" />
            )}

            {/* Anonymous ID + date — NO student name/email/roll */}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="bg-gray-100 rounded-lg px-2 py-0.5 font-mono">{c.anonToken}</span>
              <span>
                {c.createdAt?.toDate
                  ? c.createdAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                  : "Just now"}
                {c.status === "pending" && ` · ${daysOld}d ago`}
              </span>
            </div>

            {/* Vendor cannot resolve — only student can */}
            {c.status === "pending" && (
              <p className="text-xs text-gray-400 italic text-center">
                The student will mark this as resolved once satisfied.
              </p>
            )}
            {c.status === "resolved" && (
              <p className="text-xs text-green-500 text-center">
                Marked resolved by student on{" "}
                {c.resolvedAt?.toDate
                  ? c.resolvedAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                  : "—"}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default VendorComplaints;