// src/components/VendorAuthGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useVendorAuth } from '../context/VendorAuthContext';

export function VendorPublicRoute({ children }) {
  const { vendor, loading } = useVendorAuth();
  if (loading) return null;
  if (vendor) return <Navigate to="/vendor/dashboard" replace />;
  return children;
}

export function VendorPrivateRoute({ children }) {
  const { vendor, loading } = useVendorAuth();
  if (loading) return null;
  if (!vendor) return <Navigate to="/vendor" replace />;
  return children;
}