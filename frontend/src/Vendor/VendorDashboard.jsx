// src/Vendor/VendorDashboard.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import VendorLeftbar from "./VendorLeftbar";
import VendorScanner from "./VendorScanner";
import VendorHome from "./VendorHome";

const VendorNotifications = () => <div className="p-6 text-xl">Notifications</div>;

function VendorDashboard() {
  return (
    <div className="flex">
      <div className="h-screen w-48 lg:w-80">
        <VendorLeftbar />
      </div>

      <div className="h-screen flex-1 bg-zinc-200 overflow-y-auto">
        <Routes>
          <Route path="/" element={<VendorHome />} />
          <Route path="/scanner" element={<VendorScanner />} />
          <Route path="/notifications" element={<VendorNotifications />} />
        </Routes>
      </div>
    </div>
  );
}

export default VendorDashboard;