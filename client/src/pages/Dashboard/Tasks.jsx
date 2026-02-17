import { useState } from "react";
import { Plus } from "lucide-react";

import TaskCard from "../../components/dashboard/task/TaskCard";
import CreateTaskModal from "../../components/dashboard/task/CreateTaskModal";

function Tasks() {

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
      subtasks: ["Sidebar", "Topbar"],
      project: "PlanIt SaaS"
    },
    {
      id: 2,
      title: "Create project modal",
      status: "Todo",
      priority: "Medium",
      assignees: ["Tanu"],
      subtasks: [],
      project: "PlanIt SaaS"
    },
    {
      id: 3,
      title: "Setup backend",
      status: "Completed",
      priority: "Low",
      assignees: ["Tanu"],
      subtasks: ["API", "Database"],
      project: "Client Dashboard"
    }
  ]);


  /* ---------------- Create Task ---------------- */

  const handleCreateTask = (task) => {

    const newTask = {
      ...task,
      project: "PlanIt SaaS"
    };

    setTasks(prev => [newTask, ...prev]);

  };


  /* ---------------- Status Change ---------------- */

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



      {/* Task List */}
      <div className="space-y-4">

        {tasks.length === 0 && (

          <div className="
            text-center
            text-textSecondary
            py-10
          ">
            No tasks found.
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

export default Tasks;
