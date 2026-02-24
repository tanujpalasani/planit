import { useState } from "react";
import { FolderKanban, Users, CheckCircle2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/useAppContext";
import { useToast } from "../../../hooks/useToast";
import { Card, Button, Badge, Modal } from "../../ui";

function ProjectCard({ project, onClick }) {
  const navigate = useNavigate();
  const { deleteProject, tasks, user } = useAppContext();
  const { addToast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const isAdmin = user?.role === "Admin";
  const projectTaskCount = tasks.filter(
    (task) => String(task.projectId) === String(project.id)
  ).length;
  const memberCount = Array.isArray(project.memberIds)
    ? project.memberIds.length
    : project.members || project.membersCount || 0;

  const handleOpenProject = () => {
    if (onClick) {
      onClick(project);
    } else {
      if (isAdmin) {
        navigate(`/admin/projects/${project.id}`);
      }
    }
  };

  const handleDeleteProject = (event) => {
    event.stopPropagation();
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    await deleteProject(project.id);
    addToast("Project deleted successfully", "success");
    setIsConfirmOpen(false);
  };

  return (
    <>
      <Card
        hover={true}
        onClick={handleOpenProject}
        className="
          relative
          p-6
          hover:scale-[1.03]
          cursor-pointer
          group
        "
      >
        {/* Gradient Glow Background */}
        <div
          className={`
            absolute inset-0
            opacity-10 blur-xl
            rounded-xl
            group-hover:opacity-20
            transition-all
            bg-gradient-to-r ${project.color || "from-transparent to-transparent"}
          `}
        />

        {/* Content */}
        <div className="relative z-10 space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            {/* Icon */}
            <div
              className={`
                p-2 rounded-lg
                bg-gradient-to-r ${project.color}
              `}
            >
              <FolderKanban size={18} />
            </div>

            <div className="flex items-center gap-2">
              {/* Status */}
              <Badge
                variant="neutral"
                className="rounded-md bg-white/10 border-white/10 text-textSecondary"
              >
                {project.status}
              </Badge>

              {/* Delete */}
              {isAdmin && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleDeleteProject}
                  className="
                    h-8 w-8 p-0
                    opacity-0
                    group-hover:opacity-100
                    focus-visible:opacity-100
                    transition
                  "
                  aria-label="Delete project"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </div>

          {/* Project Info */}
          <div>
            <h3
              className="
              font-semibold
              text-lg
              group-hover:text-white
              transition
            "
            >
              {project.name}
            </h3>

            <p className="text-sm text-textSecondary">{project.description}</p>
          </div>

          {/* Footer */}
          <div className="flex justify-between text-sm text-textSecondary">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              {projectTaskCount} Tasks
            </div>

            <div className="flex items-center gap-2">
              <Users size={16} />
              {memberCount} Members
            </div>
          </div>
        </div>
      </Card>

      {isAdmin && (
        <Modal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          title="Delete Project"
          size="md"
          footer={
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                type="button"
                onClick={() => setIsConfirmOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={handleConfirmDelete}
              >
                Delete
              </Button>
            </div>
          }
        >
          <p className="text-sm text-textSecondary">
            Are you sure you want to delete this project? This action cannot be undone.
          </p>
        </Modal>
      )}
    </>
  );
}

export default ProjectCard;
