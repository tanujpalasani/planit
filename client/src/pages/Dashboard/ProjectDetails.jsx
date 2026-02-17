import { useParams } from "react-router-dom";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppContext } from "../../context/AppContext";

import TaskCard from "../../components/dashboard/task/TaskCard";
import CreateTaskModal from "../../components/dashboard/task/CreateTaskModal";

function ProjectDetails() {

  const { projectId } = useParams();
  const { tasks, addTask, updateTaskStatus, deleteTask } = useAppContext();
  const pid = Number(projectId);
  const projectTasks = tasks.filter(
    (task) => task.projectId === pid
  );

  const [isModalOpen, setIsModalOpen] = useState(false);


  /* ---------------- Create Task from Context ---------------- */

  const handleCreateTask = (task) => {

    addTask({
      ...task,
      projectId: pid,
    });

  };


  /* ---------------- Update Status from Context ---------------- */

  const handleStatusChange = (taskId, newStatus) => {

    updateTaskStatus(taskId, newStatus);

  };


  /* ---------------- Delete Task from Context ---------------- */

  const handleDeleteTask = (taskId) => {

    deleteTask(taskId);

  };


  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">


      {/* Header */}
      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Project Details
          </h1>

          <p className="text-textSecondary">
            Project ID: {projectId}
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

          <div
            className="
              text-center

              text-textSecondary

              py-10
            "
          >
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
