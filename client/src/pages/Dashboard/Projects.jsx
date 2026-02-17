import { Plus, FolderKanban, Users, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "../../components/dashboard/project/CreateProjectModal";

function Projects() {

  // ✅ Navigation hook (REQUIRED)
  const navigate = useNavigate();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Projects state
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "PlanIt SaaS Platform",
      description: "Full project management SaaS application",
      tasks: 12,
      members: 4,
      status: "In Progress",
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 2,
      name: "Portfolio Website",
      description: "Personal developer portfolio website",
      tasks: 6,
      members: 2,
      status: "Completed",
      color: "from-green-500 to-emerald-500"
    },
    {
      id: 3,
      name: "Client Dashboard",
      description: "Analytics dashboard for client management",
      tasks: 9,
      members: 3,
      status: "In Progress",
      color: "from-blue-500 to-indigo-500"
    }
  ]);

  // Handle project creation
  const handleCreateProject = (data) => {

    const newProject = {
      id: Date.now(),
      name: data.name,
      description: data.description,
      tasks: 0,
      members: 1,
      status: "In Progress",
      color: "from-purple-500 to-pink-500"
    };

    setProjects([newProject, ...projects]);
  };


  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Projects
          </h1>

          <p className="text-textSecondary">
            Manage and track all your projects
          </p>
        </div>

        {/* Create Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="
            flex items-center gap-2
            px-5 py-2.5
            rounded-lg
            bg-gradient-primary
            hover:scale-105
            hover:shadow-lg
            transition-all duration-300
          "
        >
          <Plus size={18} />
          Create Project
        </button>

      </div>


      {/* Projects Grid */}
      <div className="
        grid grid-cols-1
        md:grid-cols-2
        xl:grid-cols-3
        gap-6
      ">

        {projects.map((project) => (

          <div
            key={project.id}

            // ✅ THIS ENABLES NAVIGATION
            onClick={() => navigate(`/dashboard/projects/${project.id}`)}

            className="
              relative
              bg-white/5
              border border-white/10
              backdrop-blur-xl
              rounded-xl
              p-6
              hover:scale-[1.03]
              hover:border-white/20
              transition-all duration-300
              cursor-pointer
            "
          >

            {/* Glow */}
            <div className={`
              absolute inset-0
              bg-gradient-to-r ${project.color}
              opacity-10 blur-xl
              rounded-xl
            `} />


            {/* Content */}
            <div className="relative z-10 space-y-4">

              {/* Top */}
              <div className="flex justify-between items-start">

                <div className={`
                  p-2 rounded-lg
                  bg-gradient-to-r ${project.color}
                `}>
                  <FolderKanban size={18} />
                </div>

                <span className="
                  text-xs
                  px-2 py-1
                  rounded
                  bg-gradient-primary
                ">
                  {project.status}
                </span>

              </div>


              {/* Title */}
              <div>

                <h3 className="font-semibold text-lg">
                  {project.name}
                </h3>

                <p className="text-sm text-textSecondary">
                  {project.description}
                </p>

              </div>


              {/* Stats */}
              <div className="flex justify-between text-sm text-textSecondary">

                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  {project.tasks} Tasks
                </div>

                <div className="flex items-center gap-2">
                  <Users size={16} />
                  {project.members} Members
                </div>

              </div>

            </div>

          </div>

        ))}

      </div>


      {/* Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />

    </div>
  );

}

export default Projects;
