// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
const ALLOWED_DOMAIN = "iitmandi.ac.in";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
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
    navigate("/");
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
