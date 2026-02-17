import { useState } from "react";
import {
  User,
  Mail,
  Shield,
  Edit,
  Save
} from "lucide-react";

function Profile() {

  /* ---------------- User State ---------------- */

  const [isEditing, setIsEditing] = useState(false);

  const [user, setUser] = useState({
    name: "Tanu",
    email: "tanu@example.com",
    role: "Developer"
  });


  /* ---------------- Handle Change ---------------- */

  const handleChange = (e) => {

    setUser({
      ...user,
      [e.target.name]: e.target.value
    });

  };


  /* ---------------- Save ---------------- */

  const handleSave = () => {

    setIsEditing(false);

    // Later connect backend here

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
          onClick={() =>
            isEditing
              ? handleSave()
              : setIsEditing(true)
          }
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
            {user.name.charAt(0)}
          </div>


          {/* Info */}
          <div className="space-y-2">

            {/* Name */}
            <div className="flex items-center gap-2">

              <User size={16} />

              {isEditing ? (
                <input
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="
                    bg-white/5
                    border border-white/10

                    px-2 py-1

                    rounded
                  "
                />
              ) : (
                <span>{user.name}</span>
              )}

            </div>


            {/* Email */}
            <div className="flex items-center gap-2">

              <Mail size={16} />

              {isEditing ? (
                <input
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  className="
                    bg-white/5
                    border border-white/10

                    px-2 py-1

                    rounded
                  "
                />
              ) : (
                <span>{user.email}</span>
              )}

            </div>


            {/* Role */}
            <div className="flex items-center gap-2">

              <Shield size={16} />

              {isEditing ? (
                <input
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  className="
                    bg-white/5
                    border border-white/10

                    px-2 py-1

                    rounded
                  "
                />
              ) : (
                <span>{user.role}</span>
              )}

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
            3
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
            12
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
            5
          </p>

        </div>

      </div>


    </div>
  );

}

export default Profile;
