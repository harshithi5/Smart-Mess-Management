// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './MainPage';
import Dashboard from './User/Dashboard';
import VendorLogin from './Vendor/VendorLogin';
import VendorDashboard from './Vendor/VendorDashboard';
import AdminLogin from './Admin/AdminLogin';
import AdminDashboard from './Admin/AdminDashboard';
import { PublicRoute, PrivateRoute } from './components/AuthGuard';
import { VendorPublicRoute, VendorPrivateRoute } from './components/VendorAuthGuard';
import { AdminPublicRoute, AdminPrivateRoute } from './components/AdminAuthGuard';

function App() {
  return (
    <Routes>
      {/* User routes */}
      <Route path="/"           element={<PublicRoute><MainPage /></PublicRoute>} />
      <Route path="/dashboard/*" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* Vendor routes */}
      <Route path="/vendor"            element={<VendorPublicRoute><VendorLogin /></VendorPublicRoute>} />
      <Route path="/vendor/dashboard/*" element={<VendorPrivateRoute><VendorDashboard /></VendorPrivateRoute>} />

      {/* Admin routes */}
      <Route path="/admin"            element={<AdminPublicRoute><AdminLogin /></AdminPublicRoute>} />
      <Route path="/admin/dashboard/*" element={<AdminPrivateRoute><AdminDashboard /></AdminPrivateRoute>} />
    </Routes>
  );
}

export default App;