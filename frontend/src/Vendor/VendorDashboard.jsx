// src/Vendor/VendorDashboard.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import VendorLeftbar from "./VendorLeftbar";
import VendorScanner from "./VendorScanner";
import VendorHome from "./VendorHome";
import VendorNotifications from "./VendorNotifications";
import VendorComplaints from "./VendorComplaints";
import VendorWastage from "./VendorWastage";

function VendorDashboard() {
  return (
    <div className="flex">
      <div className="h-screen w-48 lg:w-80">
        <VendorLeftbar />
      </div>
      <div className="h-screen flex-1 bg-zinc-100 overflow-y-auto">
        <Routes>
          <Route path="/"              element={<VendorHome />}          />
          <Route path="/scanner"       element={<VendorScanner />}       />
          <Route path="/notifications" element={<VendorNotifications />} />
          <Route path="/complaints"    element={<VendorComplaints />}    />
          <Route path="/wastage"       element={<VendorWastage />}       />
        </Routes>
      </div>
    </div>
  );
}

export default VendorDashboard;