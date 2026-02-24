import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/useAppContext";
import useAsyncAction from "../../hooks/useAsyncAction";
import { Button } from "../../components/ui";

import ProjectCard from "../../components/dashboard/project/ProjectCard";
import CreateProjectModal from "../../components/dashboard/project/CreateProjectModal";

function Projects() {

  const navigate = useNavigate();
  const { projects, addProject, user } = useAppContext();
  const { runAsync } = useAsyncAction();
  const isAdmin = user?.role === "Admin";

  /* ---------------- Modal State ---------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);


  /* ---------------- Create Project from Context ---------------- */
  const handleCreateProject = async (data) => {
    return runAsync(
      async () => {
        const createdProject = await addProject({
          name: data.name,
          description: data.description,
          tasksCount: 0,
          status: "In Progress",
          color: "from-purple-500 to-pink-500",
        });

        if (!createdProject) {
          throw new Error("Failed to create project");
        }

        return createdProject;
      },
      { successMessage: "Project created successfully" },
    );
  };


  /* ---------------- Navigate to Project ---------------- */
  const handleOpenProject = (project) => {
    navigate(`/admin/projects/${project.id}`);
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
        {isAdmin && (
          <Button
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus size={18} />}
            className="hover:scale-105"
          >
            Create Project
          </Button>
        )}

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
        {projects.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-white/10 bg-white/5 py-12 text-center text-textSecondary">
            {isAdmin ? "No projects yet. Create your first project." : "No projects available in this workspace."}
          </div>
        ) : (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={handleOpenProject}
            />
          ))
        )}

      </div>



      {/* Create Project Modal */}
      {isAdmin && (
        <CreateProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreate={handleCreateProject}
        />
      )}


    </div>
  );

}

export default Projects;

