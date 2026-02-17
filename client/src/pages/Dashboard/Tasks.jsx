import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

function Tasks() {

  const tasks = [
    {
      id: 1,
      title: "Design landing page",
      project: "PlanIt SaaS Platform",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Setup backend API",
      project: "Client Dashboard",
      status: "Todo"
    },
    {
      id: 3,
      title: "Fix login bugs",
      project: "Portfolio Website",
      status: "Completed"
    }
  ];


  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle2 size={18} className="text-green-400" />;
      case "In Progress":
        return <Clock size={18} className="text-orange-400" />;
      default:
        return <AlertCircle size={18} className="text-purple-400" />;
    }
  };


  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Tasks
        </h1>

        <p className="text-textSecondary">
          View and manage all your tasks
        </p>
      </div>


      {/* Tasks List */}
      <div className="
        bg-white/5
        border border-white/10
        backdrop-blur-xl
        rounded-xl
        p-6
      ">

        <div className="space-y-3">

          {tasks.map((task) => (

            <div
              key={task.id}
              className="
                flex justify-between items-center

                p-4 rounded-lg

                bg-white/5
                hover:bg-white/10

                transition-all
              "
            >

              <div className="flex items-center gap-3">

                {getStatusIcon(task.status)}

                <div>
                  <p>{task.title}</p>

                  <p className="text-sm text-textSecondary">
                    {task.project}
                  </p>
                </div>

              </div>


              <span className="
                text-xs px-3 py-1 rounded
                bg-gradient-primary
              ">
                {task.status}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Tasks;
