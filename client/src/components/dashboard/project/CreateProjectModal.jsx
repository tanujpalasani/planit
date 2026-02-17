import { X } from "lucide-react";
import { useState } from "react";

function CreateProjectModal({ isOpen, onClose, onCreate }) {
  

  const [formData, setFormData] = useState({
    name: "",
    description: ""
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
      name: "",
      description: ""
    });

    onClose();
  };


  return (
    <div
      className="
        fixed inset-0 z-50

        flex items-center justify-center

        bg-black/50
        backdrop-blur-sm
      "
    >

      {/* Modal Card */}
      <div
        className="
          w-full max-w-md

          bg-white/5
          border border-white/10
          backdrop-blur-xl

          rounded-xl
          p-6

          shadow-2xl

          animate-fade-up
        "
      >

        {/* Header */}
        <div className="flex justify-between items-center mb-4">

          <h2 className="text-xl font-semibold">
            Create Project
          </h2>

          <button
            onClick={onClose}
            className="
              text-textSecondary
              hover:text-white
              transition
            "
          >
            <X size={20} />
          </button>

        </div>


        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Project Name */}
          <div>

            <label className="text-sm text-textSecondary">
              Project Name
            </label>

            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="
                w-full mt-1

                px-3 py-2
                rounded-lg

                bg-white/5
                border border-white/10

                focus:outline-none
                focus:border-purple-500

                transition
              "
            />

          </div>


          {/* Description */}
          <div>

            <label className="text-sm text-textSecondary">
              Description
            </label>

            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="
                w-full mt-1

                px-3 py-2
                rounded-lg

                bg-white/5
                border border-white/10

                focus:outline-none
                focus:border-purple-500

                transition
              "
            />

          </div>


          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="
                px-4 py-2
                rounded-lg

                bg-white/5
                hover:bg-white/10

                transition
              "
            >
              Cancel
            </button>


            <button
              type="submit"
              className="
                px-4 py-2
                rounded-lg

                bg-gradient-primary

                hover:scale-105

                transition
              "
            >
              Create
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CreateProjectModal;
