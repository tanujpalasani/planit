import {
  FolderKanban,
  CheckSquare,
  Clock,
  Activity
} from "lucide-react";

function DashboardHome() {

  const stats = [
    {
      title: "Total Projects",
      value: "12",
      icon: FolderKanban,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Total Tasks",
      value: "48",
      icon: CheckSquare,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "In Progress",
      value: "7",
      icon: Clock,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Completed",
      value: "32",
      icon: Activity,
      color: "from-green-500 to-emerald-500"
    }
  ];


  const recentProjects = [
    { name: "PlanIt SaaS Platform", tasks: 12 },
    { name: "Portfolio Website", tasks: 6 },
    { name: "Client Dashboard", tasks: 9 }
  ];


  const recentTasks = [
    { title: "Design dashboard UI", status: "In Progress" },
    { title: "Setup authentication", status: "Completed" },
    { title: "Create project API", status: "Todo" }
  ];


  return (
    <div className="space-y-8">


      {/* Heading */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back 👋
        </h1>

        <p className="text-textSecondary">
          Here's what's happening with your projects today.
        </p>
      </div>


      {/* Stats Cards */}
      <div className="
        grid grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-6
      ">

        {stats.map((stat, index) => {

          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="
                relative

                bg-white/5
                border border-white/10
                backdrop-blur-xl

                rounded-xl
                p-6

                hover:scale-[1.03]
                hover:border-white/20

                transition-all duration-300
              "
            >

              {/* Gradient glow */}
              <div className={`
                absolute inset-0
                bg-gradient-to-r ${stat.color}
                opacity-10 blur-xl
                rounded-xl
              `} />


              {/* Content */}
              <div className="relative z-10">

                <div className="
                  flex items-center justify-between
                  mb-4
                ">

                  <div className={`
                    p-2 rounded-lg
                    bg-gradient-to-r ${stat.color}
                  `}>
                    <Icon size={20} />
                  </div>

                  <span className="
                    text-2xl font-bold
                  ">
                    {stat.value}
                  </span>

                </div>


                <p className="text-textSecondary text-sm">
                  {stat.title}
                </p>

              </div>

            </div>
          );
        })}

      </div>


      {/* Bottom Sections */}
      <div className="
        grid grid-cols-1
        lg:grid-cols-2
        gap-6
      ">


        {/* Recent Projects */}
        <div className="
          bg-white/5
          border border-white/10
          backdrop-blur-xl

          rounded-xl
          p-6
        ">

          <h2 className="font-semibold mb-4">
            Recent Projects
          </h2>

          <div className="space-y-3">

            {recentProjects.map((project, index) => (

              <div
                key={index}
                className="
                  flex justify-between items-center

                  p-3 rounded-lg

                  hover:bg-white/5

                  transition-all
                "
              >

                <span>
                  {project.name}
                </span>

                <span className="text-textSecondary text-sm">
                  {project.tasks} tasks
                </span>

              </div>

            ))}

          </div>

        </div>



        {/* Recent Tasks */}
        <div className="
          bg-white/5
          border border-white/10
          backdrop-blur-xl

          rounded-xl
          p-6
        ">

          <h2 className="font-semibold mb-4">
            Recent Tasks
          </h2>

          <div className="space-y-3">

            {recentTasks.map((task, index) => (

              <div
                key={index}
                className="
                  flex justify-between items-center

                  p-3 rounded-lg

                  hover:bg-white/5

                  transition-all
                "
              >

                <span>
                  {task.title}
                </span>

                <span className="
                  text-xs
                  px-2 py-1
                  rounded

                  bg-gradient-primary
                ">
                  {task.status}
                </span>

              </div>

            ))}

          </div>

        </div>


      </div>


    </div>
  );
}

export default DashboardHome;
