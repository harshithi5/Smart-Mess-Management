// src/User/Complaint.jsx
import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { useAuth } from "../context/AuthContext";
import {
  collection, addDoc, query, where,
  onSnapshot, serverTimestamp, doc, updateDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CATEGORIES = [
  { id: "food_quality",  label: "Food Quality",   emoji: "🍽️" },
  { id: "hygiene",       label: "Hygiene",         emoji: "🧹" },
  { id: "service",       label: "Service",         emoji: "👨‍🍳" },
  { id: "quantity",      label: "Quantity",        emoji: "⚖️" },
  { id: "timing",        label: "Timing",          emoji: "⏰" },
  { id: "other",         label: "Other",           emoji: "📝" },
];

// Map student's affiliated mess to messId
// This should match VENDOR_MESS_MAP in VendorAuthContext
const MESS_ID_MAP = {
  "Peepal": "mess1", "Oak": "mess2", "Pine": "mess3",
  "Alder":  "mess4", "Tulsi": "mess5", "Cedar": "mess6",
};

function StatusBadge({ status, daysOld }) {
  const isOverdue = status === "pending" && daysOld >= 7;
  if (isOverdue)    return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 font-semibold">⚠️ Overdue</span>;
  if (status === "pending")  return <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">Pending</span>;
  if (status === "resolved") return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600">✓ Resolved</span>;
  return null;
}

function Complaint() {
  const { user, userProfile } = useAuth();
  const [tab, setTab] = useState("file"); // "file" | "my"

  // Form state
  const [category,    setCategory]    = useState("");
  const [text,        setText]        = useState("");
  const [photo,       setPhoto]       = useState(null);
  const [photoPreview,setPhotoPreview]= useState(null);
  const [submitting,  setSubmitting]  = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  // My complaints
  const [myComplaints, setMyComplaints] = useState([]);
  const [loadingMine,  setLoadingMine]  = useState(true);
  const [resolving,    setResolving]    = useState(null);

  // Get affiliated mess from profile
  const affiliatedMess = userProfile?.currentMess || "Alder";
  const messId = MESS_ID_MAP[affiliatedMess] || "mess4";

  // Load user's own complaints
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "complaints"),
      where("studentUid", "==", user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setMyComplaints(data);
      setLoadingMine(false);
    });
    return () => unsub();
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!category || !text.trim()) return;
    setSubmitting(true);

    try {
      let photoURL = null;

      // Upload photo if provided
      if (photo) {
        const storageRef = ref(storage, `complaints/${user.uid}_${Date.now()}`);
        await uploadBytes(storageRef, photo);
        photoURL = await getDownloadURL(storageRef);
      }

      // Generate anonymous token — hides student identity from vendor
      const anonToken = "Student #" + Math.random().toString(36).substr(2, 5).toUpperCase();

      await addDoc(collection(db, "complaints"), {
        // Student info — hidden from vendor, visible only to admin
        studentUid:   user.uid,
        studentEmail: user.email,     // stored but not shown to vendor

        // Mess routing
        messId,
        messName: affiliatedMess,

        // Complaint content
        category,
        categoryLabel: CATEGORIES.find(c => c.id === category)?.label,
        text: text.trim(),
        photoURL,

        // Anonymous ID shown to vendor
        anonToken,

        // Status
        status:    "pending",
        createdAt: serverTimestamp(),
        resolvedAt: null,
        resolvedByStudent: false,
      });

      setText("");
      setCategory("");
      setPhoto(null);
      setPhotoPreview(null);
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setTab("my"); }, 2000);
    } catch (err) {
      console.error("Failed to submit complaint:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Student marks complaint as resolved
  const handleMarkResolved = async (complaintId) => {
    setResolving(complaintId);
    try {
      await updateDoc(doc(db, "complaints", complaintId), {
        status:            "resolved",
        resolvedAt:        serverTimestamp(),
        resolvedByStudent: true,
      });
    } catch (err) {
      console.error("Failed to resolve:", err);
    } finally {
      setResolving(null);
    }
  };

  const getDaysOld = (createdAt) => {
    if (!createdAt?.toDate) return 0;
    return Math.floor((Date.now() - createdAt.toDate()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Complaints</h1>
        <p className="text-sm text-gray-400 mt-1">
          Your identity is kept anonymous from the mess vendor.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1 w-fit">
        {[["file", "File a Complaint"], ["my", "My Complaints"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
              ${tab === key ? "bg-white shadow text-gray-800" : "text-gray-500 hover:text-gray-700"}`}>
            {label}
            {key === "my" && myComplaints.filter(c => c.status === "pending").length > 0 && (
              <span className="ml-1.5 bg-yellow-400 text-white text-xs rounded-full px-1.5 py-0.5">
                {myComplaints.filter(c => c.status === "pending").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── FILE COMPLAINT TAB ── */}
      {tab === "file" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">

          {submitted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm font-medium text-center">
              ✅ Complaint submitted anonymously!
            </div>
          )}

          {/* Category */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Category</label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setCategory(c.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-sm font-medium transition
                    ${category === c.id
                      ? "border-[#5352ed] bg-indigo-50 text-[#5352ed]"
                      : "border-gray-200 text-gray-600 hover:border-indigo-200"}`}>
                  <span>{c.emoji}</span>{c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Description</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              placeholder="Describe your complaint in detail..."
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
            />
            <p className="text-xs text-gray-400 mt-1">{text.length} / 500 characters</p>
          </div>

          {/* Photo upload */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Photo (optional)</label>
            {photoPreview ? (
              <div className="relative w-40">
                <img src={photoPreview} alt="preview" className="w-40 h-28 object-cover rounded-xl border border-gray-200" />
                <button onClick={() => { setPhoto(null); setPhotoPreview(null); }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">✕</button>
              </div>
            ) : (
              <label className="flex items-center gap-2 w-fit cursor-pointer px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-indigo-300 hover:text-indigo-400 transition">
                📷 Upload photo
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            )}
          </div>

          {/* Anonymity note */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-600 flex items-start gap-2">
            <span>🔒</span>
            <p>Your name, email, and roll number are <strong>never shared</strong> with the vendor. Only the complaint content and an anonymous ID are visible to them.</p>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!category || !text.trim() || submitting}
            className="w-full py-3 rounded-xl bg-[#5352ed] hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold transition">
            {submitting ? "Submitting..." : "Submit Complaint Anonymously"}
          </button>
        </div>
      )}

      {/* ── MY COMPLAINTS TAB ── */}
      {tab === "my" && (
        <div className="space-y-3">
          {loadingMine && (
            <div className="space-y-3 animate-pulse">
              {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl" />)}
            </div>
          )}

          {!loadingMine && myComplaints.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-12">No complaints filed yet.</p>
          )}

          {!loadingMine && myComplaints.map((c) => {
            const daysOld = getDaysOld(c.createdAt);
            return (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{CATEGORIES.find(cat => cat.id === c.category)?.emoji}</span>
                    <span className="font-semibold text-gray-800 text-sm">{c.categoryLabel}</span>
                  </div>
                  <StatusBadge status={c.status} daysOld={daysOld} />
                </div>

                <p className="text-sm text-gray-600 leading-relaxed">{c.text}</p>

                {c.photoURL && (
                  <img src={c.photoURL} alt="complaint" className="w-full max-w-xs h-32 object-cover rounded-xl border border-gray-200" />
                )}

                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>
                    {c.createdAt?.toDate
                      ? c.createdAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "Just now"}
                    {c.status === "pending" && ` · ${daysOld} day${daysOld !== 1 ? "s" : ""} ago`}
                  </span>
                  <span className="text-gray-300">{c.messName}</span>
                </div>

                {/* Student marks as resolved */}
                {c.status === "pending" && (
                  <button
                    onClick={() => handleMarkResolved(c.id)}
                    disabled={resolving === c.id}
                    className="w-full py-2 rounded-xl border-2 border-green-400 text-green-600 text-sm font-semibold hover:bg-green-50 transition disabled:opacity-50">
                    {resolving === c.id ? "Marking..." : "✓ Mark as Resolved"}
                  </button>
                )}

                {c.status === "resolved" && (
                  <p className="text-xs text-green-500 text-center">
                    Resolved on {c.resolvedAt?.toDate
                      ? c.resolvedAt.toDate().toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                      : "—"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Complaint;