import { Link } from "react-router-dom";
import Logo from "/src/assets/logo/logo-light.svg";

function LandingNavbar() {
  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50

        backdrop-blur-xl
        bg-primary/60

        border-b border-white/10

        shadow-[0_0_20px_rgba(0,0,0,0.3)]
      "
    >
      {/* Gradient glow line */}
      <div className="h-[1px] w-full bg-gradient-primary opacity-40"></div>

      <div
        className="
          max-w-7xl mx-auto
          px-6 py-2

          flex items-center justify-between
        "
      >

        {/* Logo — exact SVG, no modification */}
        <Link
  to="/"
  className="
    flex items-center justify-start
    h-16
    -ml-2
  "
>
  <img
    src={Logo}
    alt="PlanIt Logo"
    className="
      w-52
      h-auto
      scale-150
      origin-left
      translate-y-[2px]
      object-contain
    "
  />
</Link>






        {/* Navigation */}
        <nav className="flex items-center gap-6">

          {/* Login */}
          <Link
            to="/login"
            className="
              text-textSecondary
              hover:text-white

              relative

              transition-all duration-300

              after:absolute after:left-0 after:-bottom-1
              after:h-[2px] after:w-0
              after:bg-gradient-primary

              hover:after:w-full
              after:transition-all after:duration-300
            "
          >
            Login
          </Link>


          {/* Get Started Button */}
          <Link
            to="/signup"
            className="
              px-6 py-2.5
              rounded-lg

              bg-gradient-primary
              text-white font-medium

              shadow-md

              hover:scale-105
              hover:shadow-glow

              transition-all duration-300
            "
          >
            Get Started
          </Link>

        </nav>

      </div>
    </header>
  );
}

export default LandingNavbar;
