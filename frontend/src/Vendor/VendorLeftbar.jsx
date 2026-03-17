// src/Vendor/VendorLeftbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useVendorAuth } from "../context/VendorAuthContext";
import Logo from "../assets/logo.svg";
import Home from "../assets/home.svg";
import QR from "../assets/qr1.svg";
import Notification from "../assets/notification.svg";
import Logout from "../assets/logout.svg";

function VendorLeftbar() {
  const navigate = useNavigate();
  const { logoutVendor, vendorMess } = useVendorAuth();

  return (
    <div className="h-full w-full bg-white p-10 flex flex-col items-center gap-20">
      {/* Logo */}
      <div className="flex items-center gap-2 w-full h-max">
        <img src={Logo} className="h-12" />
        <div>
          <div className="text-2xl font-semibold">Mess Diary</div>
          <div className="text-xs text-[#5352ed] font-medium">{vendorMess?.messName} Vendor</div>
        </div>
      </div>

      {/* Nav */}
      <div className="w-full flex flex-col gap-6">

        <div
          className="flex items-end gap-3 cursor-pointer group w-max"
          onClick={() => navigate("/vendor/dashboard")}
        >
          <img src={Home} className="h-6 group-hover:brightness-0 group-hover:grayscale transition-all" />
          <div className="text-zinc-600 text-lg group-hover:text-black transition-all">Home</div>
        </div>

        <div
          className="flex items-end gap-3 cursor-pointer group w-max"
          onClick={() => navigate("/vendor/dashboard/scanner")}
        >
          <img src={QR} className="h-6 group-hover:brightness-0 group-hover:grayscale transition-all" />
          <div className="text-zinc-600 text-lg group-hover:text-black transition-all">Scanner</div>
        </div>

        <div
          className="flex items-end gap-3 cursor-pointer group w-max"
          onClick={() => navigate("/vendor/dashboard/notifications")}
        >
          <img src={Notification} className="h-6 group-hover:brightness-0 group-hover:grayscale transition-all" />
          <div className="text-zinc-600 text-lg group-hover:text-black transition-all">Notifications</div>
        </div>

        <div
          className="flex items-end gap-3 cursor-pointer group w-max"
          onClick={logoutVendor}
        >
          <img src={Logout} className="h-6 group-hover:brightness-0 group-hover:grayscale transition-all" />
          <div className="text-zinc-600 text-lg group-hover:text-black transition-all">Logout</div>
        </div>

      </div>
    </div>
  );
}

export default VendorLeftbar;