import { useAppContext } from "../../context/useAppContext";
import { createElement, useMemo } from "react";


import {
  Target,
  CalendarCheck2,
  AlertTriangle,
  Activity,
  Gauge,
  CircleDot
} from "lucide-react";

import TaskCard from "../../components/dashboard/task/TaskCard";
import { Card, Badge } from "../../components/ui";
import { isPastDate, isWithinNextDays, sortByDateAsc } from "../../utils/dateUtils";
import { normalizeSubtasksArray } from "../../utils/subtaskUtils";

function StatCard({ icon, value, label }) {
  return (
    <Card hover={true} className="space-y-4 border-white/15 bg-white/[0.06]">
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
          {createElement(icon, { size: 18, className: "text-white" })}
        </span>

        <span className="text-2xl font-bold text-white">
          {value}
        </span>
      </div>

      <p className="text-sm text-textSecondary">
        {label}
      </p>
    </Card>
  );
}

function DashboardHome({ memberView = false }) {
  const {
    user,
    projects,
    tasks,
    teamMembers,
    updateTaskStatus,
    deleteTask
  } = useAppContext();

  const isMemberView = memberView || user?.role === "Member";

  const scopedTasks = useMemo(() => {
    if (!isMemberView) {
      return tasks;
    }

    return tasks.filter((task) => {
      const isTaskAssignee = String(task.assigneeId || "") === String(user?.id || "");
      if (isTaskAssignee) {
        return true;
      }

      return normalizeSubtasksArray(task.subtasks).some(
        (subtask) => String(subtask.assigneeId || "") === String(user?.id || "")
      );
    });
  }, [isMemberView, tasks, user?.id]);

  const scopedProjects = useMemo(() => {
    if (!isMemberView) {
      return projects;
    }

    const projectIds = new Set(scopedTasks.map((task) => String(task.projectId)));
    return projects.filter((project) => projectIds.has(String(project.id)));
  }, [isMemberView, projects, scopedTasks]);

  const analytics = useMemo(() => {
    const isDoneStatus = (statusValue) => {
      return String(statusValue || "").trim() === "Completed";
    };

    const parseTaskCompletionDate = (task) => {
      const value = task?.completedAt || task?.updatedAt || task?.createdAt;
      if (!value) {
        return null;
      }

      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date;
    };

    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const totalTasks = scopedTasks.length;
    const completedTasks = scopedTasks.filter((task) =>
      isDoneStatus(task.status)
    ).length;
    const completionRate = totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

    const tasksCompletedThisWeek = scopedTasks.filter((task) => {
      if (!isDoneStatus(task.status)) {
        return false;
      }

      const completedAt = parseTaskCompletionDate(task);
      return completedAt ? completedAt >= sevenDaysAgo : false;
    }).length;

    const overdueTasks = scopedTasks.filter((task) => {
      if (!task?.dueDate || isDoneStatus(task.status)) {
        return false;
      }

      return isPastDate(task.dueDate);
    }).length;
    const dueThisWeek = scopedTasks.filter((task) => {
      if (!task?.dueDate || isDoneStatus(task.status)) {
        return false;
      }
      return isWithinNextDays(task.dueDate, 7);
    }).length;
    const unassignedTasks = scopedTasks.filter((task) => !task?.assigneeId).length;
    const statusCounts = {
      todo: scopedTasks.filter((task) => String(task.status || "").trim() === "Todo").length,
      inProgress: scopedTasks.filter((task) => String(task.status || "").trim() === "In Progress").length,
      completed: completedTasks,
    };

    const atRiskCount = overdueTasks + unassignedTasks;

    return {
      totalTasks,
      completionRate,
      tasksCompletedThisWeek,
      overdueTasks,
      dueThisWeek,
      unassignedTasks,
      atRiskCount,
      statusCounts,
    };
  }, [scopedTasks]);

  /* ---------------- Recent Tasks from Context ---------------- */

  const recentTasks = scopedTasks.slice(0, 5);


  /* ---------------- Recent Projects from Context ---------------- */

  const recentProjects = scopedProjects.slice(0, 5);
  const memberById = useMemo(
    () =>
      new Map(
        teamMembers.map((member) => [String(member.id), member])
      ),
    [teamMembers]
  );
  const allSubtasks = useMemo(
    () =>
      scopedTasks.flatMap((task) =>
        normalizeSubtasksArray(task.subtasks).map((subtask) => ({
          ...subtask,
          parentTaskTitle: task.title,
          parentTaskId: task.id
        }))
      ),
    [scopedTasks]
  );
  const memberStats = useMemo(() => {
    if (!isMemberView) {
      return null;
    }

    const completedTasks = scopedTasks.filter(
      (task) => String(task.status || "").trim() === "Completed"
    ).length;

    const openTasks = scopedTasks.length - completedTasks;

    const overdueSubtasks = allSubtasks.filter((subtask) =>
      !subtask?.completed &&
      Boolean(subtask?.dueDate) &&
      isPastDate(subtask.dueDate)
    ).length;

    return {
      totalTasks: scopedTasks.length,
      openTasks,
      completedTasks,
      overdueSubtasks,
      projectCount: scopedProjects.length,
    };
  }, [allSubtasks, isMemberView, scopedProjects.length, scopedTasks]);
  const isSubtaskOverdue = (subtask) => {
    if (subtask?.completed) {
      return false;
    }

    return isPastDate(subtask?.dueDate);
  };

  const upcomingSubtasks = useMemo(
    () =>
      allSubtasks
        .filter((subtask) => {
          if (subtask.completed || !subtask.dueDate) {
            return false;
          }

          return isWithinNextDays(subtask.dueDate, 7);
        })
        .sort((a, b) => sortByDateAsc(a?.dueDate, b?.dueDate))
        .slice(0, 5),
    [allSubtasks]
  );
  const mySubtasks = useMemo(
    () =>
      allSubtasks
        .filter(
          (subtask) =>
            Boolean(user?.id) &&
            !subtask.completed &&
            String(subtask.assigneeId || "") === String(user.id)
        )
        .sort((a, b) => sortByDateAsc(a?.dueDate, b?.dueDate)),
    [allSubtasks, user]
  );
  const adminUpcomingItems = useMemo(() => {
    if (isMemberView) {
      return [];
    }

    const upcomingTasks = scopedTasks
      .filter((task) => task?.dueDate && String(task.status || "").trim() !== "Completed")
      .filter((task) => isWithinNextDays(task.dueDate, 7))
      .map((task) => ({
        id: `task-${task.id}`,
        title: task.title,
        parentLabel: "Task",
        dueDate: task.dueDate,
      }));

    const upcomingSubtaskItems = allSubtasks
      .filter((subtask) => subtask?.dueDate && !subtask?.completed)
      .filter((subtask) => isWithinNextDays(subtask.dueDate, 7))
      .map((subtask) => ({
        id: `subtask-${subtask.parentTaskId}-${subtask.id}`,
        title: subtask.title,
        parentLabel: `Subtask in ${subtask.parentTaskTitle}`,
        dueDate: subtask.dueDate,
      }));

    return [...upcomingTasks, ...upcomingSubtaskItems]
      .sort((a, b) => sortByDateAsc(a?.dueDate, b?.dueDate))
      .slice(0, 6);
  }, [allSubtasks, isMemberView, scopedTasks]);
  const adminAtRiskItems = useMemo(() => {
    if (isMemberView) {
      return [];
    }

    return scopedTasks
      .filter((task) => {
        const status = String(task.status || "").trim();
        if (status === "Completed") {
          return false;
        }

        return isPastDate(task.dueDate) || !task.assigneeId;
      })
      .slice(0, 6);
  }, [isMemberView, scopedTasks]);
  const formatDueDate = (dueDateValue) => {
    if (!dueDateValue) {
      return "No due date";
    }

    const date = new Date(`${dueDateValue}T00:00:00`);
    if (Number.isNaN(date.getTime())) {
      return "No due date";
    }

    return date.toLocaleDateString();
  };
  const memberStatItems = [
    {
      label: "Assigned Tasks",
      value: memberStats?.totalTasks ?? 0,
      icon: Target,
    },
    {
      label: "Completed",
      value: memberStats?.completedTasks ?? 0,
      icon: CalendarCheck2,
    },
    {
      label: "Overdue Subtasks",
      value: memberStats?.overdueSubtasks ?? 0,
      icon: AlertTriangle,
    },
    {
      label: "Active Projects",
      value: memberStats?.projectCount ?? 0,
      icon: Activity,
    },
    {
      label: "Open Tasks",
      value: memberStats?.openTasks ?? 0,
      icon: Gauge,
    },
  ];
  const adminStatItems = [
    {
      label: "Total Tasks",
      value: analytics.totalTasks,
      icon: Target,
    },
    {
      label: "Completed",
      value: analytics.tasksCompletedThisWeek,
      icon: CalendarCheck2,
    },
    {
      label: "Overdue Tasks",
      value: analytics.overdueTasks,
      icon: AlertTriangle,
    },
    {
      label: "Due This Week",
      value: analytics.dueThisWeek,
      icon: Gauge,
    },
  ];


  return (
    <div className="space-y-8">


      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.16em] text-textSecondary">
            Planit Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            {isMemberView ? "Your Task Overview" : `Welcome back, ${user?.name || "User"}`}
          </h1>

          <p className="mt-2 text-textSecondary">
            {isMemberView
              ? "Focus on the tasks assigned to you."
              : "Here's what's happening today."}
          </p>
        </div>
      </div>



      {/* Stats Grid */}
      {isMemberView ? (
        <div
          className="
            grid grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-5
            gap-6
          "
        >
          {memberStatItems.map((item) => (
            <StatCard
              key={item.label}
              icon={item.icon}
              value={item.value}
              label={item.label}
            />
          ))}

        </div>
      ) : (
        <div className="space-y-6">
          <div
            className="
              grid grid-cols-1
              sm:grid-cols-2
              xl:grid-cols-4
              gap-6
            "
          >
          {adminStatItems.map((item) => (
            <StatCard
              key={item.label}
              icon={item.icon}
              value={item.value}
              label={item.label}
            />
          ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <Card className="space-y-4">
              <h2 className="font-semibold text-white">
                Status Breakdown
              </h2>

              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-textSecondary">To Do</span>
                    <span className="text-white">{analytics.statusCounts.todo}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-primary"
                      style={{ width: `${analytics.totalTasks ? Math.round((analytics.statusCounts.todo / analytics.totalTasks) * 100) : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-textSecondary">In Progress</span>
                    <span className="text-white">{analytics.statusCounts.inProgress}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-primary"
                      style={{ width: `${analytics.totalTasks ? Math.round((analytics.statusCounts.inProgress / analytics.totalTasks) * 100) : 0}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-textSecondary">Completed</span>
                    <span className="text-white">{analytics.statusCounts.completed}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-primary"
                      style={{ width: `${analytics.totalTasks ? Math.round((analytics.statusCounts.completed / analytics.totalTasks) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-semibold text-white">
                Upcoming Deadlines
              </h2>

              <div className="space-y-2">
                {adminUpcomingItems.length === 0 ? (
                  <p className="text-sm text-textSecondary">
                    No deadlines in the next 7 days.
                  </p>
                ) : (
                  adminUpcomingItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white">{item.title}</p>
                        <p className="truncate text-xs text-textSecondary">{item.parentLabel}</p>
                      </div>
                      <span className="text-xs text-textSecondary whitespace-nowrap">
                        {formatDueDate(item.dueDate)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card className="space-y-4">
              <h2 className="font-semibold text-white">
                At Risk
              </h2>

              <p className="text-sm text-textSecondary">
                Overdue or unassigned tasks: <span className="text-white font-medium">{analytics.atRiskCount}</span>
              </p>

              <div className="space-y-2">
                {adminAtRiskItems.length === 0 ? (
                  <p className="text-sm text-textSecondary">
                    No at-risk tasks.
                  </p>
                ) : (
                  adminAtRiskItems.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm text-white">{task.title}</p>
                        <p className="text-xs text-textSecondary">
                          {task.assigneeId ? "Assigned" : "Unassigned"}
                        </p>
                      </div>
                      <Badge variant="neutral" className="border-white/20 bg-white/10 text-white gap-1">
                        <CircleDot size={10} />
                        {task.dueDate && isPastDate(task.dueDate) ? "Overdue" : "Unassigned"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>
      )}



      {/* Bottom Grid */}
      <div
        className="
          grid grid-cols-1
          lg:grid-cols-2
          gap-6
        "
      >

        {/* Recent Tasks */}
        <div
          className="
            bg-white/[0.06]
            border border-white/15

            rounded-xl
            p-6

            space-y-4
          "
        >

          <h2 className="font-semibold">
            {isMemberView ? "My Recent Tasks" : "Recent Tasks"}
          </h2>

          {recentTasks.length === 0 ? (
            <p className="text-sm text-textSecondary">
              No recent tasks available.
            </p>
          ) : (
            recentTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={updateTaskStatus}
                onDelete={deleteTask}
              />
            ))
          )}

        </div>



        {/* Recent Projects */}
        <div
          className="
            bg-white/[0.06]
            border border-white/15

            rounded-xl
            p-6
          "
        >

          <h2 className="font-semibold mb-4">
            {isMemberView ? "My Projects" : "Recent Projects"}
          </h2>


          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-sm text-textSecondary">
                No recent projects available.
              </p>
            ) : (
              recentProjects.map(project => (
                <div
                  key={project.id}
                    className="
                      flex justify-between

                    bg-white/5

                    px-4 py-3

                    rounded-lg

                    hover:bg-white/[0.12]

                    transition
                  "
                >
                  <span>
                    {project.name}
                  </span>

                  <span className="text-textSecondary text-sm">
                    {
                      scopedTasks.filter(
                        (task) =>
                          String(task.projectId) === String(project.id)
                      ).length
                    } tasks
                  </span>

                </div>
              ))
            )}

          </div>

        </div>

      </div>

      {/* Subtasks Panels */}
      <div
        className="
          grid grid-cols-1
          lg:grid-cols-2
          gap-6
        "
      >
        <Card className="space-y-4">
          <h2 className="font-semibold">
            Upcoming Deadlines
          </h2>

          <div className="space-y-3">
            {upcomingSubtasks.length === 0 ? (
              <p className="text-sm text-textSecondary">
                No upcoming subtask deadlines.
              </p>
            ) : (
              upcomingSubtasks.map((subtask) => {
                const assignee = subtask.assigneeId
                  ? memberById.get(String(subtask.assigneeId))
                  : null;

                return (
                  <div
                    key={`${subtask.parentTaskId}-${subtask.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white">
                        {subtask.title}
                      </p>
                      <p className="truncate text-xs text-textSecondary">
                        {subtask.parentTaskTitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-textSecondary whitespace-nowrap">
                        {formatDueDate(subtask.dueDate)}
                      </span>

                      {isSubtaskOverdue(subtask) && (
                        <Badge variant="neutral" className="border-white/20 bg-white/10 text-white">
                          Overdue
                        </Badge>
                      )}

                      {assignee && (
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-semibold text-white"
                          title={assignee.name}
                        >
                          {assignee.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="font-semibold">
            My Subtasks
          </h2>

          <div className="space-y-3">
            {mySubtasks.length === 0 ? (
              <p className="text-sm text-textSecondary">
                No assigned subtasks.
              </p>
            ) : (
              mySubtasks.map((subtask) => {
                const assignee = subtask.assigneeId
                  ? memberById.get(String(subtask.assigneeId))
                  : null;

                return (
                  <div
                    key={`${subtask.parentTaskId}-${subtask.id}`}
                    className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm text-white">
                        {subtask.title}
                      </p>
                      <p className="truncate text-xs text-textSecondary">
                        {subtask.parentTaskTitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-textSecondary whitespace-nowrap">
                        {formatDueDate(subtask.dueDate)}
                      </span>

                      {isSubtaskOverdue(subtask) && (
                        <Badge variant="neutral" className="border-white/20 bg-white/10 text-white">
                          Overdue
                        </Badge>
                      )}

                      {assignee && (
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-semibold text-white"
                          title={assignee.name}
                        >
                          {assignee.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>


    </div>
  );

}

export default DashboardHome;


