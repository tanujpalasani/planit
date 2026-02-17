import { BrowserRouter, Routes, Route } from "react-router-dom";

/* Public Pages */
import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";

/* Dashboard Layout */
import DashboardLayout from "../layouts/DashboardLayout";

/* Dashboard Pages */
import DashboardHome from "../pages/Dashboard/DashboardHome";

/* Future pages (we'll create later) */
 import Projects from "../pages/Dashboard/Projects";
// import Tasks from "../pages/Dashboard/Tasks";
// import Profile from "../pages/Dashboard/Profile";
import Tasks from "../pages/Dashboard/Tasks";
import Profile from "../pages/Dashboard/Profile";


import ProjectDetails from "../pages/Dashboard/ProjectDetails";


function AppRouter() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/signup" element={<Signup />} />


        {/* Dashboard Routes (Protected later) */}
        <Route path="/dashboard" element={<DashboardLayout />}>

          {/* Default Dashboard Home */}
          <Route index element={<DashboardHome />} />

          {/* Future nested routes */}
          <Route path="projects" element={<Projects />} /> 
          <Route path="projects/:projectId" element={<ProjectDetails />} />
          {/* <Route path="tasks" element={<Tasks />} /> */}
          {/* <Route path="profile" element={<Profile />} /> */}
          <Route path="tasks" element={<Tasks />} />
          <Route path="profile" element={<Profile />} />


        </Route>


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
