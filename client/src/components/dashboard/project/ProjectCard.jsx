import { FolderKanban, Users, CheckCircle2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../../context/useAppContext";

function ProjectCard({ project, onClick }) {

  const navigate = useNavigate();
  const { deleteProject, tasks } = useAppContext();
  const projectTaskCount = tasks.filter(
    (task) => task.projectId === project.id
  ).length;

  const handleOpenProject = () => {
    if (onClick) {
      onClick(project);
    } else {
      navigate(`/dashboard/projects/${project.id}`);
    }
  };

  const handleDeleteProject = (event) => {
    event.stopPropagation();
    if (confirm("Delete this project? This will remove all tasks.")) {
      deleteProject(project.id);
    }
  };


  return (
    <div
      onClick={handleOpenProject}
      className="
        relative

        bg-white/5
        border border-white/10
        backdrop-blur-xl

        rounded-xl
        p-6

        hover:scale-[1.03]
        hover:border-white/20
        hover:bg-white/[0.07]

        transition-all duration-300

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
            <span
              className="
                text-xs
                px-2 py-1
                rounded-md

                bg-white/10
                border border-white/10

                text-textSecondary
              "
            >
              {project.status}
            </span>

            {/* Delete */}
            <button
              onClick={handleDeleteProject}
              className="
                text-red-400
                hover:text-red-300

                opacity-0
                group-hover:opacity-100

                focus-visible:opacity-100

                transition
              "
              aria-label="Delete project"
            >
              <Trash2 size={16} />
            </button>

          </div>

        </div>


        {/* Project Info */}
        <div>

          <h3 className="
            font-semibold
            text-lg
            group-hover:text-white
            transition
          ">
            {project.name}
          </h3>

          <p className="text-sm text-textSecondary">
            {project.description}
          </p>

        </div>


        {/* Footer */}
        <div className="flex justify-between text-sm text-textSecondary">

          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            {projectTaskCount} Tasks
          </div>

          <div className="flex items-center gap-2">
            <Users size={16} />
            {project.members || project.membersCount || 0} Members
          </div>

        </div>

      </div>

    </div>
  );

}

export default ProjectCard;

