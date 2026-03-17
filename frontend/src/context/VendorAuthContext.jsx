// src/context/VendorAuthContext.jsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const VendorAuthContext = createContext();

const VENDOR_MESS_MAP = {
  "oak@iitmandi.ac.in":              { messId: "mess1", messName: "Mess 1" },
  "pine@iitmandi.ac.in":             { messId: "mess2", messName: "Mess 2" },
  "alder@iitmandi.ac.in":            { messId: "mess3", messName: "Mess 3" },
  "tulsi@iitmandi.ac.in":            { messId: "mess4", messName: "Mess 4" },
  "cedar@iitmandi.ac.in":            { messId: "mess5", messName: "Mess 5" },
  "bhumikamina96@gmail.com":         { messId: "admin", messName: "Admin" },
  "harshitkumarsingh2609@gmail.com": { messId: "admin", messName: "Admin" },
};

export function VendorAuthProvider({ children }) {
  const [vendor, setVendor] = useState(null);
  const [vendorMess, setVendorMess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const loggingOutRef = useRef(false); // prevent onAuthStateChanged side effects during logout

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (loggingOutRef.current) return; // skip during manual logout

      if (firebaseUser) {
        const messInfo = VENDOR_MESS_MAP[firebaseUser.email];
        if (messInfo) {
          setVendor(firebaseUser);
          setVendorMess(messInfo);
        }
        // if not a vendor email, do nothing — AuthContext handles user accounts
      } else {
        setVendor(null);
        setVendorMess(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginAsVendor = async () => {
    setError(null);
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email;
      const messInfo = VENDOR_MESS_MAP[email];

      if (!messInfo) {
        await signOut(auth);
        setError("Access denied. This account is not authorised as a vendor.");
        return false;
      }

      setVendor(result.user);
      setVendorMess(messInfo);
      navigate("/vendor/dashboard");
      return true;
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") setError(err.message);
      return false;
    }
  };

  const logoutVendor = async () => {
    await signOut(auth);
    localStorage.removeItem("userType");
    setUserType(null);
    setUserProfile(null);
    navigate("/");
  };

  return (
    <VendorAuthContext.Provider
      value={{ vendor, vendorMess, loading, error, loginAsVendor, logoutVendor }}
    >
      {children}
    </VendorAuthContext.Provider>
  );
}

export const useVendorAuth = () => useContext(VendorAuthContext);