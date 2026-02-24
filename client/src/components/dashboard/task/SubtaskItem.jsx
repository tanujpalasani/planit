import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Badge } from "../../ui";
import { useAppContext } from "../../../context/useAppContext";

function SubtaskItem({
  subtask,
  index,
  onToggle,
  onDelete,
  onUpdate,
  dueDate,
  assigneeId,
  isOverdue,
  isDragging,
  isDropTarget,
  onDragStartSubtask,
  onDragOverSubtask,
  onDropSubtask,
  onDragEndSubtask
}) {
  const { teamMembers } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(subtask.title);
  const inputRef = useRef(null);
  const subtaskAssignee = teamMembers.find(
    (member) => String(member.id) === String(assigneeId || "")
  );

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const canToggle = Boolean(onToggle);
  const canEdit = Boolean(onUpdate);

  const saveEdit = () => {
    const trimmedValue = editValue.trim();

    if (!trimmedValue) {
      setEditValue(subtask.title);
      setIsEditing(false);
      return;
    }

    if (trimmedValue !== subtask.title && canEdit) {
      onUpdate?.(subtask.id, trimmedValue, index);
    }

    setIsEditing(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveEdit();
    }

    if (event.key === "Escape") {
      setEditValue(subtask.title);
      setIsEditing(false);
    }
  };

  return (
    <div
      draggable={!isEditing && Boolean(onDragStartSubtask)}
      onDragStart={(event) => {
        if (!onDragStartSubtask) {
          return;
        }
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(index));
        onDragStartSubtask?.(index);
      }}
      onDragOver={(event) => onDragOverSubtask?.(event, index)}
      onDrop={() => onDropSubtask?.(index)}
      onDragEnd={onDragEndSubtask}
      className={`
        group relative

        flex items-center justify-between

        ${isDropTarget ? "bg-white/10 border-blue-400/70" : isOverdue ? "bg-red-500/10 border-red-400/30" : "bg-white/5 border-white/10"}
        border
        border-l-2
        ${isOverdue ? "border-l-red-400" : "border-l-transparent"}

        rounded-lg

        px-3 py-2

        hover:bg-white/10
        transition-all
      `}
      style={{
        opacity: isDragging ? 0.55 : 1
      }}
    >
      {/* Left */}
      <div className="flex flex-1 items-center gap-3">

        {/* Checkbox */}
        <button
          onClick={() => {
            if (canToggle) {
              onToggle(index);
            }
          }}
          className={`
            w-4 h-4

            rounded

            border border-white/20

            flex items-center justify-center

            transition

            ${
              subtask.completed
                ? "bg-green-500 border-green-500"
                : ""
            }
          `}
        >

          {subtask.completed && (
            <Check size={12} />
          )}

        </button>


        {/* Title */}
        {isEditing && canEdit ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(event) => setEditValue(event.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="
              w-full
              min-w-[140px]
              bg-white/10
              border border-white/20
              rounded
              px-2 py-1
              text-sm text-white
              outline-none
              focus:border-white/40
              transition
            "
          />
        ) : (
          <div className="min-w-0">
            <span
              onDoubleClick={() => {
                if (!canEdit) {
                  return;
                }
                setEditValue(subtask.title);
                setIsEditing(true);
              }}
              className={`
                block text-sm
                cursor-text
                transition-colors

                ${
                  subtask.completed
                    ? "line-through text-textSecondary"
                    : "text-white"
                }
              `}
            >
              {subtask.title}
            </span>

            <div className="mt-1 flex items-center gap-2">
              {dueDate && (
                <span className="text-[11px] text-textSecondary">
                  Due {dueDate}
                </span>
              )}

              {isOverdue && (
                <Badge variant="danger">
                  Overdue
                </Badge>
              )}
            </div>
          </div>
        )}

      </div>


      <div className="ml-2 flex items-center gap-2">
        {subtaskAssignee && (
          <div
            className="
              flex items-center gap-1.5
              rounded-full
              bg-white/10
              px-2 py-1
            "
            title={subtaskAssignee.name}
          >
            <span
              className="
                flex h-5 w-5 items-center justify-center
                rounded-full
                bg-gradient-primary
                text-[10px] font-semibold text-white
              "
            >
              {subtaskAssignee.name.charAt(0).toUpperCase()}
            </span>
            <span className="max-w-[90px] truncate text-[11px] text-textSecondary">
              {subtaskAssignee.name}
            </span>
          </div>
        )}

        {/* Delete */}
        {onDelete && (
          <button
            onClick={() => onDelete(index)}
            className="
              text-red-400
              hover:text-red-300

              text-xs

              opacity-0
              group-hover:opacity-100

              transition
            "
          >
            Remove
          </button>
        )}
      </div>

    </div>
  );

}

export default SubtaskItem;
