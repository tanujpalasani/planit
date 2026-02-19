import TaskCard from "./TaskCard";
import { Card, Badge } from "../../ui";

function KanbanColumn({
  title,
  status,
  tasks,
  onStatusChange,
  onDelete
}) {
  const columnTasks = tasks.filter((task) => task.status === status);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white">{title}</h3>

        <Badge variant="neutral" className="bg-white/10 text-textSecondary">
          {columnTasks.length}
        </Badge>
      </div>

      <div className="space-y-3 max-h-[70vh] overflow-y-auto">
        {columnTasks.length === 0 ? (
          <div className="text-center text-textSecondary text-sm py-8">
            No tasks
          </div>
        ) : (
          columnTasks.map(task => (
            <div key={task.id}>
              <div className="text-xs text-textSecondary mb-1">
                {task.projectName}
              </div>

              <TaskCard
                task={task}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
              />
            </div>
          ))
        )}
      </div>
    </Card>
  );
}

export default KanbanColumn;
