// src/Admin/AdminLeftbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import Logo from "../assets/logo.svg";
import Home from "../assets/home.svg";
import Notification from "../assets/notification.svg";
import Logout from "../assets/logout.svg";

function NavItem({ icon, emoji, label, onClick }) {
  return (
    <div
      className="flex items-end gap-3 cursor-pointer group w-max"
      onClick={onClick}
    >
      {icon
        ? <img src={icon} className="h-6 group-hover:brightness-0 group-hover:grayscale transition-all" />
        : <span className="h-6 w-6 flex items-center justify-center text-base">{emoji}</span>
      }
      <div className="text-zinc-600 text-lg group-hover:text-black transition-all">{label}</div>
    </div>
  );
}

function AdminLeftbar() {
  const navigate = useNavigate();
  const { logoutAdmin } = useAdminAuth();

  return (
    <div className="h-full w-full bg-white p-10 flex flex-col items-center gap-20">

      {/* Logo */}
      <div className="flex items-center gap-2 w-full">
        <img src={Logo} className="h-12" alt="logo" />
        <div>
          <div className="text-2xl font-semibold">Mess Diary</div>
          <div className="text-xs text-[#5352ed] font-medium">Admin</div>
        </div>
      </div>

      {/* Nav */}
      <div className="w-full flex flex-col gap-6">
        <NavItem icon={Home}         label="Overview"      onClick={() => navigate("/admin/dashboard")} />
        <NavItem emoji="📋"          label="Menu"          onClick={() => navigate("/admin/dashboard/menu")} />
        <NavItem emoji="⭐"          label="Ratings"       onClick={() => navigate("/admin/dashboard/ratings")} />
        <NavItem emoji="🍽️"          label="Wastage"       onClick={() => navigate("/admin/dashboard/wastage")} />
        <NavItem emoji="📣"          label="Complaints"    onClick={() => navigate("/admin/dashboard/complaints")} />
        <NavItem icon={Notification} label="Notifications" onClick={() => navigate("/admin/dashboard/notifications")} />
        <NavItem icon={Logout}       label="Logout"        onClick={logoutAdmin} />
      </div>

    </div>
  );
}

export default AdminLeftbar;