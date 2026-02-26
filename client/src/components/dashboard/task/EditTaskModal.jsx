import { useMemo, useState } from "react";
import { X, Plus } from "lucide-react";
import { useAppContext } from "../../../context/useAppContext";
import Modal from "../../ui/Modal";
import { Button, Input } from "../../ui";
import { normalizeSubtask, normalizeSubtasksArray } from "../../../utils/subtaskUtils";

const selectClassName = "w-full mt-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition-all duration-200 hover:border-white/20 hover:bg-white/[0.07] focus:border-white/40 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.12)]";

function EditTaskModal({ isOpen, onClose, task }) {
  const { teamMembers, projects, updateTask, user } = useAppContext();
  const isAdmin = user?.role === "Admin";
  const isModalOpen = isOpen ?? Boolean(task);

  const [title, setTitle] = useState(task?.title || "");
  const [priority, setPriority] = useState(task?.priority || "Medium");
  const [status, setStatus] = useState(task?.status || "Todo");
  const [taskDueDate, setTaskDueDate] = useState(
    task?.dueDate ? String(task.dueDate).slice(0, 10) : ""
  );
  const [projectId, setProjectId] = useState(task?.projectId || "");
  const [assigneeId, setAssigneeId] = useState(task?.assigneeId || "");
  const [subtaskInput, setSubtaskInput] = useState("");
  const [subtasks, setSubtasks] = useState(
    normalizeSubtasksArray(task?.subtasks).filter((subtask) => subtask.title.trim())
  );
  const [error, setError] = useState("");
  const selectedProject = useMemo(
    () => projects.find((project) => String(project.id) === String(projectId)) || null,
    [projects, projectId]
  );
  const projectMemberIdSet = useMemo(
    () => new Set((selectedProject?.memberIds || []).map((memberId) => String(memberId))),
    [selectedProject]
  );
  const availableAssignees = useMemo(
    () =>
      teamMembers.filter(
        (member) =>
          member.role === "Member" &&
          projectMemberIdSet.has(String(member.id))
      ),
    [projectMemberIdSet, teamMembers]
  );

  if (!task || !isAdmin) {
    return null;
  }

  const normalizedAssigneeId = assigneeId && projectMemberIdSet.has(String(assigneeId))
    ? assigneeId
    : "";

  const handleAddSubtask = () => {
    if (!subtaskInput.trim()) {
      return;
    }

    setSubtasks((prev) => [
      ...prev,
      normalizeSubtask({
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

    const isUpdated = await updateTask(task.id, {
      title: title.trim(),
      status,
      priority,
      dueDate: taskDueDate || null,
      projectId,
      assigneeId: normalizedAssigneeId || null,
      subtasks: subtasks.map((subtask) => ({
        ...subtask,
        assigneeId: normalizedAssigneeId || null,
      })),
    });

    if (!isUpdated) {
      setError("Task update failed.");
      return;
    }

    onClose();
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onClose} title="Edit Task" size="md">
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
          <label className="text-sm text-textSecondary">Due Date</label>
          <input
            type="date"
            value={taskDueDate}
            onChange={(event) => setTaskDueDate(event.target.value)}
            className={selectClassName}
          />
        </div>

        <div>
          <label className="text-sm text-textSecondary">Project</label>
          <select
            value={projectId}
            onChange={(event) => {
              const nextProjectId = event.target.value;
              setProjectId(nextProjectId);
              setAssigneeId("");
              setSubtasks((prev) =>
                prev.map((subtask) => ({
                  ...subtask,
                  assigneeId: null,
                }))
              );
            }}
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
            value={normalizedAssigneeId}
            onChange={(event) => setAssigneeId(event.target.value)}
            className={selectClassName}
            disabled={!projectId || availableAssignees.length === 0}
          >
            <option value="">
              {!projectId ? "Select project first" : "Select team member"}
            </option>
            {availableAssignees.map((member) => (
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
              placeholder="Add a subtask"
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
                <span className="rounded border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-textSecondary">
                  {normalizedAssigneeId
                    ? `Assigned to ${availableAssignees.find((member) => String(member.id) === String(normalizedAssigneeId))?.name || "selected member"}`
                    : "Select task assignee first"}
                </span>

                <button type="button" onClick={() => handleRemoveSubtask(index)} aria-label="Remove subtask">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Save Changes
        </Button>
      </form>
    </Modal>
  );
}

export default EditTaskModal;
