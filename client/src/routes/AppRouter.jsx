import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* Public Pages */
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";

/* Role Routing */
import RoleRoute from "./RoleRoute";

/* Dashboard Layouts */
import AdminLayout from "../layouts/AdminLayout";
import MemberLayout from "../layouts/MemberLayout";

/* Dashboard Pages */
import DashboardHome from "../pages/Dashboard/DashboardHome";
import Projects from "../pages/Dashboard/Projects";
import Tasks from "../pages/Dashboard/Tasks";
import Profile from "../pages/Dashboard/Profile";
import ProjectDetails from "../pages/Dashboard/ProjectDetails";
import Team from "../pages/Dashboard/Team";
import Calendar from "../pages/Dashboard/Calendar";
import { useAppContext } from "../context/useAppContext";


function AppRouter() {
  const { user, isBootstrapping } = useAppContext();

  if (isBootstrapping) {
    return null;
  }

  const isValidRole = user?.role === "Admin" || user?.role === "Member";
  const dashboardRedirect = user?.role === "Member"
    ? "/member"
    : user?.role === "Admin"
      ? "/admin"
      : "/login";

  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={isValidRole ? <Navigate to={dashboardRedirect} replace /> : <Login />}
        />

        <Route
          path="/signup"
          element={isValidRole ? <Navigate to={dashboardRedirect} replace /> : <Signup />}
        />


        {/* Admin Routes */}
        <Route element={<RoleRoute role="Admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:projectId" element={<ProjectDetails />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="team" element={<Team />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Member Routes */}
        <Route element={<RoleRoute role="Member" />}>
          <Route path="/member" element={<MemberLayout />}>
            <Route index element={<DashboardHome memberView={true} />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:projectId" element={<ProjectDetails />} />
            <Route path="tasks" element={<Tasks assignedOnly={true} />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        {/* Legacy dashboard redirect */}
        <Route path="/dashboard" element={<Navigate to={dashboardRedirect} replace />} />


        {/* Optional fallback route */}
        <Route
          path="*"
          element={
            <div className="text-white p-10">
              Page not found
            </div>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default AppRouter;
