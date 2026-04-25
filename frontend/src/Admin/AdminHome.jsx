// src/Admin/AdminHome.jsx
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";

const COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];

const MONTHLY_RATINGS = [
  { mess: "Mess 1", rating: 3.9 },
  { mess: "Mess 2", rating: 4.1 },
  { mess: "Mess 3", rating: 3.7 },
  { mess: "Mess 4", rating: 4.6 },
  { mess: "Mess 5", rating: 4.1 },
];

const MONTHLY_WASTAGE = [
  { mess: "Mess 1", total: 312 },
  { mess: "Mess 2", total: 248 },
  { mess: "Mess 3", total: 387 },
  { mess: "Mess 4", total: 156 },
  { mess: "Mess 5", total: 276 },
];

const WASTAGE_TREND = [
  { week: "Week 1", "Mess 1": 12, "Mess 2": 8,  "Mess 3": 15, "Mess 4": 6,  "Mess 5": 10 },
  { week: "Week 2", "Mess 1": 10, "Mess 2": 11, "Mess 3": 13, "Mess 4": 7,  "Mess 5": 9  },
  { week: "Week 3", "Mess 1": 8,  "Mess 2": 9,  "Mess 3": 10, "Mess 4": 5,  "Mess 5": 7  },
  { week: "Week 4", "Mess 1": 14, "Mess 2": 7,  "Mess 3": 12, "Mess 4": 8,  "Mess 5": 11 },
];

const bestMess    = [...MONTHLY_RATINGS].sort((a, b) => b.rating - a.rating)[0];
const leastWaste  = [...MONTHLY_WASTAGE].sort((a, b) => a.total - b.total)[0];
const avgRating   = (MONTHLY_RATINGS.reduce((s, r) => s + r.rating, 0) / MONTHLY_RATINGS.length).toFixed(1);
const totalWaste  = MONTHLY_WASTAGE.reduce((s, m) => s + m.total, 0);

function StatCard({ label, value, sub, color }) {
  return (
    <div className={`rounded-2xl p-5 text-white flex flex-col gap-1 ${color}`}>
      <div className="text-sm font-medium opacity-80">{label}</div>
      <div className="text-3xl font-bold">{value}</div>
      {sub && <div className="text-xs opacity-70">{sub}</div>}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  );
}

function AdminHome() {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Admin Overview</h1>
        <p className="text-sm text-gray-400 mt-1">All messes at a glance</p>
      </div>

      {/* Best mess last month — hero banner */}
      <div className="rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-1">🏆 Best Mess Last Month</div>
          <div className="text-4xl font-bold">{bestMess.mess}</div>
          <div className="text-indigo-200 text-sm mt-1">Highest student satisfaction · {bestMess.rating} ★ avg rating</div>
        </div>
        <div className="text-7xl">🍽️</div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Avg Rating"      value={avgRating + " ★"} sub="Across all messes"  color="bg-orange-400" />
        <StatCard label="Total Wastage"   value={totalWaste + " kg"} sub="This month"        color="bg-rose-400"   />
        <StatCard label="Active Messes"   value="5"                sub="All operational"     color="bg-violet-500" />
        <StatCard label="Least Wasteful"  value={leastWaste.mess}  sub={leastWaste.total + " kg total"} color="bg-emerald-500" />
      </div>

      {/* Ratings bar chart */}
      <Section title="⭐ Average Mess Ratings — Last Month">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY_RATINGS} barSize={36}>
            <XAxis dataKey="mess" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => [v + " / 5", "Rating"]} />
            <Bar dataKey="rating" radius={[8, 8, 0, 0]}>
              {MONTHLY_RATINGS.map((_, i) => (
                <Bar key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Section>

      {/* Wastage trend */}
      <Section title="🍽️ Food Wastage Trend (kg/week)">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={WASTAGE_TREND}>
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

    </div>
  );
}

export default AdminHome;