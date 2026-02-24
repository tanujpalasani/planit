import { useMemo, useState } from "react";
import { User, Mail, Shield, Edit, Save } from "lucide-react";
import { useAppContext } from "../../context/useAppContext";
import { Button, Input } from "../../components/ui";

function Profile() {
  const { user, updateCurrentUserProfile, projects, tasks } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [formUser, setFormUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [error, setError] = useState("");
  const isAdmin = user?.role === "Admin";

  const completedCount = useMemo(
    () => tasks.filter((task) => String(task.status || "").trim() === "Completed").length,
    [tasks],
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "role") {
      return;
    }

    setFormUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditToggle = async () => {
    if (!isEditing) {
      setError("");
      setFormUser({
        name: user?.name || "",
        email: user?.email || "",
      });
      setIsEditing(true);
      return;
    }

    const nextName = String(formUser.name || "").trim();
    const nextEmail = String(formUser.email || "").trim();
    if (!nextName || !nextEmail) {
      setError("Name and email are required.");
      return;
    }

    const updatedUser = await updateCurrentUserProfile({
      name: nextName,
      email: nextEmail,
    });

    if (!updatedUser) {
      setError("Profile update failed. Please check your details.");
      return;
    }

    setError("");
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Profile
          </h1>
          <p className="text-textSecondary">
            Manage your account information
          </p>
        </div>

        <Button
          onClick={handleEditToggle}
          leftIcon={isEditing ? <Save size={16} /> : <Edit size={16} />}
        >
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-2xl font-bold">
            {(user?.name?.charAt(0) || "U").toUpperCase()}
          </div>

          <div className="w-full space-y-3">
            {error && (
              <p className="text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="flex items-center gap-2">
              <User size={16} />
              {isEditing ? (
                <Input
                  name="name"
                  value={formUser.name}
                  onChange={handleChange}
                  className="max-w-md"
                />
              ) : (
                <span>{user?.name || "User"}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Mail size={16} />
              {isEditing ? (
                <Input
                  name="email"
                  type="email"
                  value={formUser.email}
                  onChange={handleChange}
                  className="max-w-md"
                  disabled={isAdmin}
                />
              ) : (
                <span>{user?.email || "No email"}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>{user?.role || "-"}</span>
            </div>

            {isEditing && isAdmin && (
              <p className="text-xs text-textSecondary">
                Admin email cannot be changed from profile settings.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-textSecondary text-sm">
            Projects
          </p>
          <p className="text-2xl font-bold">
            {projects.length}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-textSecondary text-sm">
            Tasks
          </p>
          <p className="text-2xl font-bold">
            {tasks.length}
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-textSecondary text-sm">
            Completed
          </p>
          <p className="text-2xl font-bold">
            {completedCount}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
