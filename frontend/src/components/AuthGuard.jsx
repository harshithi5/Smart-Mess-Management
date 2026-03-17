// src/components/AuthGuard.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useVendorAuth } from '../context/VendorAuthContext';

export function PublicRoute({ children }) {
  const { user, loading: userLoading } = useAuth();
  const { vendor, loading: vendorLoading } = useVendorAuth();

  if (userLoading || vendorLoading) return null;
  if (vendor) return <Navigate to="/vendor/dashboard" replace />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;
  return children;
}