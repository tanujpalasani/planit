import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useAppContext } from "../../../context/useAppContext";
import Modal from "../../ui/Modal";
import { normalizeSubtask } from "../../../utils/subtaskUtils";

function CreateTaskModal({ isOpen, onClose, onCreate }) {

  const { teamMembers, projects } = useAppContext();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Todo");
  const [projectId, setProjectId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState([]);

  const createSubtaskId = () =>
    `subtask-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  /* ---------- Add Subtask ---------- */

  const handleAddSubtask = () => {

    if (!subtaskInput.trim()) return;

    setSubtasks((prev) => [
      ...prev,
      normalizeSubtask({
        id: createSubtaskId(),
        title: subtaskInput.trim(),
        completed: false,
        dueDate: null,
        assigneeId: null
      })
    ]);

    setSubtaskInput("");
  };


  /* ---------- Remove Subtask ---------- */

  const handleRemoveSubtask = (index) => {

    setSubtasks(prev =>
      prev.filter((_, i) => i !== index)
    );

  };

  const handleSubtaskDueDateChange = (index, value) => {
    setSubtasks((prev) =>
      prev.map((subtask, i) =>
        i === index
          ? normalizeSubtask({
              ...subtask,
              dueDate: value || null
            })
          : subtask
      )
    );
  };

  const handleSubtaskAssigneeChange = (index, value) => {
    setSubtasks((prev) =>
      prev.map((subtask, i) =>
        i === index
          ? normalizeSubtask({
              ...subtask,
              assigneeId: value ? Number(value) : null
            })
          : subtask
      )
    );
  };


  /* ---------- Create Task ---------- */

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

    const newTask = {

      title: title.trim(),

      status,

      priority,

      projectId: Number(projectId),

      assigneeId: assigneeId
        ? Number(assigneeId)
        : null,

      subtasks

    };

    onCreate(newTask);

    /* Reset form */

    setTitle("");
    setPriority("Medium");
    setStatus("Todo");
    setProjectId("");
    setAssigneeId("");
    setSubtaskInput("");
    setSubtasks([]);

    onClose();

  };


  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Task"
      size="md"
    >
      {/* If no projects exist */}
      {projects.length === 0 ? (
        <div className="text-center text-textSecondary py-6">
          Create a project first before adding tasks.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">


            {/* Title */}

            <div>

              <label className="text-sm text-textSecondary">
                Task Title
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 outline-none"
              />

            </div>


            {/* Priority */}

            <div>

              <label className="text-sm text-textSecondary">
                Priority
              </label>

              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value)
                }
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
              >

                <option>Low</option>
                <option>Medium</option>
                <option>High</option>

              </select>

            </div>


            {/* Status */}

            <div>

              <label className="text-sm text-textSecondary">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
              >

                <option>Todo</option>
                <option>In Progress</option>
                <option>Completed</option>

              </select>

            </div>


            {/* Project */}

            <div>

              <label className="text-sm text-textSecondary">
                Project
              </label>

              <select
                value={projectId}
                onChange={(e) =>
                  setProjectId(e.target.value)
                }
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
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

              <label className="text-sm text-textSecondary">
                Assignee
              </label>

              <select
                value={assigneeId}
                onChange={(e) =>
                  setAssigneeId(e.target.value)
                }
                className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
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

              <label className="text-sm text-textSecondary">
                Subtasks
              </label>

              <div className="flex gap-2 mt-1">

                <input
                  value={subtaskInput}
                  onChange={(e) =>
                    setSubtaskInput(e.target.value)
                  }
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2"
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
                    key={sub.id || index}
                    className="flex items-center gap-2 bg-white/5 px-2 py-2 rounded"
                  >
                    <span className="flex-1 text-xs text-white break-words">
                      {sub.title}
                    </span>

                    <input
                      type="date"
                      value={sub.dueDate || ""}
                      onChange={(event) =>
                        handleSubtaskDueDateChange(index, event.target.value)
                      }
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-textSecondary"
                    />

                    <select
                      value={sub.assigneeId ?? ""}
                      onChange={(event) =>
                        handleSubtaskAssigneeChange(index, event.target.value)
                      }
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-textSecondary"
                    >
                      <option value="">
                        Unassigned
                      </option>
                      {teamMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                          {member.name}
                        </option>
                      ))}
                    </select>

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
              Create Task
            </button>

        </form>
      )}
    </Modal>
  );
}

export default CreateTaskModal;

