import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function CTA() {
  return (
    <section className="relative py-24 overflow-hidden">

      {/* Animated gradient background */}
      <div className="
        absolute inset-0 -z-10
        bg-gradient-primary
        opacity-[0.08]
        animate-pulse
      " />



      {/* Container */}
      <div className="max-w-7xl mx-auto px-6">

        <div className="
          relative

          flex flex-col md:flex-row
          items-center justify-between

          gap-8

          bg-white/5
          border border-white/10
          backdrop-blur-lg

          rounded-2xl
          px-10 py-12

          hover:border-white/20

          transition-all duration-300
        ">


          {/* Left Content */}
          <div className="max-w-xl">

            <h2 className="
              text-3xl md:text-4xl font-bold
              mb-3
            ">
              Ready to manage projects{" "}
              <span className="
                bg-gradient-primary
                bg-clip-text text-transparent
              ">
                smarter?
              </span>
            </h2>


            <p className="text-textSecondary text-lg">
              Join thousands of teams using PlanIt to streamline workflows,
              boost productivity, and deliver faster.
            </p>

          </div>


          {/* Right Action */}
          <div className="flex items-center gap-4">

            <Link
              to="/signup"
              className="
                group

                flex items-center gap-2

                px-8 py-4
                rounded-lg

                bg-gradient-primary
                text-white font-medium

                hover:scale-105
                hover:shadow-lg

                transition-all duration-300
              "
            >
              Get Started Free

              <ArrowRight
                className="
                  group-hover:translate-x-1
                  transition-transform duration-300
                "
                size={18}
              />

            </Link>


            <Link
              to="/login"
              className="
                px-6 py-4

                text-textSecondary
                hover:text-white

                transition-colors duration-300
              "
            >
              Login
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default CTA;
