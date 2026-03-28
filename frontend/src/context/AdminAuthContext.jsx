// src/context/AdminAuthContext.jsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const AdminAuthContext = createContext();

const ADMIN_EMAILS = new Set([
  "bhumikamina96@gmail.com",
  "harshitkumarsingh2609@gmail.com",
]);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const loggingOutRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (loggingOutRef.current) return;

      if (firebaseUser && ADMIN_EMAILS.has(firebaseUser.email)) {
        setAdmin(firebaseUser);
      } else {
        setAdmin(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginAsAdmin = async () => {
    setError(null);
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;

      if (!ADMIN_EMAILS.has(email)) {
        await signOut(auth);
        setError("Access denied. This account is not authorised as admin.");
        return false;
      }

      setAdmin(result.user);
      navigate("/admin/dashboard");
      return true;
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") setError(err.message);
      return false;
    }
  };

  const logoutAdmin = async () => {
    loggingOutRef.current = true;
    await signOut(auth);
    setAdmin(null);
    loggingOutRef.current = false;
    navigate("/");
  };

  return (
    <AdminAuthContext.Provider
      value={{ admin, loading, error, loginAsAdmin, logoutAdmin }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export const useAdminAuth = () => useContext(AdminAuthContext);
export { ADMIN_EMAILS };