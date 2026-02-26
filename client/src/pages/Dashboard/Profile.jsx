import { useMemo, useState } from "react";
import { User, Mail, Shield, Clock, Save, KeyRound, AlertTriangle, Trash2 } from "lucide-react";
import { useAppContext } from "../../context/useAppContext";
import { Button, Input, Modal } from "../../components/ui";
import useAsyncAction from "../../hooks/useAsyncAction";

function Profile() {
  const { user, updateCurrentUserProfile, deleteCurrentAccount, projects, tasks } = useAppContext();
  const { runAsync } = useAsyncAction();
  const isAdmin = user?.role === "Admin";
  const [detailsForm, setDetailsForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [detailsError, setDetailsError] = useState("");
  const [securityError, setSecurityError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteForm, setDeleteForm] = useState({
    confirmationText: "",
    currentPassword: "",
  });
  const [deleteError, setDeleteError] = useState("");

  const completedCount = useMemo(
    () => tasks.filter((task) => String(task.status || "").trim() === "Completed").length,
    [tasks],
  );
  const pendingCount = tasks.length - completedCount;
  const joinedOn = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "N/A";
  const updatedOn = user?.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString()
    : "N/A";

  const handleDetailsChange = (event) => {
    const { name, value } = event.target;

    setDetailsForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSecurityChange = (event) => {
    const { name, value } = event.target;
    setSecurityForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDetailsSubmit = async (event) => {
    event.preventDefault();
    setDetailsError("");
    const nextName = String(detailsForm.name || "").trim();
    const nextEmail = String(detailsForm.email || "").trim();
    if (!nextName || !nextEmail) {
      setDetailsError("Name and email are required.");
      return;
    }

    const updatedUser = await runAsync(async () => updateCurrentUserProfile({
      name: nextName,
      email: nextEmail,
    }));

    if (!updatedUser) {
      setDetailsError("Profile update failed. Please check your details.");
      return;
    }

    setDetailsForm({
      name: updatedUser.name || "",
      email: updatedUser.email || "",
    });
  };

  const handleSecuritySubmit = async (event) => {
    event.preventDefault();
    setSecurityError("");
    const currentPassword = String(securityForm.currentPassword || "");
    const newPassword = String(securityForm.newPassword || "");
    const confirmPassword = String(securityForm.confirmPassword || "");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setSecurityError("All password fields are required.");
      return;
    }
    if (newPassword.length < 6) {
      setSecurityError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setSecurityError("New password and confirm password do not match.");
      return;
    }

    const updatedUser = await runAsync(async () => updateCurrentUserProfile({
      currentPassword,
      newPassword,
    }));
    if (!updatedUser) {
      setSecurityError("Password update failed. Check current password.");
      return;
    }

    setSecurityForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleDeleteWorkspace = async () => {
    setDeleteError("");
    const expected = "DELETE MY WORKSPACE";
    if (deleteForm.confirmationText.trim() !== expected) {
      setDeleteError(`Type "${expected}" to confirm.`);
      return;
    }
    if (!deleteForm.currentPassword) {
      setDeleteError("Current password is required.");
      return;
    }

    const deleted = await runAsync(async () =>
      deleteCurrentAccount(deleteForm.currentPassword)
    );
    if (!deleted) {
      setDeleteError("Account deletion failed.");
      return;
    }

    setIsDeleteModalOpen(false);
    setDeleteForm({ confirmationText: "", currentPassword: "" });
  };

  return (
    <div className="space-y-8">
      <div>
        <div>
          <h1 className="text-3xl font-bold">
            Profile
          </h1>
          <p className="text-textSecondary">
            Manage your account details and security
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form
          onSubmit={handleDetailsSubmit}
          className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl space-y-5"
        >
          <div className="flex items-center gap-3">
            <User size={18} className="text-white" />
            <h2 className="text-lg font-semibold text-white">
              Account Details
            </h2>
          </div>

          {detailsError && (
            <p className="text-sm text-red-300">
              {detailsError}
            </p>
          )}

          <Input
            label="Full Name"
            name="name"
            value={detailsForm.name}
            onChange={handleDetailsChange}
            leftIcon={<User size={16} />}
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={detailsForm.email}
            onChange={handleDetailsChange}
            leftIcon={<Mail size={16} />}
          />

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex items-center gap-2 text-textSecondary text-sm">
              <Shield size={16} />
              Role
            </div>
            <span className="rounded-full bg-gradient-primary px-2.5 py-1 text-xs font-medium text-white">
              {user?.role || "-"}
            </span>
          </div>

          <Button type="submit" leftIcon={<Save size={16} />}>
            Save Account Details
          </Button>
        </form>

        <form
          onSubmit={handleSecuritySubmit}
          className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl space-y-5"
        >
          <div className="flex items-center gap-3">
            <KeyRound size={18} className="text-white" />
            <h2 className="text-lg font-semibold text-white">
              Security
            </h2>
          </div>

          {securityError && (
            <p className="text-sm text-red-300">
              {securityError}
            </p>
          )}

          <Input
            label="Current Password"
            type="password"
            name="currentPassword"
            value={securityForm.currentPassword}
            onChange={handleSecurityChange}
          />

          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={securityForm.newPassword}
            onChange={handleSecurityChange}
          />

          <Input
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={securityForm.confirmPassword}
            onChange={handleSecurityChange}
          />

          <Button type="submit" variant="secondary" leftIcon={<KeyRound size={16} />}>
            Update Password
          </Button>
        </form>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center text-2xl font-bold">
            {(user?.name?.charAt(0) || "U").toUpperCase()}
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2 text-sm text-textSecondary">
              <User size={16} />
              <span>{user?.name || "User"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-textSecondary">
              <Mail size={16} />
              <span>{user?.email || "No email"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-textSecondary">
              <Shield size={16} />
              <span>{user?.role || "-"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-textSecondary">
              <Clock size={16} />
              <span>Joined {joinedOn}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-textSecondary sm:col-span-2">
              <Clock size={16} />
              <span>Last updated {updatedOn}</span>
            </div>
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

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <p className="text-textSecondary text-sm">
            Pending
          </p>
          <p className="text-2xl font-bold">
            {pendingCount}
          </p>
        </div>
      </div>

      {isAdmin && (
        <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-red-200">
                <AlertTriangle size={16} />
                <p className="text-sm font-semibold">
                  Danger Zone
                </p>
              </div>
              <p className="mt-2 text-sm text-red-100/90">
                Deleting admin account permanently removes your entire workspace: all team members, projects, and tasks.
              </p>
            </div>

            <Button
              variant="danger"
              leftIcon={<Trash2 size={16} />}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Admin Account
            </Button>
          </div>
        </div>
      )}

      {isAdmin && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Admin Account"
          size="md"
          footer={
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDeleteWorkspace}>
                Delete Permanently
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-sm text-red-200">
              This action is irreversible and will delete your entire workspace data.
            </p>

            {deleteError && (
              <p className="text-sm text-red-300">
                {deleteError}
              </p>
            )}

            <Input
              label='Type "DELETE MY WORKSPACE" to confirm'
              value={deleteForm.confirmationText}
              onChange={(event) =>
                setDeleteForm((prev) => ({ ...prev, confirmationText: event.target.value }))
              }
            />

            <Input
              label="Current Password"
              type="password"
              value={deleteForm.currentPassword}
              onChange={(event) =>
                setDeleteForm((prev) => ({ ...prev, currentPassword: event.target.value }))
              }
            />
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Profile;
