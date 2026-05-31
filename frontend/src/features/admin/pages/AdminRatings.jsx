// src/Admin/AdminRatings.jsx
import React, { useState } from "react";
import {
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";

const MESSES = ["Peepal", "Oak", "Pine", "Alder", "Tulsi", "Cedar"];
const COLORS  = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e", "#eab308"];

const WEEKLY_TREND = [
  { day: "Mon", Peepal: 3.8, Oak: 4.1, Pine: 3.5, Alder: 4.6, Tulsi: 4.0, Cedar: 3.7 },
  { day: "Tue", Peepal: 4.0, Oak: 3.9, Pine: 3.7, Alder: 4.4, Tulsi: 4.2, Cedar: 3.9 },
  { day: "Wed", Peepal: 3.6, Oak: 4.2, Pine: 3.4, Alder: 4.7, Tulsi: 3.9, Cedar: 3.6 },
  { day: "Thu", Peepal: 4.1, Oak: 4.0, Pine: 3.9, Alder: 4.5, Tulsi: 4.1, Cedar: 4.0 },
  { day: "Fri", Peepal: 3.9, Oak: 4.3, Pine: 3.6, Alder: 4.8, Tulsi: 4.0, Cedar: 3.8 },
  { day: "Sat", Peepal: 4.2, Oak: 4.1, Pine: 4.0, Alder: 4.6, Tulsi: 4.3, Cedar: 4.1 },
  { day: "Sun", Peepal: 4.0, Oak: 3.8, Pine: 3.8, Alder: 4.5, Tulsi: 4.1, Cedar: 3.9 },
];

const MONTHLY_RATINGS = [
  { mess: "Peepal", rating: 3.9, reviews: 312 },
  { mess: "Oak",    rating: 4.1, reviews: 287 },
  { mess: "Pine",   rating: 3.7, reviews: 341 },
  { mess: "Alder",  rating: 4.6, reviews: 298 },
  { mess: "Tulsi",  rating: 4.1, reviews: 265 },
  { mess: "Cedar",  rating: 3.8, reviews: 230 },
];

const RADAR_DATA = [
  { category: "Taste",    Alder: 4.7, Oak: 4.0, Peepal: 3.8 },
  { category: "Hygiene",  Alder: 4.5, Oak: 4.2, Peepal: 4.0 },
  { category: "Quantity", Alder: 4.4, Oak: 3.9, Peepal: 4.1 },
  { category: "Variety",  Alder: 4.6, Oak: 4.1, Peepal: 3.7 },
  { category: "Service",  Alder: 4.8, Oak: 4.3, Peepal: 3.9 },
  { category: "Value",    Alder: 4.5, Oak: 4.0, Peepal: 3.8 },
];

const PRIORITY = [...MONTHLY_RATINGS].sort((a, b) => b.rating - a.rating);
const MEDAL    = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣"];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2.5 text-sm">
      <p className="font-bold text-gray-800">{label}</p>
      <p className="text-indigo-500 font-semibold">{payload[0].value?.toFixed(1)} / 5 ★</p>
    </div>
  );
}

function StarBar({ rating, color }) {
  const pct = (rating / 5) * 100;
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-black w-6 text-right" style={{ color }}>{rating.toFixed(1)}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-5">{title}</h2>
      {children}
    </div>
  );
}

function AdminRatings() {
  const [view, setView] = useState("month");

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Mess Ratings Analysis</h1>
          <p className="text-sm text-gray-400 mt-0.5">Student feedback across all messes</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
          {["week", "month"].map((v) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition
                ${view === v ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
              {v === "week" ? "This Week" : "This Month"}
            </button>
          ))}
        </div>
      </div>

      {/* Priority ranking */}
      <Section title="🏆 Priority Ranking — Best to Worst">
        <div className="space-y-3">
          {PRIORITY.map((m, i) => {
            const colorIdx = MONTHLY_RATINGS.findIndex(r => r.mess === m.mess);
            return (
              <div key={m.mess} className="flex items-center gap-3">
                <span className="text-xl w-8 shrink-0">{MEDAL[i]}</span>
                <span className="w-16 text-sm font-bold text-gray-700 shrink-0">{m.mess}</span>
                <StarBar rating={m.rating} color={COLORS[colorIdx]} />
                <span className="text-xs text-gray-400 w-24 text-right shrink-0">{m.reviews} reviews</span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Bar chart — uses Cell for per-bar color */}
      <Section title="⭐ Average Rating by Mess">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY_RATINGS} barSize={40}>
            <XAxis dataKey="mess" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)", radius: 8 }} />
            <Bar dataKey="rating" radius={[10, 10, 0, 0]}>
              {MONTHLY_RATINGS.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Weekly trend */}
      {view === "week" && (
        <Section title="📈 Daily Rating Trend — This Week">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={WEEKLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis domain={[3, 5]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
              {MESSES.map((m, i) => (
                <Line key={m} type="monotone" dataKey={m} stroke={COLORS[i]}
                  strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Radar chart — top 3 */}
      <Section title="🔍 Multi-Dimension Comparison — Top 3 Messes">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={RADAR_DATA}>
            <PolarGrid stroke="#f0f0f0" />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fontWeight: 600 }} />
            <PolarRadiusAxis domain={[0, 5]} tick={{ fontSize: 10 }} />
            {["Alder", "Oak", "Peepal"].map((m, i) => (
              <Radar key={m} name={m} dataKey={m}
                stroke={COLORS[i]} fill={COLORS[i]} fillOpacity={0.15} />
            ))}
            <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </Section>

    </div>
  );
}

export default AdminRatings;