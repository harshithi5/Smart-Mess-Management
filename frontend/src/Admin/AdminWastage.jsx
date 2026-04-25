// src/Admin/AdminWastage.jsx
import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
  PieChart, Pie, Cell,
} from "recharts";

const MESSES = ["Mess 1", "Mess 2", "Mess 3", "Mess 4", "Mess 5"];
const COLORS  = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];

// ── Fake weekly wastage (kg per day per mess) ────────────────────────────
const WEEKLY_WASTAGE = [
  { day: "Mon", "Mess 1": 12, "Mess 2": 8,  "Mess 3": 15, "Mess 4": 5,  "Mess 5": 10 },
  { day: "Tue", "Mess 1": 10, "Mess 2": 11, "Mess 3": 13, "Mess 4": 6,  "Mess 5": 9  },
  { day: "Wed", "Mess 1": 14, "Mess 2": 7,  "Mess 3": 11, "Mess 4": 4,  "Mess 5": 12 },
  { day: "Thu", "Mess 1": 9,  "Mess 2": 10, "Mess 3": 14, "Mess 4": 7,  "Mess 5": 8  },
  { day: "Fri", "Mess 1": 13, "Mess 2": 9,  "Mess 3": 16, "Mess 4": 5,  "Mess 5": 11 },
  { day: "Sat", "Mess 1": 16, "Mess 2": 12, "Mess 3": 18, "Mess 4": 8,  "Mess 5": 14 },
  { day: "Sun", "Mess 1": 11, "Mess 2": 8,  "Mess 3": 12, "Mess 4": 5,  "Mess 5": 9  },
];

// ── Monthly wastage totals (kg) ──────────────────────────────────────────
const MONTHLY_WASTAGE = [
  { mess: "Mess 1", total: 312, perStudent: 1.4 },
  { mess: "Mess 2", total: 248, perStudent: 1.1 },
  { mess: "Mess 3", total: 387, perStudent: 1.7 },
  { mess: "Mess 4", total: 156, perStudent: 0.7 },
  { mess: "Mess 5", total: 276, perStudent: 1.2 },
];

// ── Meal-wise breakdown (avg kg wasted per meal) ─────────────────────────
const MEAL_BREAKDOWN = [
  { name: "Breakfast", value: 28 },
  { name: "Lunch",     value: 45 },
  { name: "Dinner",    value: 37 },
];
const PIE_COLORS = ["#f97316", "#3b82f6", "#10b981"];

// Priority = least waste first
const PRIORITY = [...MONTHLY_WASTAGE].sort((a, b) => a.total - b.total);
const MEDAL = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

function WasteBar({ value, max }) {
  const pct = (value / max) * 100;
  const color = pct <= 35 ? "#10b981" : pct <= 65 ? "#f97316" : "#f43f5e";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-100 rounded-full h-2">
        <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-bold w-12 text-right" style={{ color }}>{value} kg</span>
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

function AdminWastage() {
  const [view, setView] = useState("month");
  const maxWaste = Math.max(...MONTHLY_WASTAGE.map((m) => m.total));

  const totalWeekly = WEEKLY_WASTAGE.reduce((sum, day) =>
    sum + MESSES.reduce((s, m) => s + (day[m] || 0), 0), 0);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Food Wastage Analysis</h1>
          <p className="text-sm text-gray-400 mt-1">Tracking food waste across all messes</p>
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

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
          <div className="text-xs text-rose-400 font-medium">Total This Week</div>
          <div className="text-2xl font-bold text-rose-500 mt-1">{totalWeekly} kg</div>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
          <div className="text-xs text-green-500 font-medium">Least Wasteful</div>
          <div className="text-2xl font-bold text-green-600 mt-1">{PRIORITY[0].mess}</div>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
          <div className="text-xs text-orange-400 font-medium">Most Wasteful</div>
          <div className="text-2xl font-bold text-orange-500 mt-1">{PRIORITY[PRIORITY.length - 1].mess}</div>
        </div>
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
          <div className="text-xs text-sky-400 font-medium">Monthly Total</div>
          <div className="text-2xl font-bold text-sky-500 mt-1">
            {MONTHLY_WASTAGE.reduce((s, m) => s + m.total, 0)} kg
          </div>
        </div>
      </div>

      {/* Priority ranking — least waste = best */}
      <Section title="🏆 Priority Ranking — Least to Most Wasteful">
        <div className="space-y-3">
          {PRIORITY.map((m, i) => (
            <div key={m.mess} className="flex items-center gap-4">
              <span className="text-xl w-8">{MEDAL[i]}</span>
              <div className="w-20 text-sm font-semibold text-gray-700">{m.mess}</div>
              <div className="flex-1">
                <WasteBar value={m.total} max={maxWaste} />
              </div>
              <span className="text-xs text-gray-400 w-28 text-right">{m.perStudent} kg/student</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Weekly line chart */}
      {view === "week" && (
        <Section title="📈 Daily Wastage Trend — This Week (kg)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={WEEKLY_WASTAGE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {MESSES.map((m, i) => (
                <Line key={m} type="monotone" dataKey={m} stroke={COLORS[i]} strokeWidth={2} dot={{ r: 3 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Monthly bar chart */}
      {view === "month" && (
        <Section title="📊 Monthly Total Wastage by Mess (kg)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_WASTAGE} barSize={40}>
              <XAxis dataKey="mess" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [v + " kg", "Wastage"]} />
              <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                {MONTHLY_WASTAGE.map((_, i) => (
                  <Bar key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Meal-wise pie */}
      <Section title="🍽️ Wastage by Meal Type (Monthly Avg, kg)">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie data={MEAL_BREAKDOWN} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                dataKey="value" paddingAngle={4}>
                {MEAL_BREAKDOWN.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [v + " kg"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3 flex-1">
            {MEAL_BREAKDOWN.map((m, i) => (
              <div key={m.name} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: PIE_COLORS[i] }} />
                <span className="text-sm font-medium text-gray-700 w-20">{m.name}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full" style={{ width: `${(m.value / 45) * 100}%`, background: PIE_COLORS[i] }} />
                </div>
                <span className="text-sm font-bold text-gray-600">{m.value} kg</span>
              </div>
            ))}
            <p className="text-xs text-gray-400 mt-2">
              Lunch accounts for the most waste — peak serving hours.
            </p>
          </div>
        </div>
      </Section>

    </div>
  );
}

export default AdminWastage;