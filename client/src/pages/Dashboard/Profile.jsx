import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Edit,
  Save
} from "lucide-react";
import { useAppContext } from "../../context/useAppContext";

function Profile() {
  const { user, setUser, setTeamMembers, projects, tasks } = useAppContext();

  /* ---------------- User State ---------------- */

  const [isEditing, setIsEditing] = useState(false);
  const [formUser, setFormUser] = useState(user || {});


  /* ---------------- Handle Change ---------------- */

  const handleChange = (e) => {
    if (e.target.name === "role") {
      return;
    }
    setFormUser({
      ...formUser,
      [e.target.name]: e.target.value
    });

  };


  /* ---------------- Save ---------------- */

  const handleSave = () => {
    const nextUser = {
      ...user,
      ...formUser,
      role: user?.role || "Admin"
    };

    setUser(nextUser);
    setTeamMembers((prevMembers) =>
      prevMembers.map((member) => {
        const isTargetMember = (
          String(member.id) === String(user?.id) ||
          member.email.trim().toLowerCase() === String(user?.email || "").trim().toLowerCase()
        );

        if (!isTargetMember) {
          return member;
        }

        return {
          ...member,
          name: nextUser.name,
          email: nextUser.email,
        };
      }),
    );

    setIsEditing(false);

  };


  return (
    <div className="space-y-8">


      {/* Header */}
      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Profile
          </h1>

          <p className="text-textSecondary">
            Manage your account information
          </p>

        </div>


        {/* Edit / Save Button */}
        <button
          onClick={() => {
            if (isEditing) {
              handleSave();
              return;
            }

            setFormUser(user || {});
            setIsEditing(true);
          }}
          className="
            flex items-center gap-2

            px-4 py-2

            bg-gradient-primary

            rounded-lg

            hover:scale-105

            transition
          "
        >

          {isEditing
            ? <Save size={16} />
            : <Edit size={16} />
          }

          {isEditing
            ? "Save"
            : "Edit"
          }

        </button>

      </div>



      {/* Profile Card */}
      <div
        className="
          bg-white/5
          border border-white/10

          rounded-xl

          p-6

          backdrop-blur-xl
        "
      >

        <div className="flex items-center gap-6">


          {/* Avatar */}
          <div
            className="
              w-20 h-20

              bg-gradient-primary

              rounded-full

              flex items-center justify-center

              text-2xl font-bold
            "
          >
            {(user?.name?.charAt(0) || "U").toUpperCase()}
          </div>


          {/* Info */}
          <div className="space-y-2">

            {/* Name */}
            <div className="flex items-center gap-2">

              <User size={16} />

              {isEditing ? (
                <input
                  name="name"
                  value={formUser.name || ""}
                  onChange={handleChange}
                  className="
                    bg-white/5
                    border border-white/10

                    px-2 py-1

                    rounded
                  "
                />
              ) : (
                <span>{user?.name || "User"}</span>
              )}

            </div>


            {/* Email */}
            <div className="flex items-center gap-2">

              <Mail size={16} />

              {isEditing ? (
                <input
                  name="email"
                  value={formUser.email || ""}
                  onChange={handleChange}
                  className="
                    bg-white/5
                    border border-white/10

                    px-2 py-1

                    rounded
                  "
                />
              ) : (
                <span>{user?.email || "No email"}</span>
              )}

            </div>


            {/* Role */}
            <div className="flex items-center gap-2">

              <Shield size={16} />

              <span>{user?.role || "-"}</span>

            </div>

          </div>

        </div>

      </div>



      {/* Account Stats */}
      <div
        className="
          grid grid-cols-1
          md:grid-cols-3
          gap-6
        "
      >

        <div className="
          bg-white/5
          border border-white/10

          rounded-xl
          p-6
        ">

          <p className="text-textSecondary text-sm">
            Projects
          </p>

          <p className="text-2xl font-bold">
            {projects.length}
          </p>

        </div>


        <div className="
          bg-white/5
          border border-white/10

          rounded-xl
          p-6
        ">

          <p className="text-textSecondary text-sm">
            Tasks
          </p>

          <p className="text-2xl font-bold">
            {tasks.length}
          </p>

        </div>


        <div className="
          bg-white/5
          border border-white/10

          rounded-xl
          p-6
        ">

          <p className="text-textSecondary text-sm">
            Completed
          </p>

          <p className="text-2xl font-bold">
            {tasks.filter((task) => task.status === "Completed").length}
          </p>

        </div>

      </div>


    </div>
  );

}

export default Profile;
