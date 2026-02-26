import { useMemo, useState } from "react";
import { Modal, Input, Button } from "../../ui";
import { useAppContext } from "../../../context/useAppContext";

function EditProjectModal({ isOpen, onClose, project, onUpdate }) {
  const { user, teamMembers } = useAppContext();
  const isAdmin = user?.role === "Admin";

  const selectableMembers = useMemo(
    () => teamMembers.filter((member) => member.role === "Member"),
    [teamMembers]
  );

  const [formData, setFormData] = useState(() => ({
    name: project?.name || project?.title || "",
    description: project?.description || "",
    memberIds: Array.isArray(project?.memberIds) ? project.memberIds.map(String) : [],
  }));
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!project?.id) {
      setError("Invalid project selected.");
      return;
    }

    const updatedProject = await onUpdate(project.id, {
      name: formData.name,
      description: formData.description,
      memberIds: formData.memberIds,
    });

    if (!updatedProject) {
      setError("Could not update project.");
      return;
    }

    onClose();
  };

  if (!isAdmin || !project) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="edit-project-form">
            Save Changes
          </Button>
        </div>
      }
    >
      <form id="edit-project-form" onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-300">{error}</p>}
        <Input
          label="Project Name"
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <Input
          label="Description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />

        <div>
          <p className="mb-2 text-sm text-textSecondary">
            Allocate Team Members
          </p>

          {selectableMembers.length === 0 ? (
            <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-textSecondary">
              No team members available. Add members from Team page first.
            </p>
          ) : (
            <div className="max-h-44 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-3">
              {selectableMembers.map((member) => {
                const isChecked = formData.memberIds.includes(String(member.id));

                return (
                  <label
                    key={member.id}
                    className="flex cursor-pointer items-center justify-between rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-white/10 hover:bg-white/5"
                  >
                    <span className="text-sm text-white">
                      {member.name}
                    </span>

                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(event) => {
                        setFormData((prev) => ({
                          ...prev,
                          memberIds: event.target.checked
                            ? [...prev.memberIds, String(member.id)]
                            : prev.memberIds.filter((id) => String(id) !== String(member.id)),
                        }));
                      }}
                      className="h-4 w-4 rounded border-white/20 bg-white/10 accent-white"
                    />
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default EditProjectModal;
