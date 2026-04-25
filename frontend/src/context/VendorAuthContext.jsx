// src/context/VendorAuthContext.jsx
import { createContext, useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

const VendorAuthContext = createContext();

// ── messIds MUST match the MESSES array in messService.js ──
// mess1=Peepal, mess2=Oak, mess3=Pine, mess4=Alder, mess5=Tulsi, mess6=Cedar
const VENDOR_MESS_MAP = {
  "oak@iitmandi.ac.in":              { messId: "mess2", messName: "Oak"    },
  "pine@iitmandi.ac.in":             { messId: "mess3", messName: "Pine"   },
  "alder@iitmandi.ac.in":            { messId: "mess4", messName: "Alder"  },
  "tulsi@iitmandi.ac.in":            { messId: "mess5", messName: "Tulsi"  },
  "cedar@iitmandi.ac.in":            { messId: "mess6", messName: "Cedar"  },
  // Admin emails can log in as vendor for testing (Alder mess)
  "bhumikamina96@gmail.com":         { messId: "mess4", messName: "Alder"  },
  "harshitkumarsingh2609@gmail.com": { messId: "mess4", messName: "Alder"  },
};

export function VendorAuthProvider({ children }) {
  const [vendor, setVendor] = useState(null);
  const [vendorMess, setVendorMess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const loggingOutRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (loggingOutRef.current) return;
      const savedRole = localStorage.getItem("vendorRole");
      if (firebaseUser && savedRole === "vendor") {
        const messInfo = VENDOR_MESS_MAP[firebaseUser.email];
        if (messInfo) {
          setVendor(firebaseUser);
          setVendorMess(messInfo);
        } else {
          setVendor(null);
          setVendorMess(null);
        }
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
      localStorage.setItem("vendorRole", "vendor");
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
    loggingOutRef.current = true;
    await signOut(auth);
    setVendor(null);
    setVendorMess(null);
    localStorage.removeItem("vendorRole");
    loggingOutRef.current = false;
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