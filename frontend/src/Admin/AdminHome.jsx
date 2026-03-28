// src/Admin/AdminHome.jsx
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

// ── Dummy fallback data ──────────────────────────────────────────────────────
const MESSES = ["Mess 1", "Mess 2", "Mess 3 (Alder)", "Mess 4", "Mess 5"];

const dummyRatings = [
  { mess: "Mess 1", rating: 3.8 },
  { mess: "Mess 2", rating: 4.2 },
  { mess: "Mess 3", rating: 3.5 },
  { mess: "Mess 4", rating: 4.6 },
  { mess: "Mess 5", rating: 4.0 },
];

const dummyWastage = [
  { week: "Week 1", "Mess 1": 12, "Mess 2": 8,  "Mess 3": 15, "Mess 4": 6,  "Mess 5": 10 },
  { week: "Week 2", "Mess 1": 10, "Mess 2": 11, "Mess 3": 13, "Mess 4": 7,  "Mess 5": 9  },
  { week: "Week 3", "Mess 1": 8,  "Mess 2": 9,  "Mess 3": 10, "Mess 4": 5,  "Mess 5": 7  },
  { week: "Week 4", "Mess 1": 14, "Mess 2": 7,  "Mess 3": 12, "Mess 4": 8,  "Mess 5": 11 },
];

const dummyComplaints = [
  { mess: "Mess 1", count: 4 },
  { mess: "Mess 2", count: 2 },
  { mess: "Mess 3", count: 7 },
  { mess: "Mess 4", count: 1 },
  { mess: "Mess 5", count: 3 },
];

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, color }) {
  return (
    <div className={`rounded-2xl p-5 text-white flex flex-col gap-1 ${color}`}>
      <div className="text-sm font-medium opacity-80">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
      {sub && <div className="text-xs opacity-70">{sub}</div>}
    </div>
  );
}

// ── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-base font-semibold text-gray-700 mb-4">{title}</h2>
      {children}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
function AdminHome() {
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);

  useEffect(() => {
    // Try to load real complaints from Firestore; fall back to dummy
    getDocs(collection(db, "complaints"))
      .then((snap) => {
        if (snap.empty) {
          setComplaints(dummyComplaints);
        } else {
          // Aggregate by mess
          const counts = {};
          snap.docs.forEach((d) => {
            const m = d.data().messName || "Unknown";
            counts[m] = (counts[m] || 0) + 1;
          });
          setComplaints(Object.entries(counts).map(([mess, count]) => ({ mess, count })));
        }
      })
      .catch(() => setComplaints(dummyComplaints))
      .finally(() => setLoadingComplaints(false));
  }, []);

  const totalComplaints = complaints.reduce((s, c) => s + c.count, 0);
  const avgRating = (dummyRatings.reduce((s, r) => s + r.rating, 0) / dummyRatings.length).toFixed(1);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Overview</h1>
        <p className="text-sm text-gray-400 mt-1">All messes at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg Rating"      value={avgRating + " ★"} sub="Across all messes"  color="bg-orange-400" />
        <StatCard label="Total Complaints" value={totalComplaints}  sub="This month"          color="bg-rose-400"   />
        <StatCard label="Messes"           value="5"               sub="Active"               color="bg-violet-500" />
        <StatCard label="Notifications"    value="12"              sub="Sent this week"        color="bg-sky-500"    />
      </div>

      {/* Ratings bar chart */}
      <Section title="⭐ Average Mess Ratings">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dummyRatings} barSize={36}>
            <XAxis dataKey="mess" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => [v + " / 5", "Rating"]} />
            <Bar dataKey="rating" radius={[8, 8, 0, 0]}>
              {dummyRatings.map((_, i) => (
                <rect key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Wastage line chart */}
      <Section title="🍽️ Food Wastage Trend (kg/week)">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={dummyWastage}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {["Mess 1", "Mess 2", "Mess 3", "Mess 4", "Mess 5"].map((m, i) => (
              <Line key={m} type="monotone" dataKey={m} stroke={COLORS[i]} strokeWidth={2} dot={false} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </Section>

      {/* Complaints bar chart */}
      <Section title="📋 Complaints by Mess">
        {loadingComplaints ? (
          <div className="h-40 animate-pulse bg-gray-100 rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={complaints} barSize={36}>
              <XAxis dataKey="mess" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#f43f5e" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Section>

    </div>
  );
}

export default AdminHome;