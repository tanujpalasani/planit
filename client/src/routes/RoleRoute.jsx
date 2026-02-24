import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

function RoleRoute({ role }) {
  const { user } = useAppContext();
  const location = useLocation();
  const isAuthenticated = Boolean(
    user &&
    (typeof user.id === "string" || typeof user.id === "number") &&
    typeof user.email === "string" &&
    user.email.trim(),
  );

  if (!isAuthenticated || !user.role) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && user.role !== role) {
    const redirectPath = user.role === "Admin" ? "/admin" : "/member";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
