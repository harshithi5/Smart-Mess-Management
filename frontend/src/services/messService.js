// src/services/messService.js
import {
  doc, getDoc, setDoc, updateDoc,
  collection, getDocs, runTransaction, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

export const MESSES = [
  { id: "mess1", name: "Peepal", capacity: 150 },
  { id: "mess2", name: "Oak",    capacity: 150 },
  { id: "mess3", name: "Pine",   capacity: 120 },
  { id: "mess4", name: "Alder",  capacity: 120 },
  { id: "mess5", name: "Tulsi",  capacity: 100 },
  { id: "mess6", name: "Cedar",  capacity: 100 },
];

// ── Hardcoded allocations — skips Firestore for known students ──────────────
// Key = uid from Firebase Auth. Value = mess allocation object.
// Add more students here as needed.
export const HARDCODED_ALLOCATIONS = {
  // Harshit — b23133@students.iitmandi.ac.in
  // Replace YOUR_HARSHIT_UID with Harshit's actual Firebase Auth UID
  "jxoA2guOw1MGdSNsA20iIUC78E73": {
    messId: "mess4",
    messName: "Alder",
    submittedAt: null,
    hardcoded: true,
  },
  "6qAdRGBF7rWp3lZ5orQurKGmnTL2": {
    messId: "mess4",
    messName: "Alder",
    submittedAt: null,
    hardcoded: true,
  },
};

// Check if form is open (last 3 days of current month)
export const isFormOpen = () => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return now.getDate() >= lastDay - 2;
};

// Days until form opens
export const daysUntilFormOpen = () => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const opensOn = lastDay - 2;
  return Math.max(0, opensOn - now.getDate());
};

// Get the allocation month key e.g. "2026-05"
export const getNextMonthKey = () => {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, "0")}`;
};

// Get or create user profile in Firestore
export const getUserProfile = async (user) => {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    const profile = {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      currentMess: null,
      createdAt: serverTimestamp(),
    };
    await setDoc(ref, profile);
    return profile;
  }
  return snap.data();
};

// Get all mess capacities with current filled count for a given month
export const getMessCapacities = async (monthKey) => {
  const result = [];
  for (const mess of MESSES) {
    const ref = doc(db, "messAllocations", monthKey, "messes", mess.id);
    const snap = await getDoc(ref);
    const filled = snap.exists() ? (snap.data().filled || 0) : 0;
    result.push({ ...mess, filled });
  }
  return result;
};

// Get allocation — checks hardcoded map first, then Firestore
export const getUserAllocation = async (uid, monthKey) => {
  // Return hardcoded allocation instantly if available
  if (HARDCODED_ALLOCATIONS[uid]) {
    return HARDCODED_ALLOCATIONS[uid];
  }
  const ref = doc(db, "messAllocations", monthKey, "submissions", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

// Submit mess preference with priority list — first come first serve
// preferences = array of messIds in priority order e.g. ["mess4","mess1","mess2",...]
export const submitMessPreference = async (user, preferences, monthKey) => {
  const submissionRef = doc(db, "messAllocations", monthKey, "submissions", user.uid);
  const userRef = doc(db, "users", user.uid);

  // Try each preference in order until one succeeds
  for (const messId of preferences) {
    const mess = MESSES.find((m) => m.id === messId);
    if (!mess) continue;

    const messRef = doc(db, "messAllocations", monthKey, "messes", messId);

    try {
      await runTransaction(db, async (transaction) => {
        const messSnap       = await transaction.get(messRef);
        const submissionSnap = await transaction.get(submissionRef);

        if (submissionSnap.exists()) throw new Error("ALREADY_SUBMITTED");

        const filled = messSnap.exists() ? (messSnap.data().filled || 0) : 0;
        if (filled >= mess.capacity) throw new Error("MESS_FULL");

        transaction.set(messRef, { filled: filled + 1 }, { merge: true });
        transaction.set(submissionRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          messId,
          messName: mess.name,
          preferences,           // store priority list for reference
          submittedAt: serverTimestamp(),
        });
        transaction.set(userRef, { currentMess: mess.name }, { merge: true });
      });

      // Transaction succeeded — return allocated mess
      return { messId, messName: mess.name };

    } catch (err) {
      if (err.message === "ALREADY_SUBMITTED") {
        throw new Error("You have already submitted for this month.");
      }
      if (err.message === "MESS_FULL") {
        // Try next preference
        continue;
      }
      throw err;
    }
  }

  // All preferences were full
  throw new Error("All your preferred messes are full. Please contact the mess office.");
};