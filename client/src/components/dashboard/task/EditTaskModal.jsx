import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useAppContext } from "../../../context/useAppContext";
import Modal from "../../ui/Modal";

function EditTaskModal({ isOpen, onClose, task }) {

  const { teamMembers, projects, updateTask } = useAppContext();
  const isModalOpen = isOpen ?? Boolean(task);

  const normalizedSubtasks = (task?.subtasks || [])
    .map((subtask) =>
      typeof subtask === "string"
        ? { title: subtask, completed: false }
        : {
            title: subtask?.title || "",
            completed: Boolean(subtask?.completed)
          }
    )
    .filter((subtask) => subtask.title.trim());

  const [title, setTitle] = useState(task?.title || "");
  const [priority, setPriority] = useState(task?.priority || "Medium");
  const [status, setStatus] = useState(task?.status || "Todo");
  const [projectId, setProjectId] = useState(task?.projectId || "");
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || "");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState(normalizedSubtasks);

  if (!task) return null;


  /* ---------- Add Subtask ---------- */

  const handleAddSubtask = () => {

    if (!subtaskInput.trim()) return;

    setSubtasks((prev) => [
      ...prev,
      {
        title: subtaskInput.trim(),
        completed: false
      }
    ]);

    setSubtaskInput("");
  };


  /* ---------- Remove Subtask ---------- */

  const handleRemoveSubtask = (index) => {

    setSubtasks(prev =>
      prev.filter((_, i) => i !== index)
    );

  };


  /* ---------- Update Task ---------- */

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    if (!projectId) {
      alert("Please select a project");
      return;
    }

    const updatedTaskData = {

      title: title.trim(),

      status,

      priority,

      projectId: Number(projectId),

      assigneeId: assigneeId
        ? Number(assigneeId)
        : null,

      subtasks

    };

    updateTask(task.id, updatedTaskData);

    onClose();

  };


  return (
    <Modal
      isOpen={isModalOpen}
      onClose={onClose}
      title="Edit Task"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">


          {/* Title */}

          <div>

            <label className="text-sm text-textSecondary block mb-2">
              Task Title
            </label>

            <input
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Enter task title"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-white/30 transition"
            />

          </div>


          {/* Priority */}

          <div>

            <label className="text-sm text-textSecondary block mb-2">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-white/30 transition cursor-pointer"
            >

              <option>Low</option>
              <option>Medium</option>
              <option>High</option>

            </select>

          </div>


          {/* Status */}

          <div>

            <label className="text-sm text-textSecondary block mb-2">
              Status
            </label>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-white/30 transition cursor-pointer"
            >

              <option>Todo</option>
              <option>In Progress</option>
              <option>Completed</option>

            </select>

          </div>


          {/* Project */}

          <div>

            <label className="text-sm text-textSecondary block mb-2">
              Project
            </label>

            <select
              value={projectId}
              onChange={(e) =>
                setProjectId(e.target.value)
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-white/30 transition cursor-pointer"
            >

              <option value="">
                Select project
              </option>

              {projects.map(project => (

                <option
                  key={project.id}
                  value={project.id}
                >
                  {project.name}
                </option>

              ))}

            </select>

          </div>


          {/* Assignee */}

          <div>

            <label className="text-sm text-textSecondary block mb-2">
              Assignee
            </label>

            <select
              value={assigneeId}
              onChange={(e) =>
                setAssigneeId(e.target.value)
              }
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-white/30 transition cursor-pointer"
            >

              <option value="">
                Select team member
              </option>

              {teamMembers.map(member => (

                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.name}
                </option>

              ))}

            </select>

          </div>


          {/* Subtasks */}

          <div>

            <label className="text-sm text-textSecondary block mb-2">
              Subtasks
            </label>

            <div className="flex gap-2">

              <input
                value={subtaskInput}
                onChange={(e) =>
                  setSubtaskInput(e.target.value)
                }
                placeholder="Add a subtask"
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white outline-none focus:border-white/30 transition"
              />

              <button
                type="button"
                onClick={handleAddSubtask}
                className="bg-gradient-primary px-3 rounded-lg"
              >
                <Plus size={16} />
              </button>

            </div>


            <div className="mt-2 space-y-1">

              {subtasks.map((sub, index) => (

                <div
                  key={index}
                  className="flex justify-between text-xs bg-white/5 px-2 py-1 rounded"
                >

                  {sub.title}

                  <button
                    type="button"
                    onClick={() =>
                      handleRemoveSubtask(index)
                    }
                  >
                    <X size={12} />
                  </button>

                </div>

              ))}

            </div>

          </div>


          {/* Submit */}

          <button
            type="submit"
            className="w-full bg-gradient-primary py-2 rounded-lg font-medium hover:scale-[1.02] transition"
          >
            Save Changes
          </button>

      </form>
    </Modal>
  );
}

export default EditTaskModal;

