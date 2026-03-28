// src/Admin/AdminDashboard.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLeftbar from "./AdminLeftbar";
import AdminHome from "./AdminHome";
import AdminNotifications from "./AdminNotifications";
import AdminMenu from "./AdminMenu";

const AdminRatings = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">Mess Ratings</h1>
    <p className="text-gray-400 text-sm">Detailed ratings per mess coming soon.</p>
  </div>
);

const AdminWastage = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">Food Wastage Reports</h1>
    <p className="text-gray-400 text-sm">Mess-wise wastage tracking coming soon.</p>
  </div>
);

const AdminComplaints = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold text-gray-800 mb-2">Student Complaints</h1>
    <p className="text-gray-400 text-sm">Complaints inbox coming soon.</p>
  </div>
);

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