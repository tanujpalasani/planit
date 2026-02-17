import { Check } from "lucide-react";

function SubtaskItem({
  subtask,
  index,
  onToggle,
  onDelete
}) {

  return (
    <div
      className="
        flex items-center justify-between

        bg-white/5
        border border-white/10

        rounded-lg

        px-3 py-2

        hover:bg-white/10

        transition
      "
    >

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Checkbox */}
        <button
          onClick={() => onToggle(index)}
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
        <span
          className={`
            text-sm

            ${
              subtask.completed
                ? "line-through text-textSecondary"
                : "text-white"
            }
          `}
        >
          {subtask.title}
        </span>

      </div>


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
  );

}

export default SubtaskItem;
