// src/Navbar01.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./assets/logo.svg";
import { useAuth } from "./context/AuthContext";
import { useVendorAuth } from "./context/VendorAuthContext";
import { useAdminAuth } from "./context/AdminAuthContext";

function RoleModal({ onClose, onStudent, onGuest, onVendor, onAdmin, error, vendorError, adminError }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col gap-5">
        <div className="text-center">
          <div className="text-3xl mb-2">🍽️</div>
          <h2 className="text-xl font-black text-gray-900">Sign in to Mess Diary</h2>
          <p className="text-gray-400 text-sm mt-1">Choose how you want to continue</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <button onClick={onStudent}
            className="w-full flex items-center gap-3 bg-[#5352ed] text-white px-5 py-3.5 rounded-2xl font-semibold hover:bg-indigo-600 transition active:scale-[0.98]">
            <span className="text-xl">🎓</span>
            <div className="text-left">
              <p className="text-sm font-bold">Student Login</p>
              <p className="text-xs text-indigo-200">@students.iitmandi.ac.in</p>
            </div>
          </button>

          <button onClick={onGuest}
            className="w-full flex items-center gap-3 bg-[#ff7f56] text-white px-5 py-3.5 rounded-2xl font-semibold hover:bg-orange-500 transition active:scale-[0.98]">
            <span className="text-xl">👤</span>
            <div className="text-left">
              <p className="text-sm font-bold">Guest Login</p>
              <p className="text-xs text-orange-100">Any Google account</p>
            </div>
          </button>

          <div className="flex items-center gap-3 my-1">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300 font-medium">staff access</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button onClick={onVendor}
            className="w-full flex items-center gap-3 border-2 border-gray-200 text-gray-700 px-5 py-3 rounded-2xl font-semibold hover:border-[#5352ed] hover:text-[#5352ed] transition active:scale-[0.98]">
            <span className="text-xl">🍽️</span>
            <div className="text-left">
              <p className="text-sm font-semibold">Vendor Login</p>
              <p className="text-xs text-gray-400">Mess staff only</p>
            </div>
          </button>

          <button onClick={onAdmin}
            className="w-full flex items-center gap-3 border-2 border-gray-200 text-gray-700 px-5 py-3 rounded-2xl font-semibold hover:border-rose-400 hover:text-rose-500 transition active:scale-[0.98]">
            <span className="text-xl">🛡️</span>
            <div className="text-left">
              <p className="text-sm font-semibold">Admin Login</p>
              <p className="text-xs text-gray-400">Authorised personnel only</p>
            </div>
          </button>
        </div>

        {(error || vendorError || adminError) && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-2.5 text-center">
            {error || vendorError || adminError}
          </div>
        )}

        <button onClick={onClose} className="text-gray-400 text-sm text-center hover:text-gray-600 transition">
          Cancel
        </button>
      </div>
    </div>
  );
}

function Navbar01({ onLoginClick }) {
  const navigate = useNavigate();
  const { user, userType, loading, error, loginAsStudent, loginAsGuest, logout } = useAuth();
  const { vendor, loginAsVendor, logoutVendor, error: vendorError } = useVendorAuth();
  const { admin, loginAsAdmin, logoutAdmin, error: adminError } = useAdminAuth();
  const [showModal, setShowModal] = useState(false);
  const [scrolled, setScrolled]   = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeUser = user || vendor || admin;
  const isVendor   = !!vendor;
  const isAdmin    = !!admin;

  const openModal = () => setShowModal(true);
  // Expose openModal so Welcome button can trigger it
  if (onLoginClick) onLoginClick.current = openModal;

  const handleStudent = async () => { const ok = await loginAsStudent(); if (ok) setShowModal(false); };
  const handleGuest   = async () => { const ok = await loginAsGuest();   if (ok) setShowModal(false); };
  const handleVendor  = async () => { const ok = await loginAsVendor();  if (ok) setShowModal(false); };
  const handleAdmin   = async () => { const ok = await loginAsAdmin();   if (ok) setShowModal(false); };

  const handleLogout = async () => {
    if (isAdmin)       await logoutAdmin();
    else if (isVendor) await logoutVendor();
    else               await logout();
  };

  const displayName = isAdmin ? admin?.displayName?.split(" ")[0]
    : isVendor ? vendor?.displayName?.split(" ")[0]
    : user?.displayName?.split(" ")[0];

  const photoURL = isAdmin ? admin?.photoURL : isVendor ? vendor?.photoURL : user?.photoURL;

  const roleBadge = isAdmin
    ? <span className="text-xs bg-rose-100 text-rose-500 px-2 py-0.5 rounded-full font-semibold">Admin</span>
    : isVendor
    ? <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-semibold">Vendor</span>
    : userType === "guest"
    ? <span className="text-xs bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full font-semibold">Guest</span>
    : userType === "student"
    ? <span className="text-xs bg-indigo-100 text-indigo-500 px-2 py-0.5 rounded-full font-semibold">Student</span>
    : null;

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {showModal && (
        <RoleModal
          onClose={() => setShowModal(false)}
          onStudent={handleStudent} onGuest={handleGuest}
          onVendor={handleVendor}  onAdmin={handleAdmin}
          error={error} vendorError={vendorError} adminError={adminError}
        />
      )}

      <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300
        ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollTo("hero")}>
            <img src={Logo} className="h-10" alt="logo" />
            <span className="text-xl font-black text-gray-900">Mess Diary</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {[["hero", "Home"], ["about", "About"], ["vision", "Vision"], ["contact", "Contact"]].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-sm font-semibold text-gray-600 hover:text-[#5352ed] transition">
                {label}
              </button>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-20 bg-gray-100 rounded-xl animate-pulse" />
            ) : activeUser ? (
              <div className="flex items-center gap-2">
                {photoURL && <img src={photoURL} className="h-8 w-8 rounded-full border-2 border-white shadow-sm" referrerPolicy="no-referrer" />}
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-bold text-gray-800">{displayName}</span>
                  {roleBadge}
                </div>
                <button onClick={handleLogout}
                  className="ml-1 text-sm text-gray-500 border border-gray-200 px-3 py-1.5 rounded-xl hover:bg-gray-50 transition font-medium">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={openModal}
                className="bg-[#5352ed] text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-indigo-600 transition active:scale-95 shadow-lg shadow-indigo-100">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {(error || vendorError || adminError) && (
        <div className="fixed top-18 left-0 right-0 z-30 bg-red-50 border-b border-red-200 text-red-600 text-sm text-center py-2 px-4">
          {error || vendorError || adminError}
        </div>
      )}
    </>
  );
}

export default Navbar01;