// src/components/AdminAuthGuard.jsx
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

// Admin already logged in — send to admin dashboard
export function AdminPublicRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return null;
  if (admin) return <Navigate to="/admin/dashboard" replace />;
  return children;
}

// Not an admin — send to home
export function AdminPrivateRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return null;
  if (!admin) return <Navigate to="/" replace />;
  return children;
}