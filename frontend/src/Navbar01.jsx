// src/components/Navbar01.jsx
import React from "react";
import Logo from "./assets/logo.svg";
import { useAuth } from "./context/AuthContext";

function Navbar01() {
  const { user, userType, loading, error, loginAsStudent, loginAsGuest, logout } = useAuth();

  return (
    <>
      <div className="flex h-20 bg-white w-full items-center justify-around shadow-sm">

        {/* Logo */}
        <div className="flex items-end gap-2">
          <img src={Logo} className="h-12" />
          <div className="md:text-2xl text-xl font-semibold">Mess Diary</div>
        </div>

        {/* Links */}
        <div className="flex text-md lg:gap-20 md:gap-10 gap-5 h-12 items-end justify-center">
          <div className="cursor-pointer">Home</div>
          <div className="cursor-pointer">About</div>
          <div className="cursor-pointer">Vision</div>
          <div className="cursor-pointer">Contact Us</div>
        </div>

        {/* Buttons / User Info */}
        <div className="flex h-12 items-end md:gap-3 gap-1">
          {loading ? (
            <div className="text-gray-400 text-sm">Loading...</div>
          ) : user ? (
            // Logged-in state
            <div className="flex items-end gap-3">
              <div className="flex items-center gap-2">
                {user.photoURL && (
                  <img
                    src={user.photoURL}
                    className="h-8 w-8 rounded-full"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="text-sm font-medium text-gray-700 hidden md:block">
                  {user.displayName?.split(" ")[0]}
                  {userType === "guest" && (
                    <span className="ml-1 text-xs text-orange-400">(Guest)</span>
                  )}
                  {userType === "student" && (
                    <span className="ml-1 text-xs text-indigo-500">(Student)</span>
                  )}
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
            // Logged-out state
            <>
              <button
                onClick={loginAsStudent}
                className="text-[#5352ed] px-4 py-2 rounded font-medium h-8 md:h-10 cursor-pointer flex items-center justify-center hover:bg-indigo-50 transition"
              >
                Login
              </button>
              <button
                onClick={loginAsGuest}
                className="bg-[#ff7f56] text-white px-4 py-2 rounded-lg font-medium h-8 md:h-10 cursor-pointer flex items-center justify-center hover:bg-orange-500 transition"
              >
                Guest Login
              </button>
            </>
          )}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 text-red-600 text-sm text-center py-2 px-4">
          {error}
        </div>
      )}
    </>
  );
}

export default Navbar01;
