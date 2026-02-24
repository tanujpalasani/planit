import { useParams } from "react-router-dom";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppContext } from "../../context/useAppContext";
import useAsyncAction from "../../hooks/useAsyncAction";
import { Button } from "../../components/ui";

import TaskCard from "../../components/dashboard/task/TaskCard";
import CreateTaskModal from "../../components/dashboard/task/CreateTaskModal";

function ProjectDetails() {
  const toIdKey = (value) => String(value ?? "");

  const { projectId } = useParams();

  const {
    projects,
    tasks,
    addTask,
    updateTaskStatus,
    deleteTask,
    user
  } = useAppContext();
  const { runAsync } = useAsyncAction();
  const isAdmin = user?.role === "Admin";
  const pid = projectId;


  /* ---------- Find Project ---------- */

  const project = projects.find(
    (p) => toIdKey(p.id) === toIdKey(pid)
  );


  /* ---------- Filter Tasks ---------- */

  const projectTasks = tasks.filter(
    (task) => toIdKey(task.projectId) === toIdKey(pid)
  );


  const [isModalOpen, setIsModalOpen] =
    useState(false);


  /* ---------- Create Task ---------- */

  const handleCreateTask = async (task) => {
    return runAsync(
      async () => {
        await new Promise((resolve) => setTimeout(resolve, 700));

        const createdTask = addTask({
          ...task,
          projectId: pid
        });

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

        {isAdmin && (
          <Button
            onClick={() =>
              setIsModalOpen(true)
            }
            leftIcon={<Plus size={18} />}
            className="hover:scale-105"
          >
            Create Task
          </Button>
        )}

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

export default ProjectDetails;

