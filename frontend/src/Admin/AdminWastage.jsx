// src/Admin/AdminWastage.jsx
import React, { useState } from "react";
import {
  BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
  PieChart, Pie,
} from "recharts";

const MESSES   = ["Peepal", "Oak", "Pine", "Alder", "Tulsi", "Cedar"];
const COLORS   = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e", "#eab308"];
const PIE_COLORS = ["#f97316", "#3b82f6", "#10b981"];

const WEEKLY_WASTAGE = [
  { day: "Mon", Peepal: 12, Oak: 8,  Pine: 15, Alder: 5,  Tulsi: 10, Cedar: 8  },
  { day: "Tue", Peepal: 10, Oak: 11, Pine: 13, Alder: 6,  Tulsi: 9,  Cedar: 7  },
  { day: "Wed", Peepal: 14, Oak: 7,  Pine: 11, Alder: 4,  Tulsi: 12, Cedar: 9  },
  { day: "Thu", Peepal: 9,  Oak: 10, Pine: 14, Alder: 7,  Tulsi: 8,  Cedar: 6  },
  { day: "Fri", Peepal: 13, Oak: 9,  Pine: 16, Alder: 5,  Tulsi: 11, Cedar: 10 },
  { day: "Sat", Peepal: 16, Oak: 12, Pine: 18, Alder: 8,  Tulsi: 14, Cedar: 11 },
  { day: "Sun", Peepal: 11, Oak: 8,  Pine: 12, Alder: 5,  Tulsi: 9,  Cedar: 7  },
];

const MONTHLY_WASTAGE = [
  { mess: "Peepal", total: 312, perStudent: 1.4 },
  { mess: "Oak",    total: 248, perStudent: 1.1 },
  { mess: "Pine",   total: 387, perStudent: 1.7 },
  { mess: "Alder",  total: 156, perStudent: 0.7 },
  { mess: "Tulsi",  total: 276, perStudent: 1.2 },
  { mess: "Cedar",  total: 201, perStudent: 0.9 },
];

const MEAL_BREAKDOWN = [
  { name: "Breakfast", value: 28 },
  { name: "Lunch",     value: 45 },
  { name: "Dinner",    value: 37 },
];

const PRIORITY   = [...MONTHLY_WASTAGE].sort((a, b) => a.total - b.total);
const MEDAL      = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣"];
const maxWaste   = Math.max(...MONTHLY_WASTAGE.map(m => m.total));
const totalWeekly = WEEKLY_WASTAGE.reduce((sum, day) =>
  sum + MESSES.reduce((s, m) => s + (day[m] || 0), 0), 0);
const monthlyTotal = MONTHLY_WASTAGE.reduce((s, m) => s + m.total, 0);

// ── Custom tooltips ────────────────────────────────────────────────────────
function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2.5 text-sm">
      <p className="font-bold text-gray-800">{label}</p>
      <p className="text-rose-500 font-semibold">{payload[0].value} kg wasted</p>
      <p className="text-gray-400 text-xs">{MONTHLY_WASTAGE.find(m => m.mess === label)?.perStudent} kg/student</p>
    </div>
  );
}

function LineTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm min-w-[160px]">
      <p className="font-bold text-gray-700 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4">
          <span style={{ color: p.color }} className="font-semibold">{p.dataKey}</span>
          <span className="font-bold text-gray-700">{p.value} kg</span>
        </div>
      ))}
    </div>
  );
}

// ── Waste bar ──────────────────────────────────────────────────────────────
function WasteBar({ value, max }) {
  const pct   = (value / max) * 100;
  const color = pct <= 35 ? "#10b981" : pct <= 65 ? "#f97316" : "#f43f5e";
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-xs font-black w-14 text-right" style={{ color }}>{value} kg</span>
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, gradient, icon }) {
  return (
    <div className={`rounded-2xl p-4 text-white flex flex-col gap-1 relative overflow-hidden ${gradient}`}>
      <div className="absolute right-3 top-3 text-2xl opacity-20">{icon}</div>
      <div className="text-xs font-bold uppercase tracking-wider opacity-75">{label}</div>
      <div className="text-2xl font-black">{value}</div>
      {sub && <div className="text-xs opacity-70">{sub}</div>}
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

function AdminWastage() {
  const [view, setView] = useState("month");

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Food Wastage Analysis</h1>
          <p className="text-sm text-gray-400 mt-0.5">Tracking food waste across all messes</p>
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

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="📅" label="Total This Week"  value={`${totalWeekly} kg`}           sub="Across all messes"     gradient="bg-gradient-to-br from-rose-400 to-pink-500" />
        <StatCard icon="✅" label="Least Wasteful"   value={PRIORITY[0].mess}               sub={PRIORITY[0].total + " kg this month"} gradient="bg-gradient-to-br from-emerald-400 to-teal-500" />
        <StatCard icon="⚠️" label="Most Wasteful"    value={PRIORITY[PRIORITY.length-1].mess} sub={PRIORITY[PRIORITY.length-1].total + " kg this month"} gradient="bg-gradient-to-br from-orange-400 to-amber-500" />
        <StatCard icon="🗑️" label="Monthly Total"    value={`${monthlyTotal} kg`}           sub="All messes combined"   gradient="bg-gradient-to-br from-sky-400 to-blue-500" />
      </div>

      {/* Priority ranking */}
      <Section title="🏆 Ranking — Least to Most Wasteful">
        <div className="space-y-3">
          {PRIORITY.map((m, i) => (
            <div key={m.mess} className="flex items-center gap-3">
              <span className="text-xl w-8 shrink-0">{MEDAL[i]}</span>
              <span className="w-16 text-sm font-bold text-gray-700 shrink-0">{m.mess}</span>
              <WasteBar value={m.total} max={maxWaste} />
              <span className="text-xs text-gray-400 w-28 text-right shrink-0">{m.perStudent} kg/student</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Weekly line chart */}
      {view === "week" && (
        <Section title="📈 Daily Wastage Trend — This Week (kg)">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={WEEKLY_WASTAGE}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<LineTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
              {MESSES.map((m, i) => (
                <Line key={m} type="monotone" dataKey={m} stroke={COLORS[i]}
                  strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Monthly bar chart — Cell fixes the color-per-bar */}
      {view === "month" && (
        <Section title="📊 Monthly Total Wastage by Mess (kg)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_WASTAGE} barSize={40}>
              <XAxis dataKey="mess" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)", radius: 8 }} />
              <Bar dataKey="total" radius={[10, 10, 0, 0]}>
                {MONTHLY_WASTAGE.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Section>
      )}

      {/* Meal-wise donut + bars */}
      <Section title="🍽️ Wastage by Meal Type (Monthly Avg)">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative shrink-0">
            <PieChart width={200} height={200}>
              <Pie data={MEAL_BREAKDOWN} cx={100} cy={100}
                innerRadius={55} outerRadius={88}
                dataKey="value" paddingAngle={5}>
                {MEAL_BREAKDOWN.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [v + " kg"]} />
            </PieChart>
            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xl font-black text-gray-800">{MEAL_BREAKDOWN.reduce((s,m) => s + m.value, 0)}</p>
                <p className="text-xs text-gray-400 font-semibold">kg avg</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 flex-1 w-full">
            {MEAL_BREAKDOWN.map((m, i) => (
              <div key={m.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    <span className="font-bold text-gray-700">{m.name}</span>
                  </div>
                  <span className="font-black text-gray-800">{m.value} kg</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                  <div className="h-2.5 rounded-full transition-all duration-700"
                    style={{ width: `${(m.value / 45) * 100}%`, background: PIE_COLORS[i] }} />
                </div>
              </div>
            ))}
            <p className="text-xs text-gray-400 pt-2 border-t border-gray-50">
              💡 Lunch accounts for the most waste — consider adjusting serving portions.
            </p>
          </div>
        </div>
      </Section>

    </div>
  );
}

export default AdminWastage;