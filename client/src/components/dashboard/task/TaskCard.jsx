import {
  CheckCircle2,
  Circle,
  Trash2,
  Flag
} from "lucide-react";

import SubtaskItem from "./SubtaskItem";
import { useAppContext } from "../../../context/AppContext";

function TaskCard({
  task,
  onStatusChange,
  onDelete
}) {

  const { teamMembers } = useAppContext();

  const assignee = teamMembers.find(
    (member) => member.id === task.assigneeId
  );

  /* ---------------- Priority Colors ---------------- */

  const priorityColors = {
    Low: "text-green-400 bg-green-400/10 border-green-400/20",
    Medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    High: "text-red-400 bg-red-400/10 border-red-400/20"
  };


  /* ---------------- Toggle Subtask (future backend ready) ---------------- */

  const handleToggleSubtask = (index) => {
    // Will connect to global state later
    console.log("Toggle subtask:", index);
  };


  /* ---------------- Delete Subtask (future ready) ---------------- */

  const handleDeleteSubtask = (index) => {
    console.log("Delete subtask:", index);
  };


  return (
    <div
      className="
        group

        bg-white/5
        border border-white/10

        hover:border-white/20
        hover:bg-white/10

        backdrop-blur-xl

        rounded-xl
        p-4

        transition-all duration-300
      "
    >

      {/* Top Row */}
      <div className="flex items-center justify-between">


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

          <span className="text-white font-medium">
            {task.title}
          </span>

        </div>



        {/* Right Actions */}
        <div className="flex items-center gap-3">


          {/* Priority */}
          {task.priority && (
            <div
              className={`
                flex items-center gap-1

                text-xs px-2 py-1

                rounded border

                ${priorityColors[task.priority]}
              `}
            >
              <Flag size={12} />
              {task.priority}
            </div>
          )}



          {/* Status Dropdown */}
          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value)
            }
            className="
              bg-white/5
              border border-white/10

              text-xs text-white

              rounded-lg
              px-2 py-1

              outline-none
              cursor-pointer
            "
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



          {/* Delete */}
          <button
            onClick={() => onDelete(task.id)}
            className="
              opacity-0
              group-hover:opacity-100

              text-red-400
              hover:text-red-300

              transition
            "
          >
            <Trash2 size={16} />
          </button>


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
      {task.subtasks && task.subtasks.length > 0 && (

        <div className="mt-4 space-y-2">

          {task.subtasks.map((subtask, index) => (

            <SubtaskItem
              key={index}
              subtask={
                typeof subtask === "string"
                  ? { title: subtask, completed: false }
                  : subtask
              }
              index={index}
              onToggle={handleToggleSubtask}
              onDelete={handleDeleteSubtask}
            />

          ))}

        </div>

      )}


    </div>
  );

}

export default TaskCard;
