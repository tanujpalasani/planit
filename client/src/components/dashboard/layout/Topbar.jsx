import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Bell, Plus } from "lucide-react";
import { useAppContext } from "../../../context/useAppContext";
import { isPastDate, isWithinNextDays } from "../../../utils/dateUtils";
import { Button, Badge } from "../../ui";

function Topbar() {

  const navigate = useNavigate();
  const location = useLocation();
  const { user, tasks } = useAppContext();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const displayName = user?.name?.trim() || "User";
  const displayEmail = user?.email?.trim() || "No email";
  const avatarLetter = displayName.charAt(0).toUpperCase();
  const isAdmin = user?.role === "Admin";
  const dateKey = (value) => {
    if (!value) {
      return "";
    }
    return String(value).slice(0, 10);
  };
  const notifications = useMemo(
    () =>
      tasks
        .filter((task) => String(task.status || "").trim() !== "Completed")
        .flatMap((task) => {
          const dueKey = dateKey(task.dueDate);
          if (!dueKey) {
            return [];
          }

          if (isPastDate(dueKey)) {
            return [{ id: `overdue-${task.id}`, title: task.title, type: "overdue" }];
          }

          if (isWithinNextDays(dueKey, 7)) {
            return [{ id: `upcoming-${task.id}`, title: task.title, type: "upcoming" }];
          }

          return [];
        })
        .slice(0, 8),
    [tasks]
  );

  // Dynamic title based on route
  const getTitle = () => {

    if (location.pathname === "/admin" || location.pathname === "/member") return "Dashboard";

    if (location.pathname.startsWith("/admin/projects"))
      return "Projects";

    if (location.pathname.startsWith("/member/projects"))
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
        overflow-visible
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
        {isAdmin && (
          <div className="hidden lg:flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Plus size={14} />}
              onClick={() => navigate("/admin/tasks?create=1")}
            >
              New Task
            </Button>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Plus size={14} />}
              onClick={() => navigate("/admin/projects?create=1")}
            >
              New Project
            </Button>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<Plus size={14} />}
              onClick={() => navigate("/admin/team?create=1")}
            >
              Add Member
            </Button>
          </div>
        )}

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative rounded-lg border border-white/10 bg-white/5 p-2.5 text-textSecondary transition-all duration-200 hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={16} />
            {notifications.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-gradient-primary px-1 text-[10px] font-semibold text-white">
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-white/10 bg-primary/95 p-3 shadow-2xl backdrop-blur-xl z-50">
              <p className="mb-2 text-sm font-semibold text-white">
                Notifications
              </p>
              {notifications.length === 0 ? (
                <p className="text-sm text-textSecondary">
                  No alerts right now.
                </p>
              ) : (
                <div className="space-y-2">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <p className="truncate text-sm text-white">
                        {item.title}
                      </p>
                      <Badge variant="neutral" className="border-white/20 bg-white/10 text-white">
                        {item.type === "overdue" ? "Overdue" : "Due Soon"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

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
