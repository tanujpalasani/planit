import { useState, useMemo } from "react";
import { useAppContext } from "../../context/useAppContext";
import useAsyncAction from "../../hooks/useAsyncAction";

import TaskCard from "../../components/dashboard/task/TaskCard";
import CreateTaskModal from "../../components/dashboard/task/CreateTaskModal";
import TaskToolbar from "../../components/dashboard/task/TaskToolbar";
import TaskFilters from "../../components/dashboard/task/TaskFilters";
import KanbanColumn from "../../components/dashboard/task/KanbanColumn";

function Tasks() {
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
    deleteTask
  } = useAppContext();
  const { runAsync } = useAsyncAction();

  /* ---------- Create Task ---------- */

  const handleCreateTask = async (task) => {
    await runAsync(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 700));
        addTask(task);
      },
      { successMessage: "Task created successfully" },
    );
  };

  /* ---------- Update Status ---------- */

  const handleStatusChange =
    (taskId, newStatus) => {
      updateTaskStatus(taskId, newStatus);
    };

  /* ---------- Delete Task ---------- */

  const handleDeleteTask = (taskId) => {
    deleteTask(taskId);
  };

  /* ---------- Resolve Project Name ---------- */

  const getProjectName = (projectId) => {
    const project = projects.find(
      (p) => p.id === projectId
    );

    return project
      ? project.name
      : "Unknown Project";
  };

  /* ---------- Filter Tasks ---------- */

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Filter by status
      if (selectedStatus !== "All" && task.status !== selectedStatus) {
        return false;
      }

      // Filter by priority
      if (selectedPriority !== "All" && task.priority !== selectedPriority) {
        return false;
      }

      // Filter by project
      if (selectedProject !== "All" && task.projectId !== parseInt(selectedProject)) {
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
  }, [tasks, selectedStatus, selectedPriority, selectedProject, searchQuery]);

  const kanbanTasks = filteredTasks.map((task) => ({
    ...task,
    projectName: getProjectName(task.projectId)
  }));

  return (
    <div className="space-y-8">
      <TaskToolbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onCreateClick={() => setIsModalOpen(true)}
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
        projects={projects}
      />

      {viewMode === "list" ? (
        <div className="space-y-4">
          {tasks.length === 0 && (
            <div className="text-center text-textSecondary py-10">
              No tasks found.
            </div>
          )}

          {tasks.length > 0 && filteredTasks.length === 0 && (
            <div className="text-center text-textSecondary py-10">
              No tasks match the current filters.
            </div>
          )}

          {filteredTasks.map(task => (
            <div key={task.id}>
              <div className="text-xs text-textSecondary mb-1">
                {getProjectName(task.projectId)}
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

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        onCreate={handleCreateTask}
      />
    </div>
  );
}

export default Tasks;
