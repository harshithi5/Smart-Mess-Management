// src/Admin/AdminComplaints.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, onSnapshot } from "firebase/firestore";

const CATEGORIES = {
  food_quality: { label: "Food Quality", emoji: "🍽️" },
  hygiene:      { label: "Hygiene",      emoji: "🧹" },
  service:      { label: "Service",      emoji: "👨‍🍳" },
  quantity:     { label: "Quantity",     emoji: "⚖️" },
  timing:       { label: "Timing",       emoji: "⏰" },
  other:        { label: "Other",        emoji: "📝" },
};

const MESS_COLORS = {
  mess1: "bg-orange-100 text-orange-700",
  mess2: "bg-blue-100 text-blue-700",
  mess3: "bg-emerald-100 text-emerald-700",
  mess4: "bg-violet-100 text-violet-700",
  mess5: "bg-rose-100 text-rose-700",
  mess6: "bg-amber-100 text-amber-700",
};

function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [filter,     setFilter]     = useState("all");    // "all"|"pending"|"resolved"|"overdue"
  const [messFilter, setMessFilter] = useState("all");
  const [expanded,   setExpanded]   = useState(null);

  useEffect(() => {
    const q = query(collection(db, "complaints"));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setComplaints(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const getDaysOld = (createdAt) => {
    if (!createdAt?.toDate) return 0;
    return Math.floor((Date.now() - createdAt.toDate()) / (1000 * 60 * 60 * 24));
  };

  const pendingList  = complaints.filter(c => c.status === "pending");
  const resolvedList = complaints.filter(c => c.status === "resolved");
  const overdueList  = complaints.filter(c => c.status === "pending" && getDaysOld(c.createdAt) >= 7);

  // Get unique messes from complaints
  const messesPresent = [...new Set(complaints.map(c => c.messId))];

  const filtered = complaints.filter((c) => {
    const daysOld = getDaysOld(c.createdAt);
    const statusOk =
      filter === "all"      ? true :
      filter === "pending"  ? c.status === "pending" :
      filter === "resolved" ? c.status === "resolved" :
      filter === "overdue"  ? (c.status === "pending" && daysOld >= 7) : true;
    const messOk = messFilter === "all" || c.messId === messFilter;
    return statusOk && messOk;
  });

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Student Complaints</h1>
        <p className="text-sm text-gray-400 mt-1">Full visibility across all messes — student details visible to admin only</p>
      </div>

      {/* Overdue alert banner */}
      {overdueList.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
          <span className="text-2xl">🚨</span>
          <div>
            <p className="font-semibold text-red-700">
              {overdueList.length} complaint{overdueList.length !== 1 ? "s" : ""} pending for over 7 days
            </p>
            <p className="text-red-500 text-sm mt-0.5">
              {overdueList.map(c => c.messName).join(", ")} — action required
            </p>
            <button onClick={() => setFilter("overdue")}
              className="mt-2 text-xs text-red-600 underline font-medium">
              View overdue complaints →
            </button>
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total",    value: complaints.length,  color: "bg-gray-800",    key: "all" },
          { label: "Pending",  value: pendingList.length, color: "bg-yellow-500",  key: "pending" },
          { label: "Resolved", value: resolvedList.length,color: "bg-emerald-500", key: "resolved" },
          { label: "Overdue",  value: overdueList.length, color: "bg-red-500",     key: "overdue" },
        ].map((s) => (
          <button key={s.key} onClick={() => setFilter(s.key)}
            className={`${s.color} text-white rounded-2xl p-4 text-left transition hover:opacity-90
              ${filter === s.key ? "ring-2 ring-offset-2 ring-gray-400" : ""}`}>
            <div className="text-xs font-medium opacity-80">{s.label}</div>
            <div className="text-3xl font-bold mt-1">{s.value}</div>
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Filter by Mess:</span>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setMessFilter("all")}
            className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition
              ${messFilter === "all" ? "bg-gray-800 text-white border-gray-800" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
            All Messes
          </button>
          {messesPresent.map((mId) => {
            const name = complaints.find(c => c.messId === mId)?.messName || mId;
            return (
              <button key={mId} onClick={() => setMessFilter(mId)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition
                  ${messFilter === mId
                    ? "bg-gray-800 text-white border-gray-800"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                {name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Complaints list */}
      {loading && (
        <div className="space-y-3 animate-pulse">
          {[1,2,3].map(i => <div key={i} className="h-28 bg-gray-200 rounded-2xl" />)}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-12">No complaints match this filter.</p>
      )}

      {!loading && filtered.map((c) => {
        const daysOld   = getDaysOld(c.createdAt);
        const isOverdue = c.status === "pending" && daysOld >= 7;
        const cat       = CATEGORIES[c.category];
        const isExpanded= expanded === c.id;

        return (
          <div key={c.id}
            className={`bg-white rounded-2xl border shadow-sm overflow-hidden
              ${isOverdue ? "border-red-200" : "border-gray-100"}`}>

            {/* Complaint header — always visible */}
            <div className="p-5 cursor-pointer" onClick={() => setExpanded(isExpanded ? null : c.id)}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg">{cat?.emoji}</span>
                  <span className="font-semibold text-gray-800 text-sm">{cat?.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${MESS_COLORS[c.messId] || "bg-gray-100 text-gray-600"}`}>
                    {c.messName}
                  </span>
                  {isOverdue && <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">⚠️ Overdue</span>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {c.status === "pending"
                    ? <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Pending</span>
                    : <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600">✓ Resolved</span>}
                  <span className="text-gray-400 text-xs">{isExpanded ? "▲" : "▼"}</span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{c.text}</p>

              <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                <span>
                  {c.createdAt?.toDate
                    ? c.createdAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "—"}
                  {c.status === "pending" && ` · ${daysOld} day${daysOld !== 1 ? "s" : ""} ago`}
                </span>
                <span className="font-mono bg-gray-100 rounded px-1.5 py-0.5">{c.anonToken}</span>
              </div>
            </div>

            {/* Expanded details — admin sees student info */}
            {isExpanded && (
              <div className="border-t border-gray-100 p-5 bg-gray-50 space-y-4">

                {/* Full complaint text */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Complaint</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{c.text}</p>
                </div>

                {/* Photo */}
                {c.photoURL && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Photo</p>
                    <img src={c.photoURL} alt="complaint" className="w-full max-w-sm h-40 object-cover rounded-xl border border-gray-200" />
                  </div>
                )}

                {/* Student info — admin only */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">🔒 Student Info (Admin Only)</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">Email:</span> {c.studentEmail}</p>
                </div>

                {/* Resolution info */}
                {c.status === "resolved" && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">
                    ✅ Marked resolved by student on{" "}
                    {c.resolvedAt?.toDate
                      ? c.resolvedAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default AdminComplaints;