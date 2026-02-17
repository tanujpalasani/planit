import { Search, Bell } from "lucide-react";

function Topbar() {
  return (
    <header
      className="
        sticky top-0 z-40

        h-16
        w-full

        bg-white/5
        backdrop-blur-xl

        border-b border-white/10

        flex items-center justify-between

        px-6 md:px-8
      "
    >

      {/* Left section */}
      <div className="flex items-center gap-4">

        <h1 className="
          text-lg md:text-xl
          font-semibold
          text-white
        ">
          Dashboard
        </h1>

      </div>


      {/* Right section */}
      <div className="flex items-center gap-4">

        {/* Search */}
        <div className="relative hidden md:block">

          <Search
            size={18}
            className="
              absolute left-3 top-1/2 -translate-y-1/2
              text-textSecondary
            "
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              w-64

              pl-10 pr-4 py-2

              bg-white/5
              border border-white/10
              rounded-lg

              text-sm text-white
              placeholder:text-textSecondary

              focus:outline-none
              focus:border-purple-500
              focus:ring-1 focus:ring-purple-500

              transition-all duration-300
            "
          />

        </div>


        {/* Notification */}
        <button
          className="
            relative

            p-2
            rounded-lg

            text-textSecondary
            hover:text-white
            hover:bg-white/5

            transition-all duration-300
          "
        >
          <Bell size={20} />

          {/* Notification dot */}
          <span className="
            absolute top-1 right-1

            w-2 h-2
            rounded-full

            bg-pink-500
          " />
        </button>


        {/* Profile Avatar */}
        <div
          className="
            w-9 h-9

            flex items-center justify-center

            rounded-full

            bg-gradient-primary

            text-white
            font-semibold

            cursor-pointer

            hover:scale-105

            transition-all duration-300
          "
        >
          T
        </div>

      </div>

    </header>
  );
}

export default Topbar;
