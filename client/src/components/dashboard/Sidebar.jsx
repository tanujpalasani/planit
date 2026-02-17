import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  User,
  LogOut
} from "lucide-react";

import Logo from "/src/assets/logo/logo-light.svg";

function Sidebar() {

  const navItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard"
    },
    {
      name: "Projects",
      icon: FolderKanban,
      path: "/dashboard/projects"
    },
    {
      name: "Tasks",
      icon: CheckSquare,
      path: "/dashboard/tasks"
    },
    {
      name: "Profile",
      icon: User,
      path: "/dashboard/profile"
    }
  ];


  return (
    <aside
      className="
        fixed left-0 top-0
        w-64 h-screen

        bg-gradient-to-b
        from-secondary
        via-secondary
        to-primary

        border-r border-white/10

        flex flex-col
        justify-between

        backdrop-blur-xl
      "
    >

      {/* ===== Top Section ===== */}
      <div>

        {/* Logo */}
        <div className="
          h-16
          flex items-center
          px-6
          border-b border-white/10
        ">

          <img
            src={Logo}
            alt="PlanIt Logo"
            className="
              w-36
              scale-125
              origin-left
              object-contain
            "
          />

        </div>


        {/* Navigation */}
        <nav className="p-3 space-y-1">

          {navItems.map((item, index) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={index}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) => `
                  
                  relative
                  flex items-center gap-3

                  px-4 py-3
                  rounded-lg

                  text-sm font-medium

                  transition-all duration-300

                  group

                  ${
                    isActive
                      ? `
                        bg-white/10
                        text-white
                        shadow-lg
                      `
                      : `
                        text-textSecondary
                        hover:text-white
                        hover:bg-white/5
                      `
                  }
                `}
              >

                {/* Active Indicator */}
                <span
                  className="
                    absolute left-0 top-1/2 -translate-y-1/2
                    h-6 w-1
                    bg-gradient-primary
                    rounded-r-full
                    opacity-0
                    group-[.active]:opacity-100
                  "
                />

                {/* Icon */}
                <Icon size={18} />

                {/* Text */}
                {item.name}

              </NavLink>
            );

          })}

        </nav>

      </div>



      {/* ===== Bottom Section ===== */}
      <div className="p-3 border-t border-white/10">

        <button
          className="
            w-full

            flex items-center gap-3

            px-4 py-3
            rounded-lg

            text-textSecondary
            hover:text-white
            hover:bg-white/5

            transition-all duration-300
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
