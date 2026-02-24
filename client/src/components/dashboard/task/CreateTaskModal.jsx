import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useAppContext } from "../../../context/useAppContext";
import Modal from "../../ui/Modal";
import { Button, Input } from "../../ui";
import { normalizeSubtask } from "../../../utils/subtaskUtils";

const selectClassName = "w-full mt-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white outline-none focus:border-purple-500";

function CreateTaskModal({ isOpen, onClose, onCreate }) {
  const { teamMembers, projects, user } = useAppContext();
  const isAdmin = user?.role === "Admin";

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Todo");
  const [projectId, setProjectId] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [error, setError] = useState("");

  const createSubtaskId = () =>
    `subtask-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  const resetForm = () => {
    setTitle("");
    setPriority("Medium");
    setStatus("Todo");
    setProjectId("");
    setAssigneeId("");
    setSubtaskInput("");
    setSubtasks([]);
    setError("");
  };

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) {
      return;
    }

    setSubtasks((prev) => [
      ...prev,
      normalizeSubtask({
        id: createSubtaskId(),
        title: subtaskInput.trim(),
        completed: false,
        dueDate: null,
        assigneeId: null,
      }),
    ]);

    setSubtaskInput("");
  };

  const handleRemoveSubtask = (index) => {
    setSubtasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubtaskDueDateChange = (index, value) => {
    setSubtasks((prev) =>
      prev.map((subtask, i) =>
        i === index
          ? normalizeSubtask({
              ...subtask,
              dueDate: value || null,
            })
          : subtask,
      ),
    );
  };

  const handleSubtaskAssigneeChange = (index, value) => {
    setSubtasks((prev) =>
      prev.map((subtask, i) =>
        i === index
          ? normalizeSubtask({
              ...subtask,
              assigneeId: value || null,
            })
          : subtask,
      ),
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (!projectId) {
      setError("Please select a project.");
      return;
    }

    const createdTask = await onCreate({
      title: title.trim(),
      status,
      priority,
      projectId,
      assigneeId: assigneeId || null,
      subtasks,
    });

    if (!createdTask) {
      setError("Could not create task.");
      return;
    }

    resetForm();
    onClose();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create Task" size="md">
      {projects.length === 0 ? (
        <div className="text-center text-textSecondary py-6">
          Create a project first before adding tasks.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-300">{error}</p>}

          <Input
            label="Task Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter task title"
          />

          <div>
            <label className="text-sm text-textSecondary">Priority</label>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              className={selectClassName}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-textSecondary">Status</label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className={selectClassName}
            >
              <option>Todo</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-textSecondary">Project</label>
            <select
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              className={selectClassName}
            >
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-textSecondary">Assignee</label>
            <select
              value={assigneeId}
              onChange={(event) => setAssigneeId(event.target.value)}
              className={selectClassName}
            >
              <option value="">Select team member</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-textSecondary">Subtasks</label>

            <div className="flex gap-2 mt-1">
              <Input
                value={subtaskInput}
                onChange={(event) => setSubtaskInput(event.target.value)}
                placeholder="Add subtask"
                className="mt-0"
              />
              <Button type="button" onClick={handleAddSubtask} className="px-3" aria-label="Add subtask">
                <Plus size={16} />
              </Button>
            </div>

            <div className="mt-2 space-y-1">
              {subtasks.map((subtask, index) => (
                <div key={subtask.id || index} className="flex items-center gap-2 bg-white/5 px-2 py-2 rounded">
                  <span className="flex-1 text-xs text-white break-words">{subtask.title}</span>

                  <input
                    type="date"
                    value={subtask.dueDate || ""}
                    onChange={(event) => handleSubtaskDueDateChange(index, event.target.value)}
                    className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-textSecondary"
                  />

                  <select
                    value={subtask.assigneeId ?? ""}
                    onChange={(event) => handleSubtaskAssigneeChange(index, event.target.value)}
                    className="bg-white/5 border border-white/10 rounded px-2 py-1 text-xs text-textSecondary"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>

                  <button type="button" onClick={() => handleRemoveSubtask(index)} aria-label="Remove subtask">
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Task
          </Button>
        </form>
      )}
    </Modal>
  );
}

export default CreateTaskModal;
