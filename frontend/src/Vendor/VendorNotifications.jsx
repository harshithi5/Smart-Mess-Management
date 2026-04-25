// src/Vendor/VendorNotifications.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, query, where, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { useVendorAuth } from "../context/VendorAuthContext";

function VendorNotifications() {
  const { vendor, vendorMess } = useVendorAuth();
  const [message,       setMessage]       = useState("");
  const [sending,       setSending]        = useState(false);
  const [sent,          setSent]           = useState(false);
  const [notifications, setNotifications]  = useState([]);
  const [loading,       setLoading]        = useState(true);
  const [filter,        setFilter]         = useState("all"); // "all" | "mine" | "admin"

  useEffect(() => {
    if (!vendorMess) return;
    const q = query(
      collection(db, "notifications"),
      where("messId", "in", [vendorMess.messId, "all"])
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setNotifications(data);
      setLoading(false);
    });
    return () => unsub();
  }, [vendorMess]);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || !vendor || !vendorMess) return;
    setSending(true);
    try {
      await addDoc(collection(db, "notifications"), {
        message:   trimmed,
        messId:    vendorMess.messId,
        messName:  vendorMess.messName,
        type:      "Vendor",
        sentBy:    vendor.email,
        createdAt: serverTimestamp(),
      });
      setMessage("");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (err) {
      console.error("Failed to send notification:", err);
    } finally {
      setSending(false);
    }
  };

  const filtered =
    filter === "mine"  ? notifications.filter(n => n.type === "Vendor" && n.messId === vendorMess?.messId) :
    filter === "admin" ? notifications.filter(n => n.type === "Admin") :
    notifications;

  const myCount    = notifications.filter(n => n.type === "Vendor" && n.messId === vendorMess?.messId).length;
  const adminCount = notifications.filter(n => n.type === "Admin").length;

  const formatTime = (createdAt) => {
    if (!createdAt?.toDate) return "";
    const date    = createdAt.toDate();
    const diffMs  = Date.now() - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr  = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);
    if (diffMin < 1)  return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr  < 24) return `${diffHr}h ago`;
    if (diffDay < 7)  return `${diffDay}d ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const formatFullDate = (createdAt) => {
    if (!createdAt?.toDate) return "";
    return createdAt.toDate().toLocaleString("en-IN", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const grouped = filtered.reduce((acc, notif) => {
    const date = notif.createdAt?.toDate
      ? notif.createdAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
      : "Earlier";
    if (!acc[date]) acc[date] = [];
    acc[date].push(notif);
    return acc;
  }, {});

  return (
    <div className="p-5 md:p-8 max-w-2xl mx-auto flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Notifications</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Sending to <span className="font-semibold text-gray-700">{vendorMess?.messName}</span> students · {notifications.length} total
        </p>
      </div>

      {/* Compose */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-base">🍽️</div>
          <div>
            <p className="text-sm font-bold text-gray-800">New Notification</p>
            <p className="text-xs text-gray-400">
              Sent to <span className="font-medium text-orange-500">{vendorMess?.messName}</span> students only
            </p>
          </div>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
          placeholder="Write your message here... (Enter to send)"
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{message.length} characters</span>
          <div className="flex items-center gap-3">
            {sent && (
              <span className="text-xs text-green-500 font-semibold">✅ Sent!</span>
            )}
            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-400 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition active:scale-95"
            >
              {sending ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  Sending...
                </>
              ) : "Send"}
            </button>
          </div>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all",   label: "All",         count: notifications.length },
          { key: "mine",  label: "My Messages",  count: myCount },
          { key: "admin", label: "From Admin",   count: adminCount },
        ].map(({ key, label, count }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition
              ${filter === key
                ? key === "admin" ? "bg-blue-500 text-white shadow-sm"
                : key === "mine"  ? "bg-orange-400 text-white shadow-sm"
                : "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}>
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
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
              <div className="w-10 h-10 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/4" />
                <div className="h-4 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 gap-3">
          <div className="text-4xl">🔔</div>
          <p className="text-gray-500 font-medium">No notifications here</p>
          <p className="text-gray-400 text-sm text-center">
            {filter === "mine"  ? "You haven't sent any notifications yet." :
             filter === "admin" ? "No admin broadcasts yet." :
             "Send a message above to notify your students."}
          </p>
        </div>
      )}

      {/* Grouped feed */}
      {!loading && Object.entries(grouped).map(([date, notifs]) => (
        <div key={date} className="space-y-3">

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{date}</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {notifs.map((n) => {
            const isAdmin = n.type === "Admin";
            const isMine  = n.sentBy === vendor?.email;

            return (
              <div key={n.id}
                className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow p-4 flex gap-4
                  ${isMine ? "border-orange-100" : "border-gray-100"}`}>

                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0
                  ${isAdmin ? "bg-blue-50" : isMine ? "bg-orange-50" : "bg-green-50"}`}>
                  {isAdmin ? "📢" : "🍽️"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                      ${isAdmin ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`}>
                      {n.type}
                    </span>
                    {n.messName && !isAdmin && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-500 border border-orange-100">
                        {n.messName}
                      </span>
                    )}
                    {isMine && (
                      <span className="text-xs text-gray-400">· You</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed">{n.message}</p>

                  <p className="text-xs text-gray-400 mt-1.5" title={formatFullDate(n.createdAt)}>
                    {formatTime(n.createdAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ))}

    </div>
  );
}

export default VendorNotifications;