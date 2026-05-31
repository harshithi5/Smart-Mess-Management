// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from '../features/landing/pages/MainPage';
import Dashboard from '../features/user/pages/Dashboard';
import VendorLogin from '../features/vendor/pages/VendorLogin';
import VendorDashboard from '../features/vendor/pages/VendorDashboard';
import AdminLogin from '../features/admin/pages/AdminLogin';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import { PublicRoute, PrivateRoute } from '../shared/components/AuthGuard';
import { VendorPublicRoute, VendorPrivateRoute } from '../shared/components/VendorAuthGuard';
import { AdminPublicRoute, AdminPrivateRoute } from '../shared/components/AdminAuthGuard';

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