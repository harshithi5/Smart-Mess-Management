// src/Admin/AdminNotifications.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { useAdminAuth } from "../context/AdminAuthContext";
import TextCard from "../User/TextCard";

function AdminNotifications() {
  const { admin } = useAdminAuth();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
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
        message: trimmed,
        messId: "all",
        messName: "All Messes",
        type: "Admin",
        sentBy: admin.email,
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (err) {
      console.error("Failed to send:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Broadcast Notifications</h1>
        <p className="text-sm text-gray-400 mt-1">Messages sent here go to all students across all messes.</p>
      </div>

      {/* Compose */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-3">
        <label className="text-sm font-medium text-gray-700">New Broadcast</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
          placeholder="Type a message to all students..."
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent transition"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">📢 Sent to all students</span>
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="px-5 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 disabled:opacity-40 text-white text-sm font-semibold transition"
          >
            {sending ? "Sending..." : "Broadcast"}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">All Notifications</h2>
        {loading && <div className="space-y-3 animate-pulse">{[1,2,3].map(i => <div key={i} className="h-16 bg-gray-200 rounded-2xl"/>)}</div>}
        {!loading && notifications.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No notifications yet.</p>}
        {!loading && notifications.map((n) => (
          <TextCard
            key={n.id}
            type={n.type}
            message={n.message}
            meta={n.createdAt?.toDate ? n.createdAt.toDate().toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
          />
        ))}
      </div>
    </div>
  );
}

export default AdminNotifications;