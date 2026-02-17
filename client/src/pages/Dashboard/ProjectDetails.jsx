import { useParams } from "react-router-dom";
import { Plus, CheckCircle2, Trash2 } from "lucide-react";
import { useState } from "react";
import CreateTaskModal from "../../components/dashboard/CreateTaskModal";

function ProjectDetails() {

  const { projectId } = useParams();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Design dashboard UI",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Setup authentication",
      status: "Completed"
    },
    {
      id: 3,
      title: "Create API integration",
      status: "Todo"
    }
  ]);


  // Create task
  const handleCreateTask = (data) => {

    const newTask = {
      id: Date.now(),
      title: data.title,
      status: data.status
    };

    setTasks([newTask, ...tasks]);
  };


  // Change status
  const handleStatusChange = (taskId, newStatus) => {

    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, status: newStatus }
        : task
    );

    setTasks(updatedTasks);
  };


  // Delete task
  const handleDeleteTask = (taskId) => {

    const filteredTasks = tasks.filter(
      task => task.id !== taskId
    );

    setTasks(filteredTasks);
  };


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


        <button
          onClick={() => setIsModalOpen(true)}
          className="
            flex items-center gap-2
            px-5 py-2.5
            rounded-lg
            bg-gradient-primary
            hover:scale-105
            transition
          "
        >
          <Plus size={18} />
          Create Task
        </button>

      </div>



      {/* Tasks */}
      <div className="
        bg-white/5
        border border-white/10
        backdrop-blur-xl
        rounded-xl
        p-6
      ">

        <h2 className="font-semibold mb-4">
          Tasks
        </h2>


        <div className="space-y-3">

          {tasks.map((task) => (

            <div
              key={task.id}
              className="
                flex justify-between items-center
                p-4
                rounded-lg
                bg-white/5
                hover:bg-white/10
                transition
              "
            >

              {/* Left */}
              <div className="flex items-center gap-3">

                <CheckCircle2 size={18} />

                {task.title}

              </div>


              {/* Right Controls */}
              <div className="flex items-center gap-3">

                {/* Status dropdown */}
                <select
                  value={task.status}
                  onChange={(e) =>
                    handleStatusChange(
                      task.id,
                      e.target.value
                    )
                  }
                  className="
                    bg-white/5
                    border border-white/10
                    rounded-lg
                    px-2 py-1
                    text-xs
                  "
                >

                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>

                </select>


                {/* Delete */}
                <button
                  onClick={() =>
                    handleDeleteTask(task.id)
                  }
                  className="
                    text-red-400
                    hover:text-red-500
                  "
                >
                  <Trash2 size={16} />
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>



      {/* Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateTask}
      />

    </div>
  );
}

export default ProjectDetails;
