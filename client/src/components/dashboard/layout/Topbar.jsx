import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";

function Topbar() {

  const location = useLocation();

  // Dynamic title based on route
  const getTitle = () => {

    if (location.pathname === "/dashboard") return "Dashboard";

    if (location.pathname.startsWith("/dashboard/projects"))
      return "Projects";

    if (location.pathname.startsWith("/dashboard/tasks"))
      return "Tasks";

    if (location.pathname.startsWith("/dashboard/profile"))
      return "Profile";

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
            T
          </div>


          {/* Name */}
          <div className="hidden sm:block">

            <p className="text-sm font-medium">
              Tanu
            </p>

            <p className="text-xs text-textSecondary">
              Developer
            </p>

          </div>

        </div>

      </div>


    </header>
  );
}

export default Topbar;
