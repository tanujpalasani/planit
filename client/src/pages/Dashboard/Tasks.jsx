import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { useAppContext } from "../../context/useAppContext";

import TaskCard from "../../components/dashboard/task/TaskCard";
import CreateTaskModal from "../../components/dashboard/task/CreateTaskModal";

function Tasks() {

  const [isModalOpen, setIsModalOpen] =
    useState(false);


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


  /* ---------- Create Task ---------- */

  const handleCreateTask = (task) => {

    addTask(task);

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


  return (

    <div className="space-y-8">


      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Tasks
          </h1>

          <p className="text-textSecondary">
            Manage all your tasks in one place
          </p>

        </div>


        {/* Create Task Button */}

        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="
            flex items-center gap-2
            px-5 py-2.5
            bg-gradient-primary
            rounded-lg
            hover:scale-105
            transition
          "
        >

          <Plus size={18} />

          Create Task

        </button>

      </div>



      {/* Filter Controls */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Status Filter */}

        <div>

          <label className="block text-sm text-textSecondary mb-2">
            Status
          </label>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="
              w-full
              bg-white/5
              border border-white/10
              rounded-lg
              px-3 py-2
              text-white
              focus:outline-none
              focus:border-purple-500
              transition
            "
          >
            <option value="All">All</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

        </div>


        {/* Priority Filter */}

        <div>

          <label className="block text-sm text-textSecondary mb-2">
            Priority
          </label>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="
              w-full
              bg-white/5
              border border-white/10
              rounded-lg
              px-3 py-2
              text-white
              focus:outline-none
              focus:border-purple-500
              transition
            "
          >
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

        </div>


        {/* Project Filter */}

        <div>

          <label className="block text-sm text-textSecondary mb-2">
            Project
          </label>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="
              w-full
              bg-white/5
              border border-white/10
              rounded-lg
              px-3 py-2
              text-white
              focus:outline-none
              focus:border-purple-500
              transition
            "
          >
            <option value="All">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>

        </div>


        {/* Search Input */}

        <div>

          <label className="block text-sm text-textSecondary mb-2">
            Search
          </label>

          <div className="relative">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary"
              size={18}
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title..."
              className="
                w-full
                bg-white/5
                border border-white/10
                rounded-lg
                pl-10 pr-3 py-2
                text-white
                placeholder:text-textSecondary
                focus:outline-none
                focus:border-purple-500
                transition
              "
            />

          </div>

        </div>

      </div>



      {/* Task List */}

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

            {/* Project Name Label */}

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



      {/* Modal */}

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

