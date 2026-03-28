// src/Vendor/VendorNotifications.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { useVendorAuth } from "../context/VendorAuthContext";
import TextCard from "../User/TextCard";

function VendorNotifications() {
  const { vendor, vendorMess } = useVendorAuth();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(true);

  useEffect(() => {
    if (!vendorMess) return;

    const q = query(
      collection(db, "notifications"),
      where("messId", "in", [vendorMess.messId, "all"]),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      setLoadingFeed(false);
    });

    return () => unsubscribe();
  }, [vendorMess]);

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || !vendor || !vendorMess) return;

    setSending(true);
    try {
      await addDoc(collection(db, "notifications"), {
        message: trimmed,
        messId: vendorMess.messId,
        messName: vendorMess.messName,   // stored in Firestore so all readers see it
        type: "Vendor",
        sentBy: vendor.email,
        createdAt: serverTimestamp(),
      });
      setMessage("");
    } catch (err) {
      console.error("Failed to send notification:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Your notifications go to students of{" "}
          <span className="font-medium text-gray-700">{vendorMess?.messName}</span> only.
        </p>
      </div>

      {/* Compose */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 space-y-3">
        <label className="text-sm font-medium text-gray-700">New Notification</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
          placeholder="Write your message here... (Enter to send)"
          rows={3}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">📍 {vendorMess?.messName} students only</span>
          <button
            onClick={handleSend}
            disabled={!message.trim() || sending}
            className="px-5 py-2 rounded-xl bg-orange-400 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recent Notifications</h2>

        {loadingFeed && (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-200 rounded-2xl" />)}
          </div>
        )}

        {!loadingFeed && notifications.length === 0 && (
          <p className="text-sm text-gray-400 text-center py-8">No notifications yet.</p>
        )}

        {!loadingFeed && notifications.map((notif) => (
          <TextCard
            key={notif.id}
            type={notif.type}
            message={notif.message}
            messName={notif.messName}
            meta={
              notif.createdAt?.toDate
                ? notif.createdAt.toDate().toLocaleString("en-IN", {
                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                  })
                : ""
            }
          />
        ))}
      </div>

    </div>
  );
}

export default VendorNotifications;