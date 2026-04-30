// src/Admin/AdminNotifications.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, onSnapshot, serverTimestamp } from "firebase/firestore";
import { useAdminAuth } from "../context/AdminAuthContext";

function AdminNotifications() {
  const { admin } = useAdminAuth();
  const [message,       setMessage]      = useState("");
  const [sending,       setSending]      = useState(false);
  const [sent,          setSent]         = useState(false);
  const [notifications, setNotifications]= useState([]);
  const [loading,       setLoading]      = useState(true);
  const [filter,        setFilter]       = useState("all");

  useEffect(() => {
    const unsub = onSnapshot(query(collection(db, "notifications")), (snap) => {
      setNotifications(
        snap.docs.map(d => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0))
      );
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || !admin) return;
    setSending(true);
    try {
      await addDoc(collection(db, "notifications"), {
        message: trimmed, messId: "all", messName: "All Messes",
        type: "Admin", sentBy: admin.email, createdAt: serverTimestamp(),
      });
      setMessage(""); setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) { console.error(err); }
    finally { setSending(false); }
  };

  const filtered = filter === "all" ? notifications : notifications.filter(n => n.type === filter);
  const adminCount  = notifications.filter(n => n.type === "Admin").length;
  const vendorCount = notifications.filter(n => n.type === "Vendor").length;

  const formatTime = (c) => {
    if (!c?.toDate) return "";
    const d = c.toDate(), ms = Date.now() - d;
    const m = Math.floor(ms/60000), h = Math.floor(ms/3600000), day = Math.floor(ms/86400000);
    if (m < 1) return "Just now"; if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`; if (day < 7) return `${day}d ago`;
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const grouped = filtered.reduce((acc, n) => {
    const date = n.createdAt?.toDate
      ? n.createdAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : "Earlier";
    if (!acc[date]) acc[date] = [];
    acc[date].push(n); return acc;
  }, {});

  return (
    <div className="min-h-screen bg-zinc-100">
      <div className="max-w-2xl mx-auto p-5 md:p-8 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-400 mt-0.5">{notifications.length} total · broadcast to all students</p>
          </div>
          {notifications.length > 0 && (
            <div className="flex items-center gap-1.5 bg-violet-50 border border-violet-100 rounded-xl px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
              <span className="text-xs font-bold text-violet-600">{adminCount} broadcasts</span>
            </div>
          )}
        </div>

        {/* Compose — elevated card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-violet-100 flex items-center justify-center text-base shrink-0">📢</div>
              <div>
                <p className="text-sm font-black text-gray-900">New Broadcast</p>
                <p className="text-xs text-gray-400">Goes to every student across all 6 messes</p>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                placeholder="Write your broadcast message..."
                rows={3}
                className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition pr-16"
              />
              <span className="absolute bottom-3 right-3 text-xs text-gray-300 font-mono">{message.length}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                Press Enter to send
              </div>
              <div className="flex items-center gap-3">
                {sent && <span className="text-xs text-emerald-500 font-bold flex items-center gap-1"><span>✓</span> Sent!</span>}
                <button onClick={handleSend} disabled={!message.trim() || sending}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-sm font-bold transition active:scale-95 shadow-lg shadow-violet-100">
                  {sending ? (
                    <><svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg> Sending...</>
                  ) : "Broadcast →"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all",    label: "All",    count: notifications.length, active: "bg-gray-900 text-white" },
            { key: "Admin",  label: "Admin",  count: adminCount,           active: "bg-violet-600 text-white" },
            { key: "Vendor", label: "Vendor", count: vendorCount,          active: "bg-emerald-500 text-white" },
          ].map(({ key, label, count, active }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-bold transition
                ${filter === key ? active : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}>
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-black
                ${filter === key ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3 animate-pulse">
            {[1,2,3].map(i => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 flex gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-gray-100 rounded-full w-1/4" />
                  <div className="h-4 bg-gray-100 rounded-full w-3/4" />
                  <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-3 bg-white rounded-3xl border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-2xl">📢</div>
            <p className="text-gray-700 font-bold">No notifications yet</p>
            <p className="text-gray-400 text-sm">Broadcast a message above to get started.</p>
          </div>
        )}

        {/* Grouped feed */}
        {!loading && Object.entries(grouped).map(([date, notifs]) => (
          <div key={date} className="space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{date}</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {notifs.map((n) => {
              const isAdmin = n.type === "Admin";
              return (
                <div key={n.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all p-4 flex gap-3.5">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-base shrink-0
                    ${isAdmin ? "bg-violet-50" : "bg-emerald-50"}`}>
                    {isAdmin ? "📢" : "🍽️"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-xs font-black px-2.5 py-0.5 rounded-full
                        ${isAdmin ? "bg-violet-100 text-violet-700" : "bg-emerald-100 text-emerald-700"}`}>
                        {n.type}
                      </span>
                      {!isAdmin && n.messName && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                          {n.messName}
                        </span>
                      )}
                      {isAdmin && n.sentBy && (
                        <span className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-0.5 rounded-lg">
                          {n.sentBy.split("@")[0]}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1.5 font-medium">{formatTime(n.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

      </div>
    </div>
  );
}

export default AdminNotifications;