// src/Admin/AdminLogin.jsx
import React from "react";
import { useAdminAuth } from "../context/AdminAuthContext";
import Logo from "../assets/logo.svg";

function AdminLogin() {
  const { loginAsAdmin, error, loading } = useAdminAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-sm flex flex-col items-center gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={Logo} className="h-12" alt="logo" />
          <div>
            <div className="text-2xl font-semibold">Mess Diary</div>
            <div className="text-xs text-[#5352ed] font-medium">Admin Portal</div>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center">
          Sign in with your admin Google account to access the dashboard.
        </p>

        {error && (
          <div className="w-full bg-red-50 border border-red-200 text-red-500 text-sm rounded-xl px-4 py-3 text-center">
            {error}
          </div>
        )}

        <button
          onClick={loginAsAdmin}
          disabled={loading}
          className="flex items-center gap-3 w-full justify-center px-5 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

      </div>
    </div>
  );
}

export default AdminLogin;