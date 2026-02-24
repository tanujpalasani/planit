import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppContext } from "../context/useAppContext";

const VALID_ROLES = new Set(["Admin", "Member"]);

function RoleRoute({ role }) {
  const { user, isBootstrapping } = useAppContext();
  const location = useLocation();

  if (isBootstrapping) {
    return null;
  }

  const isAuthenticated = Boolean(
    user &&
    (typeof user.id === "string" || typeof user.id === "number") &&
    typeof user.email === "string" &&
    user.email.trim(),
  );

  if (!isAuthenticated || !VALID_ROLES.has(user.role)) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role && (!VALID_ROLES.has(role) || user.role !== role)) {
    const redirectPath = user.role === "Admin" ? "/admin" : "/member";
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
