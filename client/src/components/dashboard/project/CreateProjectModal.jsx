import { useState } from "react";
import { Modal, Input, Button } from "../../ui";

function CreateProjectModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    onCreate(formData);

    setFormData({
      name: "",
      description: ""
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="create-project-form">
            Create
          </Button>
        </div>
      }
    >
      <form id="create-project-form" onSubmit={handleSubmit} className="space-y-4">
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
