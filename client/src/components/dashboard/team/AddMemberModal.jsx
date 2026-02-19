import { useState } from "react";
import Modal from "../../ui/Modal";

function AddMemberModal({ isOpen, onClose, onAddMember }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "Developer",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      return;
    }

    onAddMember(formData);

    setFormData({
      name: "",
      email: "",
      role: "Developer",
    });

    onClose();
  };

  const roleOptions = ["Developer", "Designer", "Manager", "QA", "Product Owner"];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Team Member"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="
                w-full
                px-4 py-2.5
                
                bg-white/5
                border border-white/10
                rounded-lg
                
                text-white
                placeholder:text-textSecondary
                
                focus:outline-none
                focus:border-purple-500
                focus:ring-1 focus:ring-purple-500
                
                transition-all
              "
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className="
                w-full
                px-4 py-2.5
                
                bg-white/5
                border border-white/10
                rounded-lg
                
                text-white
                placeholder:text-textSecondary
                
                focus:outline-none
                focus:border-purple-500
                focus:ring-1 focus:ring-purple-500
                
                transition-all
              "
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="
                w-full
                px-4 py-2.5
                
                bg-white/5
                border border-white/10
                rounded-lg
                
                text-white
                
                focus:outline-none
                focus:border-purple-500
                focus:ring-1 focus:ring-purple-500
                
                transition-all
              "
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-6">
            
            <button
              type="button"
              onClick={onClose}
              className="
                flex-1
                px-4 py-2.5
                rounded-lg
                
                bg-white/5
                border border-white/10
                
                hover:bg-white/10
                
                transition-all
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              className="
                flex-1
                px-4 py-2.5
                rounded-lg
                
                bg-gradient-primary
                text-white font-medium
                
                hover:scale-105
                hover:shadow-lg
                
                transition-all
              "
            >
              Add Member
            </button>

          </div>

      </form>
    </Modal>
  );
}

export default AddMemberModal;

