import { Link } from "react-router-dom";
import Logo from "/src/assets/logo/logo-light.svg";
import { Mail, Lock } from "lucide-react";

function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">

      {/* Background glow */}
      <div className="absolute inset-0 -z-10">

        <div className="
          absolute top-[10%] left-[20%]
          w-[400px] h-[400px]
          bg-purple-600/30
          rounded-full blur-[120px]
          animate-blob
        " />

        <div className="
          absolute bottom-[10%] right-[20%]
          w-[400px] h-[400px]
          bg-pink-600/30
          rounded-full blur-[120px]
          animate-blob-delay-1
        " />

      </div>


      {/* Login card */}
      <div className="
        w-full max-w-md

        bg-white/5
        border border-white/10
        backdrop-blur-xl

        rounded-2xl
        p-8

        shadow-[0_0_40px_rgba(0,0,0,0.3)]
      ">

        {/* Logo */}
        <div className="flex justify-center mb-1">
          <img
            src={Logo}
            alt="PlanIt Logo"
            className="w-56 md:w-64 scale-110 origin-center object-contain"
          />
        </div>

        {/* Heading */}
        <h2 className="
          text-3xl font-bold text-center mb-2
          bg-gradient-primary bg-clip-text text-transparent
        ">
          Welcome back
        </h2>

        <p className="text-textSecondary text-center mb-6">
          Login to your PlanIt account
        </p>


        {/* Form */}
        <form className="space-y-4">

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

                focus:outline-none
                focus:border-purple-500
                focus:ring-1 focus:ring-purple-500

                transition-all
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

                focus:outline-none
                focus:border-purple-500
                focus:ring-1 focus:ring-purple-500

                transition-all
              "
            />

          </div>


          {/* Login button */}
          <button
            type="submit"
            className="
              w-full py-3

              bg-gradient-primary
              text-white font-medium

              rounded-lg

              hover:scale-[1.02]
              hover:shadow-lg

              transition-all duration-300
            "
          >
            Login
          </button>

        </form>


        {/* Signup link */}
        <p className="text-textSecondary text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="
              text-white
              hover:underline
            "
          >
            Sign up
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Login;
