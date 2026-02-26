import { Search } from "lucide-react";
import { Input } from "../../ui";

function TaskFilters({
  selectedStatus,
  setSelectedStatus,
  selectedPriority,
  setSelectedPriority,
  selectedProject,
  setSelectedProject,
  searchQuery,
  setSearchQuery,
  projects
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm text-textSecondary mb-2">
          Status
        </label>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="
            w-full
            bg-white/5
            border border-white/10
            rounded-lg
            px-3 py-2
            text-white
            focus:outline-none
            hover:border-white/20
            hover:bg-white/[0.07]
            focus:border-white/40
            focus:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]
            transition-all duration-200
          "
        >
          <option value="All">All</option>
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-textSecondary mb-2">
          Priority
        </label>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="
            w-full
            bg-white/5
            border border-white/10
            rounded-lg
            px-3 py-2
            text-white
            focus:outline-none
            hover:border-white/20
            hover:bg-white/[0.07]
            focus:border-white/40
            focus:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]
            transition-all duration-200
          "
        >
          <option value="All">All</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm text-textSecondary mb-2">
          Project
        </label>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="
            w-full
            bg-white/5
            border border-white/10
            rounded-lg
            px-3 py-2
            text-white
            focus:outline-none
            hover:border-white/20
            hover:bg-white/[0.07]
            focus:border-white/40
            focus:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]
            transition-all duration-200
          "
        >
          <option value="All">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Search"
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by title..."
        leftIcon={<Search size={18} />}
        className="rounded-lg"
      />
    </div>
  );
}

export default TaskFilters;
