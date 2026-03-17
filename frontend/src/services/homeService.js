// src/services/homeService.js
import {
  doc, getDoc, setDoc, updateDoc,
  increment, runTransaction, serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";

// Date helpers
export const todayKey = () => new Date().toISOString().split("T")[0]; // "2026-03-13"
export const yesterdayKey = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

// ── Menu ────────────────────────────────────────────────────────────────────
export const getTodayMenu = async (messId) => {
  const ref = doc(db, "messes", messId, "menu", todayKey());
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

// ── Wastage ─────────────────────────────────────────────────────────────────
export const getYesterdayWastage = async (messId) => {
  const ref = doc(db, "messes", messId, "wastage", yesterdayKey());
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

// ── Ratings ─────────────────────────────────────────────────────────────────

// Get yesterday's average rating for display
export const getYesterdayRating = async (messId) => {
  const ref = doc(db, "messes", messId, "ratings", yesterdayKey());
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

// Check if user already rated today
export const getUserTodayRating = async (messId, uid) => {
  const ref = doc(db, "messes", messId, "userRatings", `${todayKey()}_${uid}`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().rating : null;
};

// Submit rating — updates running total + count atomically
export const submitRating = async (messId, uid, rating) => {
  const ratingRef = doc(db, "messes", messId, "ratings", todayKey());
  const userRatingRef = doc(db, "messes", messId, "userRatings", `${todayKey()}_${uid}`);

  await runTransaction(db, async (transaction) => {
    const userSnap = await transaction.get(userRatingRef);
    if (userSnap.exists()) throw new Error("You have already rated today.");

    const ratingSnap = await transaction.get(ratingRef);
    const current = ratingSnap.exists() ? ratingSnap.data() : { total: 0, count: 0 };

    const newTotal = current.total + rating;
    const newCount = current.count + 1;

    transaction.set(ratingRef, {
      total: newTotal,
      count: newCount,
      average: parseFloat((newTotal / newCount).toFixed(1)),
    });

    transaction.set(userRatingRef, {
      uid,
      rating,
      submittedAt: serverTimestamp(),
    });
  });
};