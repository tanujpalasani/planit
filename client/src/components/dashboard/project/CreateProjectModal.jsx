import { useState } from "react";
import { Modal, Input, Button } from "../../ui";
import { useAppContext } from "../../../context/useAppContext";

function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const { user } = useAppContext();
  const isAdmin = user?.role === "Admin";

  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const resetForm = () => {
    setFormData({
      name: "",
      description: ""
    });
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const createdProject = await onCreate(formData);
    if (!createdProject) {
      setError("Could not create project.");
      return;
    }

    handleClose();
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Project"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="create-project-form">
            Create
          </Button>
        </div>
      }
    >
      <form id="create-project-form" onSubmit={handleSubmit} className="space-y-4">
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
      </form>
    </Modal>
  );
}

export default CreateProjectModal;
