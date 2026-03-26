import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/appContextShared";

export function ProtectedRoute({ children }) {
  const { user } = useApp();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

export function SuperAdminRoute({ children }) {
  const { user } = useApp();

  if (!user || user.role !== "super_admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function RestaurantAdminRoute({ children }) {
  const { user } = useApp();

  if (!user || user.role !== "restaurant_admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function UserRoute({ children }) {
  const { user } = useApp();

  if (!user || user.role !== "user") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
