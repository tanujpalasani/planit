import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">

      
      {/* ===== Animated Gradient Background ===== */}
      <div className="absolute inset-0 -z-10">

        {/* Main Glow */}
        <div className="
          absolute top-[-200px] left-1/2 -translate-x-1/2
          w-[800px] h-[800px]
          bg-gradient-primary
          opacity-20 blur-[140px]
          animate-pulse
        " />

        {/* Floating Orb 1 */}
        <div className="
          absolute top-[20%] left-[15%]
          w-[300px] h-[300px]
          bg-purple-500
          opacity-20 blur-[120px]
          rounded-full
          animate-float
        " />

        {/* Floating Orb 2 */}
        <div className="
          absolute bottom-[10%] right-[15%]
          w-[300px] h-[300px]
          bg-pink-500
          opacity-20 blur-[120px]
          rounded-full
          animate-float-delayed
        " />

      </div>


      {/* ===== Content ===== */}
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <h1 className="
          text-5xl md:text-6xl lg:text-7xl
          font-bold leading-tight
          tracking-tight
        ">

          <span className="
            text-white
            opacity-0 animate-fade-up
          ">
            Plan smarter.
          </span>

          <br />

          <span className="
            bg-gradient-primary
            bg-clip-text text-transparent

            opacity-0 animate-fade-up-delay
          ">
            Deliver faster.
          </span>

        </h1>


        {/* Subtext */}
        <p className="
          mt-6 text-lg md:text-xl
          text-textSecondary
          max-w-2xl mx-auto

          opacity-0 animate-fade-up-delay-2
        ">
          PlanIt helps teams manage projects, tasks, and collaboration
          in one powerful platform built for speed and clarity.
        </p>


        {/* Buttons */}
        <div className="
          mt-10 flex justify-center gap-4

          opacity-0 animate-fade-up-delay-3
        ">

          {/* Primary */}
          <Link
            to="/signup"
            className="
              relative px-8 py-3
              rounded-lg

              bg-gradient-primary
              text-white font-medium

              hover:scale-105
              hover:shadow-[0_0_30px_rgba(217,70,239,0.5)]

              transition-all duration-300
            "
          >
            Get Started Free
          </Link>


          {/* Secondary */}
          <Link
            to="/login"
            className="
              px-8 py-3 rounded-lg

              bg-white/5
              border border-white/10
              backdrop-blur-md

              hover:bg-white/10
              hover:scale-105

              transition-all duration-300
            "
          >
            Login
          </Link>

        </div>


        {/* Stats */}
        <div className="
          mt-20 flex justify-center gap-12

          opacity-0 animate-fade-up-delay-4
        ">

          <Stat number="10,000+" label="Tasks Managed" />
          <Stat number="2,000+" label="Projects Created" />
          <Stat number="500+" label="Active Users" />

        </div>

      </div>

    </section>
  );
}


function Stat({ number, label }) {
  return (
    <div className="text-center">
      <div className="
        text-3xl font-bold
        bg-gradient-primary
        bg-clip-text text-transparent
      ">
        {number}
      </div>

      <div className="text-textSecondary mt-1">
        {label}
      </div>
    </div>
  );
}

export default Hero;
