// src/Vendor/VendorHome.jsx
import React, { useEffect, useState } from "react";
import { useVendorAuth } from "../context/VendorAuthContext";
import { subscribeToDinerCount, cleanExpiredDiners } from "../services/dinerService";
import { MESSES } from "../services/messService";
import { useNavigate } from "react-router-dom";

function VendorHome() {
  const { vendor, vendorMess } = useVendorAuth();
  const navigate = useNavigate();
  const [dinerCount, setDinerCount] = useState(0);

  const messId = vendorMess?.messId;
  const mess = MESSES.find(m => m.id === messId);
  const capacity = mess?.capacity ?? 100;
  const percent = Math.round((dinerCount / capacity) * 100);

  useEffect(() => {
    if (!messId || messId === "admin") return;
    cleanExpiredDiners(messId);
    const unsub = subscribeToDinerCount(messId, setDinerCount);
    return () => unsub();
  }, [messId]);

  const crowdLabel =
    percent >= 90 ? "🔴 Very Crowded" :
    percent >= 60 ? "🟠 Moderately Busy" :
    percent >= 30 ? "🟡 Somewhat Busy" :
    "🟢 Quiet";

  return (
    <div className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {vendor?.displayName?.split(" ")[0]}</h1>
        <p className="text-gray-500 text-sm mt-1">{vendorMess?.messName} · Vendor Dashboard</p>
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Current diners */}
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm">Current Diners</p>
              <p className="text-5xl font-bold text-[#5352ed] mt-1">{dinerCount}</p>
              <p className="text-gray-400 text-sm mt-1">of {capacity} capacity</p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
              <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-600 font-medium">Live</span>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-700 ${
                percent >= 90 ? "bg-red-500" :
                percent >= 60 ? "bg-orange-400" : "bg-green-400"
              }`}
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
          </div>

          <p className="text-sm font-medium">{crowdLabel}</p>
        </div>

        {/* Quick scan shortcut */}
        <div
          className="bg-[#5352ed] rounded-xl shadow-md p-6 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-indigo-600 transition"
          onClick={() => navigate("/vendor/dashboard/scanner")}
        >
          <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-4xl">📷</span>
          </div>
          <div className="text-center">
            <p className="text-white font-bold text-xl">Scan QR</p>
            <p className="text-indigo-200 text-sm mt-1">Tap to open scanner</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorHome;