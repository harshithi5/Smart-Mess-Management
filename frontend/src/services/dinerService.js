// src/services/dinerService.js
import {
  doc, setDoc, deleteDoc, collection,
  onSnapshot, serverTimestamp, query, where, getDocs
} from "firebase/firestore";
import { db } from "../firebase";

const DINE_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

// Called when QR is scanned — adds user as active diner
export const checkInDiner = async (messId, uid, name) => {
  const ref = doc(db, "messes", messId, "activeDiners", uid);
  const expiresAt = new Date(Date.now() + DINE_WINDOW_MS);
  await setDoc(ref, {
    uid,
    name,
    checkedInAt: serverTimestamp(),
    expiresAt: expiresAt.toISOString(),
  });
};

// Called to manually check out (optional)
export const checkOutDiner = async (messId, uid) => {
  const ref = doc(db, "messes", messId, "activeDiners", uid);
  await deleteDoc(ref);
};

// Clean up expired diners (call this on load)
export const cleanExpiredDiners = async (messId) => {
  const ref = collection(db, "messes", messId, "activeDiners");
  const snap = await getDocs(ref);
  const now = new Date();
  const deletes = [];
  snap.forEach((d) => {
    const expires = new Date(d.data().expiresAt);
    if (expires < now) deletes.push(deleteDoc(d.ref));
  });
  await Promise.all(deletes);
};

// Live listener for active diner count
export const subscribeToDinerCount = (messId, onChange) => {
  const ref = collection(db, "messes", messId, "activeDiners");
  return onSnapshot(ref, (snap) => {
    // Filter out expired on client side too
    const now = new Date();
    const active = snap.docs.filter(
      (d) => new Date(d.data().expiresAt) > now
    );
    onChange(active.length);
  });
};