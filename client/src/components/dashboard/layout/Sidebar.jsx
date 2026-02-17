import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../../assets/logo/logo-light.svg";

import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  User,
  Users,
  LogOut,
} from "lucide-react";

function Sidebar() {

  const navigate = useNavigate();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "Projects",
      path: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      name: "Tasks",
      path: "/dashboard/tasks",
      icon: CheckSquare,
    },
    {
      name: "Team",
      path: "/dashboard/team",
      icon: Users,
    },
    {
      name: "Profile",
      path: "/dashboard/profile",
      icon: User,
    },
  ];


  const handleLogout = () => {

    // future: clear auth token here

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

        flex flex-col

        z-40
      "
    >

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
            w-44
            object-contain
          "
        />

      </div>



      {/* Navigation */}
      <nav
        className="
          flex-1

          px-3 py-4

          space-y-1
        "
      >

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
                    ? "text-white bg-white/5 border-l-2 border-purple-500"
                    : "text-textSecondary hover:text-white hover:bg-white/5"
                }
                `
              }
            >

              <Icon size={18} />

              {item.name}

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

            hover:text-red-400
            hover:bg-white/5

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
