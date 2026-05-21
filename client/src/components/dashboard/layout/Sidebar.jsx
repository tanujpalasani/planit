import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo/logo-light.svg";

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  CalendarDays,
  User,
  Users,
  LogOut,
} from "lucide-react";
import { useAppContext } from "../../../context/useAppContext";

function Sidebar({ role }) {

  const navigate = useNavigate();
  const { user, logout } = useAppContext();
  const effectiveRole = role || user?.role || "Member";
  const basePath = effectiveRole === "Admin" ? "/admin" : "/member";

  const navItems = effectiveRole === "Admin"
    ? [
        {
          name: "Dashboard",
          path: `${basePath}`,
          icon: LayoutDashboard,
          end: true,
        },
        {
          name: "Projects",
          path: `${basePath}/projects`,
          icon: FolderKanban,
        },
        {
          name: "Tasks",
          path: `${basePath}/tasks`,
          icon: CheckSquare,
        },
        {
          name: "Calendar",
          path: `${basePath}/calendar`,
          icon: CalendarDays,
        },
        {
          name: "Team",
          path: `${basePath}/team`,
          icon: Users,
        },
        {
          name: "Profile",
          path: `${basePath}/profile`,
          icon: User,
        },
      ]
    : [
        {
          name: "Dashboard",
          path: `${basePath}`,
          icon: LayoutDashboard,
          end: true,
        },
        {
          name: "My Tasks",
          path: `${basePath}/tasks`,
          icon: CheckSquare,
        },
        {
          name: "Projects",
          path: `${basePath}/projects`,
          icon: FolderKanban,
        },
        {
          name: "Calendar",
          path: `${basePath}/calendar`,
          icon: CalendarDays,
        },
        {
          name: "Profile",
          path: `${basePath}/profile`,
          icon: User,
        },
      ];


  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };


  return (
    <aside
      className="
        fixed top-0 left-0

        h-screen w-64

        bg-primary/95
        backdrop-blur-xl

        border-r border-white/10
        overflow-hidden

        flex flex-col

        z-40
      "
    >
      <div className="pointer-events-none absolute inset-y-0 right-0 w-[1px] bg-gradient-primary opacity-60" />
      <div className="pointer-events-none absolute -top-24 -left-20 h-60 w-60 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-16 h-52 w-52 rounded-full bg-gradient-primary opacity-20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-primary opacity-10 blur-2xl" />

      {/* Logo */}
      <div
        className="
          h-16

          flex items-center

          px-4

          border-b border-white/10
        "
      >

        <img
          src={Logo}
          alt="PlanIt Logo"
          className="
            w-60
            object-contain
          "
        />

      </div>

      <div className="mx-3 mt-4 rounded-xl border border-white/15 bg-white/5 p-3">
        <p className="text-[11px] uppercase tracking-[0.16em] text-textSecondary">
          Workspace
        </p>
        <p className="mt-2 inline-flex items-center rounded-full bg-gradient-primary px-2.5 py-1 text-xs font-semibold text-white">
          {effectiveRole} Dashboard
        </p>
      </div>


      {/* Navigation */}
      <nav
        className="
          flex-1

          px-3 py-4

          space-y-1
        "
      >
        <p className="px-2 pb-2 text-[11px] uppercase tracking-[0.14em] text-textSecondary">
          Navigation
        </p>

        {navItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.end || false}
              className={({ isActive }) =>
                `
                relative

                flex items-center gap-3

                px-3 py-2.5

                rounded-lg

                text-sm font-medium

                transition-all duration-200

                ${
                  isActive
                    ? "text-white bg-white/10 border border-white/15 shadow-[0_10px_28px_rgba(0,0,0,0.25)] [&>span:first-child]:opacity-100 [&>span:nth-child(2)]:opacity-20 [&>span:nth-child(3)]:bg-white/20"
                    : "text-textSecondary hover:text-white hover:bg-white/5 hover:border hover:border-white/10"
                }
                `
              }
            >
              <span className="pointer-events-none absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-gradient-primary opacity-0 transition-opacity duration-200" />
              <span className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-primary opacity-0 transition-opacity duration-200" />

              <span className="relative z-10 flex h-7 w-7 items-center justify-center rounded-md bg-white/10 transition-colors duration-200">
                <Icon size={16} />
              </span>

              <span className="relative z-10">{item.name}</span>

            </NavLink>
          );

        })}

      </nav>



      {/* Logout Section */}
      <div
        className="
          px-3 py-4

          border-t border-white/10
        "
      >

        <button
          onClick={handleLogout}
          className="
            w-full

            flex items-center gap-3

            px-3 py-2.5

            rounded-lg

            text-sm font-medium

            text-textSecondary

            hover:text-white
            hover:bg-white/5 hover:border hover:border-white/10

            transition-all duration-200
          "
        >

          <LogOut size={18} />

          Logout

        </button>

      </div>

    </aside>
  );
}

export default Sidebar;
