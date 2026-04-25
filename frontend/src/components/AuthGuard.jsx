// src/components/AuthGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVendorAuth } from '../context/VendorAuthContext';
import { useAdminAuth } from '../context/AdminAuthContext';

// Public route — redirect already-logged-in users to their own dashboard
export function PublicRoute({ children }) {
  const { user, loading: userLoading } = useAuth();
  const { vendor, loading: vendorLoading } = useVendorAuth();
  const { admin, loading: adminLoading } = useAdminAuth();

  if (userLoading || vendorLoading || adminLoading) return null;

  if (admin)  return <Navigate to="/admin/dashboard" replace />;
  if (vendor) return <Navigate to="/vendor/dashboard" replace />;
  if (user)   return <Navigate to="/dashboard" replace />;

  return children;
}

// Protect student dashboard
export function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
}