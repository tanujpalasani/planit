import { Plus } from "lucide-react";
import { Button } from "../../ui";

function TaskToolbar({ viewMode, setViewMode, onCreateClick, canCreate = true, title = "Tasks" }) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold">
          {title}
        </h1>

        <p className="text-textSecondary">
          Manage all your tasks in one place
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex gap-2 bg-white/5 border border-white/10 rounded-lg p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`
              px-4 py-2 rounded-md transition
              ${viewMode === "list"
                ? "bg-gradient-primary text-white"
                : "text-textSecondary hover:text-white"
              }
            `}
          >
            List View
          </button>

          <button
            onClick={() => setViewMode("kanban")}
            className={`
              px-4 py-2 rounded-md transition
              ${viewMode === "kanban"
                ? "bg-gradient-primary text-white"
                : "text-textSecondary hover:text-white"
              }
            `}
          >
            Kanban View
          </button>
        </div>

        {canCreate && (
          <Button
            variant="primary"
            onClick={onCreateClick}
            className="px-5 py-2.5 rounded-lg hover:scale-105"
            leftIcon={<Plus size={18} />}
          >
            Create Task
          </Button>
        )}
      </div>
    </div>
  );
}

export default TaskToolbar;
