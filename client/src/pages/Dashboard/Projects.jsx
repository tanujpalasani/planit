import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import ProjectCard from "../../components/dashboard/project/ProjectCard";
import CreateProjectModal from "../../components/dashboard/project/CreateProjectModal";

function Projects() {

  const navigate = useNavigate();

  /* ---------------- Modal State ---------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);


  /* ---------------- Projects State ---------------- */
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "PlanIt SaaS Platform",
      description: "Full project management SaaS application",
      tasksCount: 12,
      membersCount: 4,
      status: "In Progress",
      color: "from-purple-500 to-pink-500",
      createdAt: new Date()
    },
    {
      id: 2,
      name: "Portfolio Website",
      description: "Personal developer portfolio website",
      tasksCount: 6,
      membersCount: 2,
      status: "Completed",
      color: "from-green-500 to-emerald-500",
      createdAt: new Date()
    },
    {
      id: 3,
      name: "Client Dashboard",
      description: "Analytics dashboard for client management",
      tasksCount: 9,
      membersCount: 3,
      status: "In Progress",
      color: "from-blue-500 to-indigo-500",
      createdAt: new Date()
    }
  ]);


  /* ---------------- Create Project ---------------- */
  const handleCreateProject = (data) => {

    const newProject = {
      id: Date.now(),
      name: data.name,
      description: data.description,
      tasksCount: 0,
      membersCount: 1,
      status: "In Progress",
      color: "from-purple-500 to-pink-500",
      createdAt: new Date()
    };

    setProjects(prev => [newProject, ...prev]);
  };


  /* ---------------- Navigate to Project ---------------- */
  const handleOpenProject = (project) => {
    navigate(`/dashboard/projects/${project.id}`);
  };


  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">


      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-white">
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
            text-white font-medium

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
      <div
        className="
          grid grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        "
      >

        {projects.map((project) => (

          <ProjectCard
            key={project.id}
            project={project}
            onClick={handleOpenProject}
          />

        ))}

      </div>



      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
      />


    </div>
  );

}

export default Projects;
