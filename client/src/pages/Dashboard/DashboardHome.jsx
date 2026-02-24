import { useAppContext } from "../../context/useAppContext";
import { useMemo } from "react";


import {
  Target,
  CalendarCheck2,
  AlertTriangle,
  Activity,
  Gauge
} from "lucide-react";

import TaskCard from "../../components/dashboard/task/TaskCard";
import { Card, Badge } from "../../components/ui";
import { isPastDate, isWithinNextDays, sortByDateAsc } from "../../utils/dateUtils";
import { normalizeSubtasksArray } from "../../utils/subtaskUtils";

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

    return tasks.filter((task) =>
      String(task.assigneeId || "") === String(user?.id || "")
    );
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
      const value = task?.updatedAt || task?.createdAt;
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

    const projectTaskCounts = scopedProjects.map((project) => {
      const count = scopedTasks.filter(
        (task) => String(task.projectId) === String(project.id)
      ).length;

      return { project, count };
    });

    const mostActiveProject = projectTaskCounts.reduce(
      (currentMax, currentProject) =>
        currentProject.count > currentMax.count
          ? currentProject
          : currentMax,
      { project: null, count: 0 }
    );

    let productivityLabel = "Needs Attention";
    let productivityVariant = "danger";

    if (completionRate > 75) {
      productivityLabel = "High Productivity";
      productivityVariant = "success";
    } else if (completionRate >= 40) {
      productivityLabel = "Moderate Productivity";
      productivityVariant = "warning";
    }

    return {
      completionRate,
      tasksCompletedThisWeek,
      overdueTasks,
      mostActiveProjectName: mostActiveProject.project?.name || "N/A",
      mostActiveProjectCount: mostActiveProject.count,
      productivityLabel,
      productivityVariant,
      teamSize: teamMembers.length
    };
  }, [scopedTasks, scopedProjects, teamMembers]);

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
      Boolean(subtask?.dueDate) && isPastDate(subtask.dueDate)
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


  return (
    <div className="space-y-8">


      {/* Welcome Section */}
      <div>

        <h1 className="text-3xl font-bold">
          {isMemberView ? "Your Task Overview" : `Welcome back, ${user.name}`}
        </h1>


        <p className="text-textSecondary">
          {isMemberView
            ? "Focus on the tasks assigned to you."
            : "Here's what's happening today."}
        </p>

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
          <Card hover={true} className="space-y-4">
            <div className="flex items-center justify-between">
              <Target size={20} className="text-blue-300" />
              <span className="text-2xl font-bold">
                {memberStats?.totalTasks ?? 0}
              </span>
            </div>
            <p className="text-sm text-textSecondary">
              Assigned Tasks
            </p>
          </Card>

          <Card hover={true} className="space-y-4">
            <div className="flex items-center justify-between">
              <CalendarCheck2 size={20} className="text-green-300" />
              <span className="text-2xl font-bold">
                {memberStats?.completedTasks ?? 0}
              </span>
            </div>
            <p className="text-sm text-textSecondary">
              Completed
            </p>
          </Card>

          <Card hover={true} className="space-y-4">
            <div className="flex items-center justify-between">
              <AlertTriangle size={20} className="text-amber-300" />
              <span className="text-2xl font-bold">
                {memberStats?.overdueSubtasks ?? 0}
              </span>
            </div>
            <p className="text-sm text-textSecondary">
              Overdue Subtasks
            </p>
          </Card>

          <Card hover={true} className="space-y-4">
            <div className="flex items-center justify-between">
              <Activity size={20} className="text-purple-300" />
              <span className="text-lg font-semibold text-right">
                {memberStats?.projectCount ?? 0}
              </span>
            </div>
            <p className="text-sm text-textSecondary">
              Active Projects
            </p>
          </Card>

          <Card hover={true} className="space-y-4">
            <div className="flex items-center justify-between">
              <Gauge size={20} className="text-pink-300" />
              <span className="text-2xl font-bold">
                {memberStats?.openTasks ?? 0}
              </span>
            </div>
            <p className="text-sm text-textSecondary">
              Open Tasks
            </p>
          </Card>

        </div>
      ) : (
        <div
          className="
            grid grid-cols-1
            sm:grid-cols-2
            xl:grid-cols-5
            gap-6
          "
        >
          <Card hover={true} className="space-y-4">
            <div className="flex items-center justify-between">
              <Target size={20} className="text-blue-300" />
              <span className="text-2xl font-bold">
                {analytics.completionRate}%
              </span>
            </div>
            <p className="text-sm text-textSecondary">
              Completion Rate
            </p>
          </Card>

          <Card hover={true} className="space-y-4">
            <div className="flex items-center justify-between">
              <CalendarCheck2 size={20} className="text-green-300" />
              <span className="text-2xl font-bold">
                {analytics.tasksCompletedThisWeek}
              </span>
            </div>
            <p className="text-sm text-textSecondary">
              Tasks Completed This Week
            </p>
          </Card>

          <Card hover={true} className="space-y-4">
            <div className="flex items-center justify-between">
              <AlertTriangle size={20} className="text-amber-300" />
              <span className="text-2xl font-bold">
                {analytics.overdueTasks}
              </span>
            </div>
            <p className="text-sm text-textSecondary">
              Overdue Tasks
            </p>
          </Card>

          <Card hover={true} className="space-y-4">
            <div className="flex items-center justify-between">
              <Activity size={20} className="text-purple-300" />
              <span className="text-lg font-semibold text-right">
                {analytics.mostActiveProjectName}
              </span>
            </div>
            <p className="text-sm text-textSecondary">
              Most Active Project ({analytics.mostActiveProjectCount} tasks)
            </p>
          </Card>

          <Card hover={true} className="space-y-4">
            <div className="flex items-center justify-between">
              <Gauge size={20} className="text-pink-300" />
              <Badge variant={analytics.productivityVariant}>
                {analytics.productivityLabel}
              </Badge>
            </div>
            <p className="text-sm text-textSecondary">
              Productivity Badge ({analytics.teamSize} team members)
            </p>
          </Card>

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
            bg-white/5
            border border-white/10

            rounded-xl
            p-6

            space-y-4
          "
        >

          <h2 className="font-semibold">
            {isMemberView ? "My Recent Tasks" : "Recent Tasks"}
          </h2>


          {recentTasks.map(task => (

            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={updateTaskStatus}
              onDelete={deleteTask}
            />

          ))}

        </div>



        {/* Recent Projects */}
        <div
          className="
            bg-white/5
            border border-white/10

            rounded-xl
            p-6
          "
        >

          <h2 className="font-semibold mb-4">
            {isMemberView ? "My Projects" : "Recent Projects"}
          </h2>


          <div className="space-y-3">

            {recentProjects.map(project => (

              <div
                key={project.id}
                className="
                  flex justify-between

                  bg-white/5

                  px-4 py-3

                  rounded-lg

                  hover:bg-white/10

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

            ))}

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
                        <Badge variant="danger">
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
                        <Badge variant="danger">
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


