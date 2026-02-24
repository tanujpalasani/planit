import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import Logo from "/src/assets/logo/logo-light.svg";
import { useAppContext } from "../../context/useAppContext";
import { useState } from "react";
import { Button, Input } from "../../components/ui";

function Login() {
  const { authenticateUser } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    const authenticatedUser = await authenticateUser(email, password);

    if (!authenticatedUser) {
      setError("Invalid email or password.");
      return;
    }

    navigate(authenticatedUser.role === "Admin" ? "/admin" : "/member");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
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

      <div className="
        w-full max-w-md
        bg-white/5
        border border-white/10
        backdrop-blur-xl
        rounded-2xl
        p-8
        shadow-[0_0_40px_rgba(0,0,0,0.3)]
      ">
        <div className="flex justify-center mb-1">
          <img
            src={Logo}
            alt="PlanIt Logo"
            className="w-56 md:w-64 scale-110 origin-center object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold text-center mb-2 bg-gradient-primary bg-clip-text text-transparent">
          Welcome back
        </h2>

        <p className="text-textSecondary text-center mb-6">
          Login to your PlanIt account
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            name="email"
            label="Email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            leftIcon={<Mail size={18} />}
          />

          <Input
            type="password"
            name="password"
            label="Password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            leftIcon={<Lock size={18} />}
          />

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>

        <p className="text-textSecondary text-center mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
