import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Trash2,
  Flag,
  Edit,
  ChevronDown
} from "lucide-react";

import SubtaskItem from "./SubtaskItem";
import EditTaskModal from "./EditTaskModal";
import { useAppContext } from "../../../context/useAppContext";
import { useToast } from "../../../hooks/useToast";
import { Card, Badge, Button, Modal } from "../../ui";
import { isPastDate } from "../../../utils/dateUtils";
import { normalizeSubtasksArray } from "../../../utils/subtaskUtils";

function TaskCard({
  task,
  onStatusChange,
  onDelete
}) {

  const { user, teamMembers, updateTask } = useAppContext();
  const { addToast } = useToast();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dropTargetIndex, setDropTargetIndex] = useState(null);
  const hasAutoCompletedRef = useRef(false);

  const assignee = teamMembers.find(
    (member) => member.id === task.assigneeId
  );
  const normalizedSubtasks = useMemo(
    () => normalizeSubtasksArray(task.subtasks),
    [task.subtasks]
  );
  const isSubtaskOverdue = (subtask) => {
    if (subtask?.completed) {
      return false;
    }

    return isPastDate(subtask?.dueDate);
  };

  const overdueCount = useMemo(
    () =>
      normalizedSubtasks.filter((subtask) => {
        if (subtask?.completed) {
          return false;
        }

        return isPastDate(subtask?.dueDate);
      }).length,
    [normalizedSubtasks]
  );
  const {
    totalSubtasks,
    completedSubtasks,
    completionPercent
  } = useMemo(() => {
    const total = normalizedSubtasks.length;
    const completed = normalizedSubtasks.filter(
      (subtask) => Boolean(subtask?.completed)
    ).length;
    const percent = total > 0
      ? Math.round((completed / total) * 100)
      : 0;

    return {
      totalSubtasks: total,
      completedSubtasks: completed,
      completionPercent: percent
    };
  }, [normalizedSubtasks]);
  const subtasksAssignedToCurrentUser = !user?.id
    ? 0
    : normalizedSubtasks.filter(
      (subtask) => String(subtask.assigneeId || "") === String(user.id)
    ).length;
  const statusBadgeVariantMap = {
    "Todo": "neutral",
    "In Progress": "info",
    "Completed": "success"
  };
  const priorityBadgeVariantMap = {
    "low": "neutral",
    "medium": "warning",
    "high": "danger"
  };
  const statusKey = String(task.status || "").trim();
  const priorityKey = String(task.priority || "").trim().toLowerCase();
  const isTaskDone = statusKey === "Completed";

  useEffect(() => {
    if (!hasAutoCompletedRef.current && !isTaskDone && totalSubtasks > 0 && completionPercent === 100) {
      onStatusChange(task.id, "Completed");
      hasAutoCompletedRef.current = true;
      return;
    }

    if (completionPercent < 100 || isTaskDone) {
      hasAutoCompletedRef.current = false;
    }
  }, [completionPercent, isTaskDone, onStatusChange, task.id, totalSubtasks]);


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

  const handleUpdateSubtask = (subtaskId, updatedTitle, index) => {
    const trimmedTitle = String(updatedTitle || "").trim();
    if (!trimmedTitle) {
      return;
    }

    const updatedSubtasks = normalizedSubtasks.map((subtask, i) => {
      const hasId = subtaskId !== undefined && subtaskId !== null;
      const isTarget = hasId
        ? subtask?.id === subtaskId
        : i === index;

      if (!isTarget) {
        return subtask;
      }

      return {
        ...subtask,
        title: trimmedTitle
      };
    });

    updateTask(task.id, { subtasks: updatedSubtasks });
  };

  const handleSubtaskDragStart = (index) => {
    setDraggedIndex(index);
    setDropTargetIndex(index);
  };

  const handleSubtaskDragOver = (event, index) => {
    event.preventDefault();
    if (draggedIndex === null || draggedIndex === index) {
      return;
    }
    setDropTargetIndex(index);
  };

  const handleSubtaskDrop = (targetIndex) => {
    if (
      draggedIndex === null ||
      draggedIndex === targetIndex ||
      draggedIndex < 0 ||
      targetIndex < 0
    ) {
      setDraggedIndex(null);
      setDropTargetIndex(null);
      return;
    }

    const reorderedSubtasks = [...normalizedSubtasks];
    const [draggedSubtask] = reorderedSubtasks.splice(draggedIndex, 1);
    reorderedSubtasks.splice(targetIndex, 0, draggedSubtask);

    updateTask(task.id, { subtasks: reorderedSubtasks });
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const handleSubtaskDragEnd = () => {
    setDraggedIndex(null);
    setDropTargetIndex(null);
  };

  const formatStatusLabel = (statusValue) => {
    const normalized = String(statusValue || "").trim();

    if (normalized === "Todo") {
      return "To Do";
    }
    if (normalized === "In Progress") {
      return "In Progress";
    }
    if (normalized === "Completed") {
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
    <Card
      hover={true}
      className="group p-4"
      data-subtasks-assigned={subtasksAssignedToCurrentUser}
    >

      {/* Top Row */}
      <div className="flex items-start justify-between gap-3">


        {/* Left */}
        <div className="flex flex-1 items-start gap-3">

          {isTaskDone ? (
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

          <div className="min-w-0 flex-1 space-y-3">
            <span className="block text-white font-medium break-words">
              {task.title}
            </span>

            {totalSubtasks > 0 && (
              <div className="space-y-2">
                <div className="h-2 w-full rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full bg-gradient-primary transition-all duration-300"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Badge variant="info">
                    {completionPercent}% Complete
                  </Badge>

                  <span className="text-xs text-textSecondary">
                    {completedSubtasks}/{totalSubtasks} subtasks
                  </span>
                </div>
              </div>
            )}
          </div>

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

          {overdueCount > 0 && (
            <Badge variant="danger">
              {overdueCount} Overdue
            </Badge>
          )}

          {totalSubtasks > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="h-8 w-8 p-0 text-textSecondary hover:text-white"
              aria-label={isExpanded ? "Collapse subtasks" : "Expand subtasks"}
            >
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${
                  isExpanded ? "rotate-0" : "-rotate-90"
                }`}
              />
            </Button>
          )}



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
      {normalizedSubtasks.length > 0 && isExpanded && (

        <div className="mt-4 space-y-2">

          {normalizedSubtasks.map((subtask, index) => (

            <SubtaskItem
              key={subtask.id || index}
              subtask={subtask}
              index={index}
              onToggle={handleToggleSubtask}
              onDelete={handleDeleteSubtask}
              onUpdate={handleUpdateSubtask}
              dueDate={subtask.dueDate}
              assigneeId={subtask.assigneeId}
              isOverdue={isSubtaskOverdue(subtask)}
              isDragging={draggedIndex === index}
              isDropTarget={dropTargetIndex === index && draggedIndex !== index}
              onDragStartSubtask={handleSubtaskDragStart}
              onDragOverSubtask={handleSubtaskDragOver}
              onDropSubtask={handleSubtaskDrop}
              onDragEndSubtask={handleSubtaskDragEnd}
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

