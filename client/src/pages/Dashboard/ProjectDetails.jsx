import { useParams } from "react-router-dom";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppContext } from "../../context/useAppContext";

import TaskCard from "../../components/dashboard/task/TaskCard";
import CreateTaskModal from "../../components/dashboard/task/CreateTaskModal";

function ProjectDetails() {

  const { projectId } = useParams();

  const {
    projects,
    tasks,
    addTask,
    updateTaskStatus,
    deleteTask
  } = useAppContext();


  const pid = Number(projectId);


  /* ---------- Find Project ---------- */

  const project = projects.find(
    (p) => p.id === pid
  );


  /* ---------- Filter Tasks ---------- */

  const projectTasks = tasks.filter(
    (task) => task.projectId === pid
  );


  const [isModalOpen, setIsModalOpen] =
    useState(false);


  /* ---------- Create Task ---------- */

  const handleCreateTask = (task) => {

    addTask({
      ...task,
      projectId: pid
    });

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


  /* ---------- Invalid Project Handling ---------- */

  if (!project) {

    return (

      <div className="text-center py-20 text-textSecondary">

        Project not found.

      </div>

    );

  }


  /* ---------- UI ---------- */

  return (

    <div className="space-y-8">


      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            {project.name}
          </h1>

          <p className="text-textSecondary">
            {project.description || "Project Tasks"}
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



      {/* Task List */}

      <div className="space-y-4">

        {projectTasks.length === 0 && (

          <div className="text-center text-textSecondary py-10">

            No tasks yet. Create your first task.

          </div>

        )}


        {projectTasks.map(task => (

          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteTask}
          />

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

export default ProjectDetails;

