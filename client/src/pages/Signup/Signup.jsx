import { Link } from "react-router-dom";
import Logo from "/src/assets/logo/logo-light.svg";
import { User, Mail, Lock } from "lucide-react";

function Signup() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">

      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">

        <div
          className="
            absolute top-[10%] left-[20%]
            w-[400px] h-[400px]
            bg-purple-600/30
            rounded-full blur-[120px]
            animate-blob
          "
        />

        <div
          className="
            absolute bottom-[10%] right-[20%]
            w-[400px] h-[400px]
            bg-pink-600/30
            rounded-full blur-[120px]
            animate-blob-delay-1
          "
        />

      </div>


      {/* Signup Card */}
      <div
        className="
          w-full max-w-md

          bg-white/5
          border border-white/10
          backdrop-blur-xl

          rounded-2xl
          p-7

          shadow-[0_0_40px_rgba(0,0,0,0.3)]

          transition-all duration-500
          hover:shadow-[0_0_60px_rgba(139,92,246,0.25)]
        "
      >

        {/* Logo */}
        <div className="flex justify-center mb-0">
          <img
            src={Logo}
            alt="PlanIt Logo"
            className="
              w-56 md:w-64
              h-auto
              scale-100
              origin-center
              object-contain
              select-none
            "
          />
        </div>


        {/* Heading */}
        <h2
          className="
            text-3xl font-bold text-center mb-1

            bg-gradient-primary
            bg-clip-text
            text-transparent
          "
        >
          Create account
        </h2>


        {/* Subheading */}
        <p className="text-textSecondary text-center mb-6">
          Start managing your projects with PlanIt
        </p>


        {/* Form */}
        <form className="space-y-4">

          {/* Name */}
          <div className="relative">

            <User
              size={18}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                text-textSecondary
              "
            />

            <input
              type="text"
              placeholder="Full name"
              className="
                w-full
                pl-10 pr-4 py-3

                bg-white/5
                border border-white/10
                rounded-lg

                text-white
                placeholder:text-textSecondary

                focus:outline-none
                focus:border-purple-500
                focus:ring-1 focus:ring-purple-500

                transition-all duration-300
              "
            />

          </div>


          {/* Email */}
          <div className="relative">

            <Mail
              size={18}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                text-textSecondary
              "
            />

            <input
              type="email"
              placeholder="Email address"
              className="
                w-full
                pl-10 pr-4 py-3

                bg-white/5
                border border-white/10
                rounded-lg

                text-white
                placeholder:text-textSecondary

                focus:outline-none
                focus:border-purple-500
                focus:ring-1 focus:ring-purple-500

                transition-all duration-300
              "
            />

          </div>


          {/* Password */}
          <div className="relative">

            <Lock
              size={18}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                text-textSecondary
              "
            />

            <input
              type="password"
              placeholder="Password"
              className="
                w-full
                pl-10 pr-4 py-3

                bg-white/5
                border border-white/10
                rounded-lg

                text-white
                placeholder:text-textSecondary

                focus:outline-none
                focus:border-purple-500
                focus:ring-1 focus:ring-purple-500

                transition-all duration-300
              "
            />

          </div>


          {/* Confirm Password */}
          <div className="relative">

            <Lock
              size={18}
              className="
                absolute left-3 top-1/2 -translate-y-1/2
                text-textSecondary
              "
            />

            <input
              type="password"
              placeholder="Confirm password"
              className="
                w-full
                pl-10 pr-4 py-3

                bg-white/5
                border border-white/10
                rounded-lg

                text-white
                placeholder:text-textSecondary

                focus:outline-none
                focus:border-purple-500
                focus:ring-1 focus:ring-purple-500

                transition-all duration-300
              "
            />

          </div>


          {/* Signup Button */}
          <button
            type="submit"
            className="
              w-full py-3

              bg-gradient-primary
              text-white font-medium

              rounded-lg

              shadow-md

              hover:scale-[1.02]
              hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]

              active:scale-[0.99]

              transition-all duration-300
            "
          >
            Create Account
          </button>

        </form>


        {/* Login Link */}
        <p className="text-textSecondary text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="
              text-white
              hover:text-purple-400
              transition-colors duration-300
            "
          >
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Signup;
