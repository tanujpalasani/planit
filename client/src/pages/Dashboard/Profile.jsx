function Profile() {

  const user = {
    name: "Tanu",
    email: "tanu@example.com",
    role: "Frontend Developer"
  };


  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Profile
        </h1>

        <p className="text-textSecondary">
          Manage your account information
        </p>
      </div>


      {/* Profile Card */}
      <div className="
        max-w-md

        bg-white/5
        border border-white/10
        backdrop-blur-xl

        rounded-xl
        p-6
      ">

        <div className="space-y-4">

          <div>
            <p className="text-textSecondary text-sm">
              Name
            </p>

            <p className="font-medium">
              {user.name}
            </p>
          </div>


          <div>
            <p className="text-textSecondary text-sm">
              Email
            </p>

            <p className="font-medium">
              {user.email}
            </p>
          </div>


          <div>
            <p className="text-textSecondary text-sm">
              Role
            </p>

            <p className="font-medium">
              {user.role}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Profile;
