// src/Admin/AdminHome.jsx
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, CartesianGrid, Legend,
} from "recharts";

// ── Real mess names matching messService.js ──────────────────────────────
const MESS_NAMES = ["Peepal", "Oak", "Pine", "Alder", "Tulsi", "Cedar"];
const COLORS     = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e", "#eab308"];

const MONTHLY_RATINGS = [
  { mess: "Peepal", rating: 3.9 },
  { mess: "Oak",    rating: 4.1 },
  { mess: "Pine",   rating: 3.7 },
  { mess: "Alder",  rating: 4.6 },
  { mess: "Tulsi",  rating: 4.1 },
  { mess: "Cedar",  rating: 3.8 },
];

const MONTHLY_WASTAGE = [
  { mess: "Peepal", total: 312 },
  { mess: "Oak",    total: 248 },
  { mess: "Pine",   total: 387 },
  { mess: "Alder",  total: 156 },
  { mess: "Tulsi",  total: 276 },
  { mess: "Cedar",  total: 201 },
];

const WASTAGE_TREND = [
  { week: "Wk 1", Peepal: 12, Oak: 8,  Pine: 15, Alder: 6,  Tulsi: 10, Cedar: 9  },
  { week: "Wk 2", Peepal: 10, Oak: 11, Pine: 13, Alder: 7,  Tulsi: 9,  Cedar: 8  },
  { week: "Wk 3", Peepal: 8,  Oak: 9,  Pine: 10, Alder: 5,  Tulsi: 7,  Cedar: 6  },
  { week: "Wk 4", Peepal: 14, Oak: 7,  Pine: 12, Alder: 8,  Tulsi: 11, Cedar: 10 },
];

const bestMess   = [...MONTHLY_RATINGS].sort((a, b) => b.rating - a.rating)[0];
const leastWaste = [...MONTHLY_WASTAGE].sort((a, b) => a.total - b.total)[0];
const avgRating  = (MONTHLY_RATINGS.reduce((s, r) => s + r.rating, 0) / MONTHLY_RATINGS.length).toFixed(1);
const totalWaste = MONTHLY_WASTAGE.reduce((s, m) => s + m.total, 0);

// ── Custom bar tooltip ────────────────────────────────────────────────────
function RatingTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-2.5 text-sm">
      <p className="font-bold text-gray-800">{label}</p>
      <p className="text-indigo-500 font-semibold">{payload[0].value} / 5 ★</p>
    </div>
  );
}

function WastageTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-sm min-w-[160px]">
      <p className="font-bold text-gray-700 mb-2">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4">
          <span style={{ color: p.color }} className="font-medium">{p.dataKey}</span>
          <span className="font-bold text-gray-700">{p.value} kg</span>
        </div>
      ))}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, gradient, icon }) {
  return (
    <div className={`rounded-2xl p-5 text-white flex flex-col gap-1.5 relative overflow-hidden ${gradient}`}>
      <div className="absolute right-4 top-4 text-3xl opacity-20">{icon}</div>
      <div className="text-xs font-bold uppercase tracking-wider opacity-75">{label}</div>
      <div className="text-3xl font-black">{value}</div>
      {sub && <div className="text-xs opacity-70 font-medium">{sub}</div>}
    </div>
  );
}

// ── Inline rating bar ─────────────────────────────────────────────────────
function RatingBar({ rating, color }) {
  return (
    <div className="flex items-center gap-2 flex-1">
      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className="h-2 rounded-full transition-all duration-700"
          style={{ width: `${(rating / 5) * 100}%`, background: color }} />
      </div>
      <span className="text-xs font-black w-6 text-right" style={{ color }}>{rating}</span>
    </div>
  );
}

function AdminHome() {
  const bestIdx = MONTHLY_RATINGS.findIndex(m => m.mess === bestMess.mess);

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Overview</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-100 rounded-xl px-3 py-1.5">
          <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-bold text-green-600">6 messes active</span>
        </div>
      </div>

      {/* Best mess hero */}
      <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-6 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full" />
        <div className="absolute -right-4 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full">
                🏆 Best Mess Last Month
              </span>
            </div>
            <div className="text-5xl font-black mt-1">{bestMess.mess}</div>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-lg ${s <= Math.round(bestMess.rating) ? "opacity-100" : "opacity-30"}`}>⭐</span>
                ))}
              </div>
              <span className="text-indigo-200 text-sm font-semibold">{bestMess.rating} avg rating · Highest satisfaction</span>
            </div>
          </div>
          <div className="text-7xl drop-shadow-2xl hidden md:block">🍽️</div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="★"  label="Avg Rating"     value={avgRating + " ★"} sub="Across all messes"          gradient="bg-gradient-to-br from-orange-400 to-amber-500" />
        <StatCard icon="🗑" label="Total Wastage"  value={totalWaste + " kg"} sub="This month"               gradient="bg-gradient-to-br from-rose-400 to-pink-500" />
        <StatCard icon="🍽" label="Active Messes"  value="6"                  sub="All operational"           gradient="bg-gradient-to-br from-violet-500 to-purple-600" />
        <StatCard icon="✅" label="Least Wasteful" value={leastWaste.mess}    sub={leastWaste.total + " kg"}  gradient="bg-gradient-to-br from-emerald-400 to-teal-500" />
      </div>

      {/* Two column layout */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Ratings ranking */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-5">⭐ Ratings Ranking</h2>
          <div className="space-y-3">
            {[...MONTHLY_RATINGS]
              .sort((a, b) => b.rating - a.rating)
              .map((m, i) => {
                const colorIdx = MONTHLY_RATINGS.findIndex(r => r.mess === m.mess);
                const medals   = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣"];
                return (
                  <div key={m.mess} className="flex items-center gap-3">
                    <span className="text-lg w-7 shrink-0">{medals[i]}</span>
                    <span className="text-sm font-bold text-gray-700 w-16 shrink-0">{m.mess}</span>
                    <RatingBar rating={m.rating} color={COLORS[colorIdx]} />
                  </div>
                );
              })}
          </div>
        </div>

        {/* Wastage ranking */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-5">🗑️ Wastage Ranking</h2>
          <div className="space-y-3">
            {[...MONTHLY_WASTAGE]
              .sort((a, b) => a.total - b.total)
              .map((m, i) => {
                const colorIdx = MONTHLY_WASTAGE.findIndex(r => r.mess === m.mess);
                const max      = Math.max(...MONTHLY_WASTAGE.map(x => x.total));
                const medals   = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣", "6️⃣"];
                const pct      = (m.total / max) * 100;
                const color    = pct <= 40 ? "#10b981" : pct <= 70 ? "#f97316" : "#f43f5e";
                return (
                  <div key={m.mess} className="flex items-center gap-3">
                    <span className="text-lg w-7 shrink-0">{medals[i]}</span>
                    <span className="text-sm font-bold text-gray-700 w-16 shrink-0">{m.mess}</span>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div className="h-2 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: color }} />
                      </div>
                      <span className="text-xs font-black w-14 text-right" style={{ color }}>{m.total} kg</span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Ratings bar chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-5">📊 Average Ratings by Mess</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY_RATINGS} barSize={38} barGap={8}>
            <XAxis dataKey="mess" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<RatingTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)", radius: 8 }} />
            <Bar dataKey="rating" radius={[10, 10, 0, 0]}>
              {MONTHLY_RATINGS.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Wastage trend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-5">📈 Weekly Wastage Trend (kg)</h2>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={WASTAGE_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis dataKey="week" tick={{ fontSize: 12, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<WastageTooltip />} />
            <Legend wrapperStyle={{ fontSize: 12, fontWeight: 600 }} />
            {MESS_NAMES.map((m, i) => (
              <Line key={m} type="monotone" dataKey={m}
                stroke={COLORS[i]} strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 2 }}
                activeDot={{ r: 5 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default AdminHome;