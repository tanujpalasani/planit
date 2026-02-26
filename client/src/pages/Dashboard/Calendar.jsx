import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../../components/ui";
import { useAppContext } from "../../context/useAppContext";
import { normalizeSubtasksArray } from "../../utils/subtaskUtils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const toDateKey = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDateLabel = (dateKey) => {
  if (!dateKey) {
    return "No date selected";
  }

  const date = new Date(`${dateKey}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateKey;
  }

  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function Calendar() {
  const { tasks, projects, user } = useAppContext();
  const isAdmin = user?.role === "Admin";
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(new Date()));

  const projectNameById = useMemo(
    () =>
      new Map(
        projects.map((project) => [String(project.id), project.name || project.title || "Unknown Project"])
      ),
    [projects]
  );

  const events = useMemo(
    () =>
      tasks.flatMap((task) => {
        const projectName = projectNameById.get(String(task.projectId)) || "Unknown Project";
        const isTaskAssignedToMember = String(task.assigneeId || "") === String(user?.id || "");
        const taskEvents = [];

        if (isAdmin || isTaskAssignedToMember) {
          const taskDateKey = toDateKey(task.dueDate);
          if (taskDateKey) {
            taskEvents.push({
              id: `task-${task.id}`,
              dateKey: taskDateKey,
              type: "task",
              title: task.title,
              status: task.status,
              projectName,
            });
          }
        }

        const subtaskEvents = normalizeSubtasksArray(task.subtasks).flatMap((subtask) => {
          const isSubtaskAssignedToMember = String(subtask.assigneeId || "") === String(user?.id || "");
          if (!isAdmin && !isSubtaskAssignedToMember) {
            return [];
          }

          const subtaskDateKey = toDateKey(subtask.dueDate);
          if (!subtaskDateKey) {
            return [];
          }

          return [{
            id: `subtask-${task.id}-${subtask.id}`,
            dateKey: subtaskDateKey,
            type: "subtask",
            title: subtask.title,
            completed: Boolean(subtask.completed),
            parentTaskTitle: task.title,
            projectName,
          }];
        });

        return [...taskEvents, ...subtaskEvents];
      }),
    [isAdmin, projectNameById, tasks, user?.id]
  );

  const eventsByDate = useMemo(() => {
    const map = new Map();

    events.forEach((event) => {
      const existing = map.get(event.dateKey) || [];
      existing.push(event);
      map.set(event.dateKey, existing);
    });

    return map;
  }, [events]);

  const monthLabel = currentMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i += 1) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    calendarCells.push(key);
  }

  const selectedDateEvents = selectedDateKey ? (eventsByDate.get(selectedDateKey) || []) : [];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0" />
        <p className="text-xs uppercase tracking-[0.16em] text-textSecondary">
          {isAdmin ? "Admin Calendar" : "My Calendar"}
        </p>
        <h1 className="mt-3 text-3xl font-bold text-white">
          {isAdmin ? "Global Team Timeline" : "Assigned Timeline"}
        </h1>
        <p className="mt-2 text-textSecondary">
          {isAdmin
            ? "View all task and subtask deadlines across the workspace."
            : "View only your assigned tasks and subtasks on the calendar."}
        </p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">
            Calendar
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
                )
              }
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-textSecondary transition-all duration-200 hover:bg-white/10 hover:text-white"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>

            <p className="min-w-36 text-center text-sm font-medium text-white">
              {monthLabel}
            </p>

            <button
              type="button"
              onClick={() =>
                setCurrentMonth(
                  new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
                )
              }
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-textSecondary transition-all duration-200 hover:bg-white/10 hover:text-white"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-xs text-textSecondary">
          {WEEKDAY_LABELS.map((label) => (
            <p key={label} className="py-1">
              {label}
            </p>
          ))}
        </div>

        <div className="mt-1 grid grid-cols-7 gap-2">
          {calendarCells.map((dateKey, index) => {
            if (!dateKey) {
              return <div key={`empty-${index}`} className="h-24 rounded-lg bg-transparent" />;
            }

            const dateEvents = eventsByDate.get(dateKey) || [];
            const isSelected = selectedDateKey === dateKey;

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => setSelectedDateKey(dateKey)}
                className={`
                  h-24 rounded-lg border p-2 text-left transition-all duration-200
                  ${isSelected
                    ? "border-transparent bg-gradient-primary text-white shadow-glow"
                    : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"}
                `}
              >
                <div className="flex items-start justify-between">
                  <span className={`text-xs font-medium ${isSelected ? "text-white" : "text-textSecondary"}`}>
                    {Number(dateKey.slice(-2))}
                  </span>
                  {dateEvents.length > 0 && (
                    <span className={`h-2 w-2 rounded-full ${isSelected ? "bg-white" : "bg-gradient-primary"}`} />
                  )}
                </div>

                <div className="mt-2 space-y-1">
                  {dateEvents.slice(0, 2).map((event) => (
                    <p
                      key={event.id}
                      className={`truncate rounded px-1.5 py-0.5 text-[10px] ${
                        isSelected ? "bg-white/20 text-white" : "bg-white/10 text-textSecondary"
                      }`}
                    >
                      {event.type === "task" ? "Task" : "Sub"}: {event.title}
                    </p>
                  ))}

                  {dateEvents.length > 2 && (
                    <p className={`text-[10px] ${isSelected ? "text-white/90" : "text-textSecondary"}`}>
                      +{dateEvents.length - 2} more
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-medium text-white">
          {formatDateLabel(selectedDateKey)}
        </p>

        {selectedDateEvents.length === 0 ? (
          <p className="mt-2 text-sm text-textSecondary">
            No deadlines on this date.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {selectedDateEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-white">
                    {event.title}
                  </p>
                  <p className="truncate text-xs text-textSecondary">
                    {event.projectName}
                    {event.type === "subtask" ? ` • ${event.parentTaskTitle}` : ""}
                  </p>
                </div>

                <Badge variant="neutral" className="border-white/20 bg-white/10 text-white">
                  {event.type === "task" ? event.status : (event.completed ? "Completed" : "Pending")}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Calendar;
