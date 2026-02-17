import { X } from "lucide-react";
import { useState } from "react";

function CreateTaskModal({ isOpen, onClose, onCreate }) {

  const [formData, setFormData] = useState({
    title: "",
    status: "Todo"
  });

  if (!isOpen) return null;


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
      title: "",
      status: "Todo"
    });

    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="
        w-full max-w-md
        bg-white/5
        border border-white/10
        backdrop-blur-xl
        rounded-xl
        p-6
      ">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-semibold">
            Create Task
          </h2>

          <button onClick={onClose}>
            <X size={20} />
          </button>

        </div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>

            <label className="text-sm text-textSecondary">
              Task Title
            </label>

            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="
                w-full mt-1 px-3 py-2
                bg-white/5
                border border-white/10
                rounded-lg
              "
            />

          </div>


          {/* Status */}
          <div>

            <label className="text-sm text-textSecondary">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="
                w-full mt-1 px-3 py-2
                bg-white/5
                border border-white/10
                rounded-lg
              "
            >

              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>

            </select>

          </div>


          {/* Buttons */}
          <div className="flex justify-end gap-2">

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-gradient-primary rounded-lg"
            >
              Create
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateTaskModal;
