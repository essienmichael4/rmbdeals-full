import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const RequireAuth = ({ allowedRole }: { allowedRole: string }) => {
  const { auth } = useAuth();
  const location = useLocation();

  // If no auth stored -> not authenticated -> send to login
  if (!auth) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // If authenticated but role doesn't match -> unauthorized
  if (auth.role !== allowedRole) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Authorized
  return <Outlet />;
};

export default RequireAuth;