// src/Admin/AdminDashboard.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLeftbar from "./AdminLeftbar";
import AdminHome from "./AdminHome";
import AdminNotifications from "./AdminNotifications";
import AdminMenu from "./AdminMenu";
import AdminRatings from "./AdminRatings";
import AdminWastage from "./AdminWastage";
import AdminComplaints from "./AdminComplaints";

function AdminDashboard() {
  return (
    <div className="flex">
      <div className="h-screen w-48 lg:w-80 sticky top-0">
        <AdminLeftbar />
      </div>
      <div className="h-screen flex-1 bg-zinc-100 overflow-y-auto">
        <Routes>
          <Route path="/"              element={<AdminHome />}          />
          <Route path="/menu"          element={<AdminMenu />}          />
          <Route path="/ratings"       element={<AdminRatings />}       />
          <Route path="/wastage"       element={<AdminWastage />}       />
          <Route path="/complaints"    element={<AdminComplaints />}    />
          <Route path="/notifications" element={<AdminNotifications />} />
        </Routes>
      </div>
    </div>
  );
}

export default AdminDashboard;