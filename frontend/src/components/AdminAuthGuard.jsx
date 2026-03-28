// src/components/AdminAuthGuard.jsx
import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

// Redirect logged-in admin away from /admin login page
export function AdminPublicRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return null;
  return admin ? <Navigate to="/admin/dashboard" replace /> : children;
}

// Protect /admin/dashboard — redirect to /admin if not logged in
export function AdminPrivateRoute({ children }) {
  const { admin, loading } = useAdminAuth();
  if (loading) return null;
  return admin ? children : <Navigate to="/admin" replace />;
}