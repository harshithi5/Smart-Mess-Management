// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const AuthContext = createContext();

const ALLOWED_DOMAIN = "iitmandi.ac.in";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null); // "student" | "guest" | null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Restore userType from localStorage on refresh
        const savedType = localStorage.getItem("userType");
        setUserType(savedType || null);
      } else {
        setUser(null);
        setUserType(null);
        localStorage.removeItem("userType");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Login for students — enforces @students.iitmandi.ac.in domain
  const loginAsStudent = async () => {
    setError(null);
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      if (!email.endsWith(ALLOWED_DOMAIN)) {
        await signOut(auth); // kick them out immediately
        setError(`Access denied. Only ${ALLOWED_DOMAIN} accounts are allowed.`);
        return false;
      }

      localStorage.setItem("userType", "student");
      setUserType("student");
      return true;
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message);
      }
      return false;
    }
  };

  // Guest login — any Google account is fine
  const loginAsGuest = async () => {
    setError(null);
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, googleProvider);

      localStorage.setItem("userType", "guest");
      setUserType("guest");
      return true;
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") {
        setError(err.message);
      }
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("userType");
    setUserType(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, userType, loading, error, loginAsStudent, loginAsGuest, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
