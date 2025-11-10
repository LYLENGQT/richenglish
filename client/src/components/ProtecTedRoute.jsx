import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../lib/zustand/authStore";

const ProtectedRoute = ({ allowedRoles }) => {
  const { role, name } = useAuthStore();

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/login?error=unathorize%20access" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
