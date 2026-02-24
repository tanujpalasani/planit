import { useState } from "react";
import Modal from "../../ui/Modal";
import { Button, Input } from "../../ui";
import { useAppContext } from "../../../context/useAppContext";

function AddMemberModal({ isOpen, onClose, onAddMember }) {
  const { user } = useAppContext();
  const isAdmin = user?.role === "Admin";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const createdMember = await onAddMember({
      name,
      email,
      password,
    });

    if (createdMember) {
      handleClose();
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Team Member"
      size="md"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" type="button" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="flex-1" form="add-member-form">
            Add Member
          </Button>
        </div>
      }
    >
      <form id="add-member-form" onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-red-300">{error}</p>}

        <Input
          type="text"
          name="name"
          label="Name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
        />

        <Input
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@example.com"
        />

        <Input
          type="password"
          name="password"
          label="Password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />

        <Input
          type="password"
          name="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm password"
        />
      </form>
    </Modal>
  );
}

export default AddMemberModal;
