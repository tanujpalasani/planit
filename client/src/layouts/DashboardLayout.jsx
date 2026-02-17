import Sidebar from "../components/dashboard/layout/Sidebar";
import Topbar from "../components/dashboard/layout/Topbar";
import { Outlet } from "react-router-dom";

function DashboardLayout() {
  return (
    <div className="bg-primary text-white min-h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main wrapper */}
      <div className="
        ml-64
        min-h-screen
        flex flex-col
      ">

        {/* Topbar */}
        <Topbar />

        {/* Main content */}
        <main className="
          flex-1
          p-6
          md:p-8
          lg:p-10

          bg-gradient-to-br
          from-primary
          via-primary
          to-secondary

          relative
          overflow-x-hidden
        ">

          {/* Background glow */}
          <div className="absolute inset-0 -z-10 overflow-hidden">

            <div className="
              absolute top-[10%] left-[20%]
              w-[400px] h-[400px]
              bg-purple-600/10
              blur-[140px]
              rounded-full
            " />

            <div className="
              absolute bottom-[10%] right-[20%]
              w-[400px] h-[400px]
              bg-pink-600/10
              blur-[140px]
              rounded-full
            " />

          </div>

          {/* THIS renders DashboardHome */}
          <Outlet />

        </main>

      </div>

    </div>
  );
}

export default DashboardLayout;
