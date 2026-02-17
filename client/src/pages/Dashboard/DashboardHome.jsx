import {
  FolderKanban,
  CheckCircle2,
  Clock,
  ListTodo
} from "lucide-react";

import TaskCard from "../../components/dashboard/task/TaskCard";

function DashboardHome() {

  /* ---------------- Stats Data ---------------- */

  const stats = [
    {
      title: "Total Projects",
      value: 3,
      icon: FolderKanban,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Total Tasks",
      value: 12,
      icon: ListTodo,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Completed Tasks",
      value: 5,
      icon: CheckCircle2,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "In Progress",
      value: 4,
      icon: Clock,
      color: "from-orange-500 to-red-500"
    }
  ];


  /* ---------------- Recent Tasks ---------------- */

  const recentTasks = [
    {
      id: 1,
      title: "Design dashboard UI",
      status: "In Progress",
      priority: "High",
      assignees: ["Tanu"],
      subtasks: ["Layout", "Components"]
    },
    {
      id: 2,
      title: "Setup backend",
      status: "Todo",
      priority: "Medium",
      assignees: ["Tanu"],
      subtasks: []
    }
  ];


  /* ---------------- Recent Projects ---------------- */

  const recentProjects = [
    {
      id: 1,
      name: "PlanIt SaaS Platform",
      tasks: 12
    },
    {
      id: 2,
      name: "Portfolio Website",
      tasks: 6
    }
  ];


  return (
    <div className="space-y-8">


      {/* Welcome Section */}
      <div>

        <h1 className="text-3xl font-bold">
          Welcome back, Tanu 👋
        </h1>

        <p className="text-textSecondary">
          Here's what's happening today.
        </p>

      </div>



      {/* Stats Grid */}
      <div
        className="
          grid grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
        "
      >

        {stats.map((stat, index) => {

          const Icon = stat.icon;

          const gradientMap = {
            "from-purple-500 to-pink-500": "linear-gradient(to right, rgb(168, 85, 247), rgb(236, 72, 153))",
            "from-blue-500 to-indigo-500": "linear-gradient(to right, rgb(59, 130, 246), rgb(99, 102, 241))",
            "from-green-500 to-emerald-500": "linear-gradient(to right, rgb(34, 197, 94), rgb(16, 185, 129))",
            "from-orange-500 to-red-500": "linear-gradient(to right, rgb(249, 115, 22), rgb(239, 68, 68))"
          };

          return (
            <div
              key={index}
              className="
                relative

                bg-white/5
                border border-white/10

                rounded-xl
                p-6

                hover:bg-white/10

                transition
              "
            >

              {/* Glow */}
              <div
                style={{
                  background: gradientMap[stat.color] || "transparent"
                }}
                className="
                  absolute inset-0
                  opacity-10 blur-xl
                  rounded-xl
                "
              />


              {/* Content */}
              <div className="relative z-10">

                <div className="flex justify-between items-center mb-4">

                  <Icon size={20} />

                  <span className="text-2xl font-bold">
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



      {/* Bottom Grid */}
      <div
        className="
          grid grid-cols-1
          lg:grid-cols-2
          gap-6
        "
      >

        {/* Recent Tasks */}
        <div
          className="
            bg-white/5
            border border-white/10

            rounded-xl
            p-6

            space-y-4
          "
        >

          <h2 className="font-semibold">
            Recent Tasks
          </h2>


          {recentTasks.map(task => (

            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={() => {}}
              onDelete={() => {}}
            />

          ))}

        </div>



        {/* Recent Projects */}
        <div
          className="
            bg-white/5
            border border-white/10

            rounded-xl
            p-6
          "
        >

          <h2 className="font-semibold mb-4">
            Recent Projects
          </h2>


          <div className="space-y-3">

            {recentProjects.map(project => (

              <div
                key={project.id}
                className="
                  flex justify-between

                  bg-white/5

                  px-4 py-3

                  rounded-lg

                  hover:bg-white/10

                  transition
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

      </div>


    </div>
  );

}

export default DashboardHome;
