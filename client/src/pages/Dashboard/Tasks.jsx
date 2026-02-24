import { useState, useMemo } from "react";
import { useAppContext } from "../../context/useAppContext";
import useAsyncAction from "../../hooks/useAsyncAction";

import TaskCard from "../../components/dashboard/task/TaskCard";
import CreateTaskModal from "../../components/dashboard/task/CreateTaskModal";
import TaskToolbar from "../../components/dashboard/task/TaskToolbar";
import TaskFilters from "../../components/dashboard/task/TaskFilters";
import KanbanColumn from "../../components/dashboard/task/KanbanColumn";

function Tasks({ assignedOnly = false }) {
  const toIdKey = (value) => String(value ?? "");
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [viewMode, setViewMode] = useState("list");

  /* ---------- Filter State ---------- */

  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedProject, setSelectedProject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    tasks,
    projects,
    addTask,
    updateTaskStatus,
    deleteTask,
    user
  } = useAppContext();
  const { runAsync } = useAsyncAction();
  const isAdmin = user?.role === "Admin";

  /* ---------- Create Task ---------- */

  const handleCreateTask = async (task) => {
    return runAsync(
      async () => {
        const createdTask = await addTask(task);
        if (!createdTask) {
          throw new Error("Failed to create task");
        }

        return createdTask;
      },
      { successMessage: "Task created successfully" },
    );
  };

  /* ---------- Update Status ---------- */

  const handleStatusChange =
    async (taskId, newStatus) => {
      await updateTaskStatus(taskId, newStatus);
    };

  /* ---------- Delete Task ---------- */

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
  };

  /* ---------- Resolve Project Name ---------- */

  const getProjectName = (projectId, sourceProjects) => {
    const project = sourceProjects.find(
      (p) => toIdKey(p.id) === toIdKey(projectId)
    );

    return project
      ? project.name
      : "Unknown Project";
  };

  /* ---------- Filter Tasks ---------- */

  const scopedTasks = useMemo(() => {
    if (!assignedOnly) {
      return tasks;
    }

    return tasks.filter((task) =>
      String(task.assigneeId || "") === String(user?.id || "")
    );
  }, [assignedOnly, tasks, user?.id]);

  const visibleProjects = useMemo(() => {
    if (!assignedOnly) {
      return projects;
    }

    const projectIds = new Set(scopedTasks.map((task) => String(task.projectId)));
    return projects.filter((project) => projectIds.has(String(project.id)));
  }, [assignedOnly, projects, scopedTasks]);

  const filteredTasks = useMemo(() => {
    return scopedTasks.filter(task => {
      // Filter by status
      if (selectedStatus !== "All" && task.status !== selectedStatus) {
        return false;
      }

      // Filter by priority
      if (selectedPriority !== "All" && task.priority !== selectedPriority) {
        return false;
      }

      // Filter by project
      if (selectedProject !== "All" && toIdKey(task.projectId) !== toIdKey(selectedProject)) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const titleMatch = task.title?.toLowerCase().includes(query);
        if (!titleMatch) {
          return false;
        }
      }

      return true;
    });
  }, [scopedTasks, selectedStatus, selectedPriority, selectedProject, searchQuery]);

  const kanbanTasks = filteredTasks.map((task) => ({
    ...task,
    projectName: getProjectName(task.projectId, visibleProjects)
  }));

  return (
    <div className="space-y-8">
      <TaskToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onCreateClick={() => setIsModalOpen(true)}
        canCreate={isAdmin}
        title={assignedOnly ? "My Tasks" : "Tasks"}
      />

      <TaskFilters
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        projects={visibleProjects}
      />

      {viewMode === "list" ? (
        <div className="space-y-4">
          {scopedTasks.length === 0 && (
            <div className="text-center text-textSecondary py-10">
              No tasks found.
            </div>
          )}

          {scopedTasks.length > 0 && filteredTasks.length === 0 && (
            <div className="text-center text-textSecondary py-10">
              No tasks match the current filters.
            </div>
          )}

          {filteredTasks.map(task => (
            <div key={task.id}>
              <div className="text-xs text-textSecondary mb-1">
                {getProjectName(task.projectId, visibleProjects)}
              </div>

              <TaskCard
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteTask}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KanbanColumn
            title="Todo"
            status="Todo"
            tasks={kanbanTasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
          />

          <KanbanColumn
            title="In Progress"
            status="In Progress"
            tasks={kanbanTasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
          />

          <KanbanColumn
            title="Completed"
            status="Completed"
            tasks={kanbanTasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
          />
        </div>
      )}

      {isAdmin && (
        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={() =>
            setIsModalOpen(false)
          }
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
}

export default Tasks;
