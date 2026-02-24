import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { useAppContext } from "../../../context/useAppContext";

function Topbar() {

  const location = useLocation();
  const { user } = useAppContext();
  const displayName = user?.name?.trim() || "User";
  const displayEmail = user?.email?.trim() || "No email";
  const avatarLetter = displayName.charAt(0).toUpperCase();

  // Dynamic title based on route
  const getTitle = () => {

    if (location.pathname === "/admin" || location.pathname === "/member") return "Dashboard";

    if (location.pathname.startsWith("/admin/projects"))
      return "Projects";

    if (location.pathname.startsWith("/admin/tasks"))
      return "Tasks";

    if (location.pathname.startsWith("/member/tasks"))
      return "My Tasks";

    if (location.pathname.startsWith("/admin/profile") || location.pathname.startsWith("/member/profile"))
      return "Profile";

    if (location.pathname.startsWith("/admin/team"))
      return "Team";

    return "Dashboard";
  };


  return (
    <header
      className="
        h-16

        flex items-center justify-between

        px-6

        bg-primary/80
        backdrop-blur-xl

        border-b border-white/10
      "
    >

      {/* Left section */}
      <div className="flex items-center gap-6">

        {/* Page title */}
        <h1 className="text-lg font-semibold">
          {getTitle()}
        </h1>


        {/* Search */}
        <div
          className="
            hidden md:flex

            items-center gap-2

            px-3 py-1.5

            bg-white/5
            border border-white/10

            rounded-lg

            text-textSecondary
          "
        >

          <Search size={16} />

          <input
            type="text"
            placeholder="Search..."
            className="
              bg-transparent
              outline-none

              text-sm

              placeholder:text-textSecondary
            "
          />

        </div>

      </div>



      {/* Right section */}
      <div className="flex items-center gap-4">

        {/* User profile */}
        <div
          className="
            flex items-center gap-3

            px-3 py-1.5

            rounded-lg

            hover:bg-white/5

            cursor-pointer

            transition-all
          "
        >

          {/* Avatar */}
          <div
            className="
              w-8 h-8

              flex items-center justify-center

              rounded-full

              bg-gradient-primary

              text-sm font-semibold
            "
          >
            {avatarLetter}
          </div>


          {/* Name */}
          <div className="hidden sm:block">

            <p className="text-sm font-medium">
              {displayName}
            </p>

            <p className="text-xs text-textSecondary">
              {displayEmail}
            </p>

          </div>

        </div>

      </div>


    </header>
  );
}

export default Topbar;
