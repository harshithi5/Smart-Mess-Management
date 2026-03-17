// src/services/messService.js
import {
  doc, getDoc, setDoc, updateDoc,
  collection, getDocs, runTransaction, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

export const MESSES = [
  { id: "mess1", name: "Peepal", capacity: 150 },
  { id: "mess2", name: "Oak", capacity: 150 },
  { id: "mess3", name: "Pine", capacity: 120 },
  { id: "mess4", name: "Alder", capacity: 120 },
  { id: "mess5", name: "Tulsi", capacity: 100 },
  { id: "mess6", name: "Cedar", capacity: 100 },
];

// Check if form is open (last 3 days of current month)
export const isFormOpen = () => {
  const now = new Date();
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return now.getDate() >= lastDay - 2; // opens on 28/29/30/31
};

// Get the allocation month key e.g. "2026-04"
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

// Check if user already submitted form for next month
export const getUserAllocation = async (uid, monthKey) => {
  const ref = doc(db, "messAllocations", monthKey, "submissions", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

// Submit mess preference — first come first serve with transaction
export const submitMessPreference = async (user, messId, monthKey) => {
  const mess = MESSES.find((m) => m.id === messId);
  if (!mess) throw new Error("Invalid mess selected.");

  const messRef = doc(db, "messAllocations", monthKey, "messes", messId);
  const submissionRef = doc(db, "messAllocations", monthKey, "submissions", user.uid);
  const userRef = doc(db, "users", user.uid);

  await runTransaction(db, async (transaction) => {
    const messSnap = await transaction.get(messRef);
    const submissionSnap = await transaction.get(submissionRef);

    if (submissionSnap.exists()) throw new Error("You have already submitted for this month.");

    const filled = messSnap.exists() ? (messSnap.data().filled || 0) : 0;
    if (filled >= mess.capacity) throw new Error(`${mess.name} is full. Please choose another.`);

    // Update mess filled count
    transaction.set(messRef, { filled: filled + 1 }, { merge: true });

    // Save user submission
    transaction.set(submissionRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      messId,
      messName: mess.name,
      submittedAt: serverTimestamp(),
    });

    // Update user profile with current mess
    transaction.update(userRef, { currentMess: mess.name });
  });
};