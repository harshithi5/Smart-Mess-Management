// src/components/VendorAuthGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useVendorAuth } from '../context/VendorAuthContext';

// Vendor is already logged in — send to vendor dashboard
export function VendorPublicRoute({ children }) {
  const { vendor, loading } = useVendorAuth();
  if (loading) return null;
  if (vendor) return <Navigate to="/vendor/dashboard" replace />;
  return children;
}

// Not a vendor — send to home
export function VendorPrivateRoute({ children }) {
  const { vendor, loading } = useVendorAuth();
  if (loading) return null;
  if (!vendor) return <Navigate to="/" replace />;
  return children;
}