// src/Navbar01.jsx
import React, { useState } from "react";
import Logo from "./assets/logo.svg";
import { useAuth } from "./context/AuthContext";
import { useVendorAuth } from "./context/VendorAuthContext";

function RoleModal({ onClose, onStudent, onGuest, onVendor, error, vendorError }) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 flex flex-col gap-6">

        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800">Sign in to Mess Diary</h2>
          <p className="text-gray-500 text-sm mt-1">Choose how you want to continue</p>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={onStudent}
            className="w-full flex items-center gap-3 bg-[#5352ed] text-white px-5 py-3 rounded-xl font-semibold hover:bg-indigo-600 transition"
          >
            <span className="text-xl">🎓</span>
            <div className="text-left">
              <p className="text-sm font-semibold">Student Login</p>
              <p className="text-xs text-indigo-200">@students.iitmandi.ac.in</p>
            </div>
          </button>

          <button
            onClick={onGuest}
            className="w-full flex items-center gap-3 bg-[#ff7f56] text-white px-5 py-3 rounded-xl font-semibold hover:bg-orange-500 transition"
          >
            <span className="text-xl">👤</span>
            <div className="text-left">
              <p className="text-sm font-semibold">Guest Login</p>
              <p className="text-xs text-orange-100">Any Google account</p>
            </div>
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>

          <button
            onClick={onVendor}
            className="w-full flex items-center gap-3 border-2 border-gray-200 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:border-[#5352ed] hover:text-[#5352ed] transition"
          >
            <span className="text-xl">🍽️</span>
            <div className="text-left">
              <p className="text-sm font-semibold">Vendor Login</p>
              <p className="text-xs text-gray-400">Mess staff only</p>
            </div>
          </button>
        </div>

        {(error || vendorError) && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-4 py-2 text-center">
            {error || vendorError}
          </div>
        )}

        <button onClick={onClose} className="text-gray-400 text-sm text-center hover:text-gray-600">
          Cancel
        </button>
      </div>
    </div>
  );
}

function Navbar01() {
  const { user, userType, loading, error, loginAsStudent, loginAsGuest, logout } = useAuth();
  const { loginAsVendor, error: vendorError } = useVendorAuth();
  const [showModal, setShowModal] = useState(false);

  const handleStudent = async () => {
    const ok = await loginAsStudent();
    if (ok) setShowModal(false);
  };

  const handleGuest = async () => {
    const ok = await loginAsGuest();
    if (ok) setShowModal(false);
  };

  const handleVendor = async () => {
    const ok = await loginAsVendor();
    if (ok) setShowModal(false);
  };

  return (
    <>
      {showModal && (
        <RoleModal
          onClose={() => setShowModal(false)}
          onStudent={handleStudent}
          onGuest={handleGuest}
          onVendor={handleVendor}
          error={error}
          vendorError={vendorError}
        />
      )}

      <div className="flex h-20 bg-white w-full items-center justify-around shadow-sm">

        <div className="flex items-end gap-2">
          <img src={Logo} className="h-12" />
          <div className="md:text-2xl text-xl font-semibold">Mess Diary</div>
        </div>

        <div className="flex text-md lg:gap-20 md:gap-10 gap-5 h-12 items-end justify-center">
          <div className="cursor-pointer">Home</div>
          <div className="cursor-pointer">About</div>
          <div className="cursor-pointer">Vision</div>
          <div className="cursor-pointer">Contact Us</div>
        </div>

        <div className="flex h-12 items-end md:gap-3 gap-1">
          {loading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : user ? (
            <div className="flex items-end gap-3">
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img src={user.photoURL} className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
                )}
                <div className="text-sm font-medium text-gray-700 hidden md:block">
                  {user.displayName?.split(" ")[0]}
                  {userType === "guest" && <span className="ml-1 text-xs text-orange-400">(Guest)</span>}
                  {userType === "student" && <span className="ml-1 text-xs text-indigo-500">(Student)</span>}
                </div>
              </div>
              <button
                onClick={logout}
                className="text-gray-500 border border-gray-300 px-4 py-2 rounded-lg font-medium h-8 md:h-10 cursor-pointer flex items-center justify-center text-sm hover:bg-gray-50 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#5352ed] text-white px-5 py-2 rounded-lg font-medium h-8 md:h-10 cursor-pointer flex items-center justify-center hover:bg-indigo-600 transition"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-b border-red-200 text-red-600 text-sm text-center py-2 px-4">
          {error}
        </div>
      )}
    </>
  );
}

export default Navbar01;