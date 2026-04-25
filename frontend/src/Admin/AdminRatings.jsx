// src/Admin/AdminRatings.jsx
import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";

const MESSES = ["Mess 1", "Mess 2", "Mess 3", "Mess 4", "Mess 5"];
const COLORS  = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];

// ── Fake weekly ratings (last 7 days, per mess) ──────────────────────────
const WEEKLY_TREND = [
  { day: "Mon", "Mess 1": 3.8, "Mess 2": 4.1, "Mess 3": 3.5, "Mess 4": 4.6, "Mess 5": 4.0 },
  { day: "Tue", "Mess 1": 4.0, "Mess 2": 3.9, "Mess 3": 3.7, "Mess 4": 4.4, "Mess 5": 4.2 },
  { day: "Wed", "Mess 1": 3.6, "Mess 2": 4.2, "Mess 3": 3.4, "Mess 4": 4.7, "Mess 5": 3.9 },
  { day: "Thu", "Mess 1": 4.1, "Mess 2": 4.0, "Mess 3": 3.9, "Mess 4": 4.5, "Mess 5": 4.1 },
  { day: "Fri", "Mess 1": 3.9, "Mess 2": 4.3, "Mess 3": 3.6, "Mess 4": 4.8, "Mess 5": 4.0 },
  { day: "Sat", "Mess 1": 4.2, "Mess 2": 4.1, "Mess 3": 4.0, "Mess 4": 4.6, "Mess 5": 4.3 },
  { day: "Sun", "Mess 1": 4.0, "Mess 2": 3.8, "Mess 3": 3.8, "Mess 4": 4.5, "Mess 5": 4.1 },
];

// ── Fake monthly ratings (last 4 weeks avg per mess) ─────────────────────
const MONTHLY_RATINGS = [
  { mess: "Mess 1", rating: 3.9, reviews: 312 },
  { mess: "Mess 2", rating: 4.1, reviews: 287 },
  { mess: "Mess 3", rating: 3.7, reviews: 341 },
  { mess: "Mess 4", rating: 4.6, reviews: 298 },
  { mess: "Mess 5", rating: 4.1, reviews: 265 },
];

// ── Radar data for multi-dimension rating ────────────────────────────────
const RADAR_DATA = [
  { category: "Taste",     "Mess 4": 4.7, "Mess 2": 4.0, "Mess 1": 3.8 },
  { category: "Hygiene",   "Mess 4": 4.5, "Mess 2": 4.2, "Mess 1": 4.0 },
  { category: "Quantity",  "Mess 4": 4.4, "Mess 2": 3.9, "Mess 1": 4.1 },
  { category: "Variety",   "Mess 4": 4.6, "Mess 2": 4.1, "Mess 1": 3.7 },
  { category: "Service",   "Mess 4": 4.8, "Mess 2": 4.3, "Mess 1": 3.9 },
  { category: "Value",     "Mess 4": 4.5, "Mess 2": 4.0, "Mess 1": 3.8 },
];

// Priority order = sorted by monthly avg rating descending
const PRIORITY = [...MONTHLY_RATINGS].sort((a, b) => b.rating - a.rating);

const MEDAL = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

function StarBar({ rating }) {
  const pct = (rating / 5) * 100;
  const color = rating >= 4.5 ? "#10b981" : rating >= 4.0 ? "#f97316" : "#f43f5e";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-5">{title}</h2>
      {children}
    </div>
  );
}

function AdminRatings() {
  const [view, setView] = useState("month"); // "week" | "month"

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Mess Ratings Analysis</h1>
          <p className="text-sm text-gray-400 mt-1">Student feedback across all messes</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {["week", "month"].map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
                ${view === v ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
              {v === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>
      </div>

      {/* Priority ranking */}
      <Section title="🏆 Priority Ranking — Best to Worst">
        <div className="space-y-3">
          {PRIORITY.map((m, i) => (
            <div key={m.mess} className="flex items-center gap-4">
              <span className="text-xl w-8">{MEDAL[i]}</span>
              <div className="w-20 text-sm font-semibold text-gray-700">{m.mess}</div>
              <div className="flex-1">
                <StarBar rating={m.rating} />
              </div>
              <span className="text-xs text-gray-400 w-24 text-right">{m.reviews} reviews</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Bar chart — monthly avg */}
      <Section title="⭐ Average Rating by Mess">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY_RATINGS} barSize={40}>
            <XAxis dataKey="mess" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => [v.toFixed(1) + " / 5", "Rating"]} />
            <Bar dataKey="rating" radius={[8, 8, 0, 0]}>
              {MONTHLY_RATINGS.map((_, i) => (
                <Bar key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Weekly trend line chart */}
      {view === "week" && (
        <Section title="📈 Daily Rating Trend — This Week">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={WEEKLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis domain={[3, 5]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {MESSES.map((m, i) => (
                <Line key={m} type="monotone" dataKey={m} stroke={COLORS[i]} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Radar chart — top 3 messes multi-dimension */}
      <Section title="🔍 Multi-Dimension Comparison — Top 3 Messes">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={RADAR_DATA}>
            <PolarGrid stroke="#f0f0f0" />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
            {["Mess 4", "Mess 2", "Mess 1"].map((m, i) => (
              <Radar key={m} name={m} dataKey={m} stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} />
            ))}
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Section>

    </div>
  );
}

export default AdminRatings;