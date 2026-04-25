// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { getUserProfile } from "../services/messService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const ALLOWED_DOMAIN = "iitmandi.ac.in";

// Pure vendor emails (not admin) — these never log in as student/guest
const VENDOR_ONLY_EMAILS = new Set([
  "oak@iitmandi.ac.in",
  "pine@iitmandi.ac.in",
  "alder@iitmandi.ac.in",
  "tulsi@iitmandi.ac.in",
  "cedar@iitmandi.ac.in",
]);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Skip pure vendor emails entirely — they never use student/guest dashboard
        if (VENDOR_ONLY_EMAILS.has(firebaseUser.email)) {
          setLoading(false);
          return;
        }

        // Skip if this session belongs to vendor or admin role
        // (admin/vendor emails that chose vendor or admin login)
        const vendorRole = localStorage.getItem("vendorRole");
        const adminRole  = localStorage.getItem("adminRole");
        if (vendorRole === "vendor" || adminRole === "admin") {
          setLoading(false);
          return;
        }

        setUser(firebaseUser);
        const savedType = localStorage.getItem("userType");
        setUserType(savedType || null);
        try {
          const profile = await getUserProfile(firebaseUser);
          setUserProfile(profile);
        } catch (e) {
          console.error("Failed to fetch user profile:", e);
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setUserType(null);
        localStorage.removeItem("userType");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginAsStudent = async () => {
    setError(null);
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;
      if (!email.endsWith(ALLOWED_DOMAIN)) {
        await signOut(auth);
        setError(`Access denied. Only ${ALLOWED_DOMAIN} accounts are allowed.`);
        return false;
      }
      localStorage.setItem("userType", "student");
      setUserType("student");
      navigate("/dashboard");
      return true;
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") setError(err.message);
      return false;
    }
  };

  const loginAsGuest = async () => {
    setError(null);
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(auth, googleProvider);
      localStorage.setItem("userType", "guest");
      setUserType("guest");
      navigate("/dashboard");
      return true;
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") setError(err.message);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("userType");
    setUserType(null);
    setUserProfile(null);
    navigate("/");
  };

  const refreshUserProfile = async () => {
    if (user) {
      const profile = await getUserProfile(user);
      setUserProfile(profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, userProfile, userType, loading, error, loginAsStudent, loginAsGuest, logout, refreshUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);