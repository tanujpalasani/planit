import { useParams } from "react-router-dom";
import { useState } from "react";
import { Plus } from "lucide-react";

import TaskCard from "../../components/dashboard/task/TaskCard";
import CreateTaskModal from "../../components/dashboard/task/CreateTaskModal";

function ProjectDetails() {

  const { projectId } = useParams();


  /* ---------------- Modal State ---------------- */

  const [isModalOpen, setIsModalOpen] = useState(false);


  /* ---------------- Tasks State ---------------- */

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design dashboard UI",
      status: "In Progress",
      priority: "High",
      assignees: ["Tanu"],
      subtasks: [
        "Create layout",
        "Add components"
      ]
    },
    {
      id: 2,
      title: "Setup authentication",
      status: "Todo",
      priority: "Medium",
      assignees: ["Tanu"],
      subtasks: [
        "Login API",
        "Signup API"
      ]
    }
  ]);


  /* ---------------- Create Task ---------------- */

  const handleCreateTask = (task) => {

    setTasks(prev => [task, ...prev]);

  };


  /* ---------------- Update Status ---------------- */

  const handleStatusChange = (taskId, newStatus) => {

    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { ...task, status: newStatus }
          : task
      )
    );

  };


  /* ---------------- Delete Task ---------------- */

  const handleDeleteTask = (taskId) => {

    setTasks(prev =>
      prev.filter(task =>
        task.id !== taskId
      )
    );

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

        {tasks.length === 0 && (

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


        {tasks.map(task => (

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
