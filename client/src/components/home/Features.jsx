import {
  CheckSquare,
  BarChart3,
  Users,
  Zap
} from "lucide-react";


function Features() {

  const features = [
    {
      title: "Task Management",
      description:
        "Create, organize, and track tasks with powerful productivity tools.",
      icon: CheckSquare,
    },
    {
      title: "Project Tracking",
      description:
        "Monitor project progress with real-time insights and timelines.",
      icon: BarChart3,
    },
    {
      title: "Team Collaboration",
      description:
        "Collaborate seamlessly with your team in shared workspaces.",
      icon: Users,
    },
    {
      title: "Analytics Dashboard",
      description:
        "Gain performance insights with powerful analytics tools.",
      icon: Zap,
    },
  ];


  return (
    <section className="relative py-24">

      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="
          absolute top-20 left-1/2 -translate-x-1/2
          w-[600px] h-[600px]
          bg-gradient-primary
          opacity-10 blur-[120px]
        " />
      </div>


      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">

          <h2 className="
            text-4xl md:text-5xl font-bold
            bg-gradient-primary bg-clip-text text-transparent
          ">
            Powerful Features
          </h2>

          <p className="mt-4 text-textSecondary">
            Everything you need to manage projects efficiently.
          </p>

        </div>


        {/* Grid */}
        <div className="
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4
          gap-8
        ">

          {features.map((feature) => {

            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="
                  group

                  bg-white/5
                  border border-white/10
                  backdrop-blur-md

                  rounded-xl
                  p-6

                  hover:scale-105
                  hover:border-white/20
                  hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]

                  transition-all duration-300
                "
              >

                {/* Icon */}
                <div className="
                  w-12 h-12
                  flex items-center justify-center

                  rounded-lg

                  bg-gradient-primary
                  text-white

                  mb-4

                  group-hover:scale-110
                  transition-all duration-300
                ">
                  <Icon size={24} />
                </div>


                {/* Title */}
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>


                {/* Description */}
                <p className="text-textSecondary">
                  {feature.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>

    </section>
  );
}

export default Features;
