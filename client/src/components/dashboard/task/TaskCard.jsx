import { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Flag,
  Edit
} from "lucide-react";

import SubtaskItem from "./SubtaskItem";
import EditTaskModal from "./EditTaskModal";
import { useAppContext } from "../../../context/useAppContext";
import { useToast } from "../../../hooks/useToast";
import { Card, Badge, Button, Modal } from "../../ui";

function TaskCard({
  task,
  onStatusChange,
  onDelete
}) {

  const { teamMembers, updateTask } = useAppContext();
  const { addToast } = useToast();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const assignee = teamMembers.find(
    (member) => member.id === task.assigneeId
  );
  const normalizedSubtasks = (task.subtasks || []).map(
    (subtask) =>
      typeof subtask === "string"
        ? { title: subtask, completed: false }
        : subtask
  );
  const statusBadgeVariantMap = {
    "todo": "neutral",
    "in-progress": "info",
    "done": "success",
    "in progress": "info",
    "completed": "success"
  };
  const priorityBadgeVariantMap = {
    "low": "neutral",
    "medium": "warning",
    "high": "danger"
  };
  const statusKey = String(task.status || "").trim().toLowerCase();
  const priorityKey = String(task.priority || "").trim().toLowerCase();


  /* ---------------- Toggle Subtask (future backend ready) ---------------- */

  const handleToggleSubtask = (index) => {
    const updatedSubtasks = normalizedSubtasks.map(
      (subtask, i) =>
        i === index
          ? {
              ...subtask,
              completed: !subtask.completed
            }
          : subtask
    );

    updateTask(task.id, { subtasks: updatedSubtasks });
  };


  /* ---------------- Delete Subtask (future ready) ---------------- */

  const handleDeleteSubtask = (index) => {
    const updatedSubtasks =
      normalizedSubtasks.filter(
        (_, i) => i !== index
      );

    updateTask(task.id, { subtasks: updatedSubtasks });
  };

  const formatStatusLabel = (statusValue) => {
    const normalized = String(statusValue || "").trim().toLowerCase();

    if (normalized === "todo" || normalized === "to do") {
      return "To Do";
    }
    if (normalized === "in-progress" || normalized === "in progress") {
      return "In Progress";
    }
    if (normalized === "done" || normalized === "completed") {
      return "Done";
    }

    return statusValue;
  };

  const handleStatusChange = (event) => {
    const nextStatus = event.target.value;
    onStatusChange(task.id, nextStatus);
    addToast(`Task moved to ${formatStatusLabel(nextStatus)}`, "info");
  };

  const handleDeleteClick = (event) => {
    event.stopPropagation();
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    onDelete(task.id);
    addToast("Task deleted successfully", "success");
    setIsConfirmOpen(false);
  };


  return (
    <Card hover={true} className="group p-4">

      {/* Top Row */}
      <div className="flex items-start justify-between gap-3">


        {/* Left */}
        <div className="flex items-center gap-3">

          {task.status === "Completed" ? (
            <CheckCircle2
              className="text-green-400"
              size={18}
            />
          ) : (
            <Circle
              className="text-slate-400"
              size={18}
            />
          )}

          <span className="text-white font-medium break-words">
            {task.title}
          </span>

        </div>



        {/* Right Actions */}
        <div className="flex items-center justify-end gap-2 flex-wrap">


          {/* Priority */}
          {task.priority && (
            <Badge
              variant={priorityBadgeVariantMap[priorityKey] || "neutral"}
              className="gap-1"
            >
              <Flag size={12} />
              {task.priority}
            </Badge>
          )}

          <div className="relative">
            <Badge
              variant={statusBadgeVariantMap[statusKey] || "neutral"}
              className="pr-5"
            >
              {task.status}
            </Badge>

            <select
              value={task.status}
              onChange={handleStatusChange}
              className="
                absolute inset-0
                w-full h-full
                opacity-0
                cursor-pointer
              "
              aria-label="Update task status"
            >
              <option value="Todo">
                Todo
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>
            </select>
          </div>



          {/* Delete */}
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteClick}
            className="
              opacity-0
              group-hover:opacity-100
              focus-visible:opacity-100
              h-8 w-8 p-0
              bg-transparent text-red-400 hover:text-red-300 hover:bg-red-500/10
            "
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </Button>

          {/* Edit */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="
              opacity-0
              group-hover:opacity-100
              focus-visible:opacity-100
              h-8 w-8 p-0
              text-blue-300 hover:text-blue-200
            "
            aria-label="Edit task"
          >
            <Edit size={16} />
          </Button>

        </div>

      </div>



      {/* Assignee */}
      {assignee && (

        <div className="mt-3 flex items-center gap-2">

          <div
            className="
              w-7 h-7

              rounded-full

              bg-gradient-primary

              flex items-center justify-center

              text-xs text-white font-semibold
            "
            title={assignee.name}
          >
            {assignee.name.charAt(0).toUpperCase()}
          </div>

          <span className="text-sm text-textSecondary">
            {assignee.name}
          </span>

        </div>

      )}



      {/* Subtasks */}
      {normalizedSubtasks.length > 0 && (

        <div className="mt-4 space-y-2">

          {normalizedSubtasks.map((subtask, index) => (

            <SubtaskItem
              key={index}
              subtask={subtask}
              index={index}
              onToggle={handleToggleSubtask}
              onDelete={handleDeleteSubtask}
            />

          ))}

        </div>

      )}

      {/* Edit Task Modal */}
      {isEditOpen && (
        <EditTaskModal
          onClose={() => setIsEditOpen(false)}
          task={task}
        />
      )}

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Delete Task"
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
          Are you sure you want to delete this task? This action cannot be undone.
        </p>
      </Modal>

    </Card>
  );

}

export default TaskCard;

