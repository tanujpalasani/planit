import { useLocation } from "react-router-dom";
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

    if (location.pathname.startsWith("/admin/calendar") || location.pathname.startsWith("/member/calendar"))
      return "Calendar";

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

        sticky top-0 z-30

        bg-primary/80
        backdrop-blur-xl

        border-b border-white/10
        relative
        overflow-hidden
      "
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-primary opacity-70" />

      {/* Left section */}
      <div className="flex items-center">

        {/* Page title */}
        <h1 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
          {getTitle()}
        </h1>

      </div>



      {/* Right section */}
      <div className="flex items-center gap-4">

        {/* User profile */}
        <div
          className="
            flex items-center gap-3

            px-3 py-1.5 pr-4

            rounded-lg

            border border-white/10
            bg-white/5
            hover:bg-white/10

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
