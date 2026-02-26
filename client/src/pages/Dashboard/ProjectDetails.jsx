import { useParams } from "react-router-dom";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useAppContext } from "../../context/useAppContext";
import useAsyncAction from "../../hooks/useAsyncAction";
import { Button } from "../../components/ui";

import TaskCard from "../../components/dashboard/task/TaskCard";
import CreateTaskModal from "../../components/dashboard/task/CreateTaskModal";
import EditProjectModal from "../../components/dashboard/project/EditProjectModal";
import ProjectTimelineCalendar from "../../components/dashboard/project/ProjectTimelineCalendar";

function ProjectDetails() {
  const toIdKey = (value) => String(value ?? "");

  const { projectId } = useParams();

  const {
    projects,
    teamMembers,
    tasks,
    addTask,
    updateProject,
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
  const [isManageMembersOpen, setIsManageMembersOpen] = useState(false);
  const memberIdSet = new Set(
    (Array.isArray(project?.memberIds) ? project.memberIds : []).map((memberId) => toIdKey(memberId))
  );
  const allocatedMembers = teamMembers.filter(
    (member) =>
      member.role === "Member" &&
      memberIdSet.has(toIdKey(member.id))
  );


  /* ---------- Create Task ---------- */

  const handleCreateTask = async (task) => {
    return runAsync(
      async () => {
        const createdTask = await addTask({
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
    async (taskId, newStatus) => {
      await updateTaskStatus(taskId, newStatus);
    };


  /* ---------- Delete Task ---------- */

  const handleDeleteTask = async (taskId) => {
    return deleteTask(taskId);
  };
  const handleUpdateProjectMembers = async (projectToUpdateId, data) => {
    return runAsync(
      async () => {
        const updatedProject = await updateProject(projectToUpdateId, {
          name: data.name,
          description: data.description,
          memberIds: data.memberIds,
        });

        if (!updatedProject) {
          throw new Error("Failed to update project");
        }

        return updatedProject;
      },
      { successMessage: "Project updated successfully" },
    );
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

      {/* Allocated Team */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Allocated Team
          </h2>

          {isAdmin && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsManageMembersOpen(true)}
            >
              Add Members
            </Button>
          )}
        </div>

        {allocatedMembers.length === 0 ? (
          <p className="text-sm text-textSecondary">
            No members allocated to this project yet.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {allocatedMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-semibold text-white">
                  {member.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-xs text-white">
                  {member.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProjectTimelineCalendar tasks={projectTasks} />



      {/* Task List */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-white">
          Project Tasks
        </h2>
        <p className="text-sm text-textSecondary">
          Tasks created under this project
        </p>
      </div>

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
          defaultProjectId={pid}
        />
      )}

      {isAdmin && (
        <EditProjectModal
          key={project.id}
          isOpen={isManageMembersOpen}
          onClose={() => setIsManageMembersOpen(false)}
          project={project}
          onUpdate={handleUpdateProjectMembers}
        />
      )}


    </div>

  );

}

export default ProjectDetails;

