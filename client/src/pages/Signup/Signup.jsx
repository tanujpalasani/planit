import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import Logo from "/src/assets/logo/logo-light.svg";
import { useAppContext } from "../../context/useAppContext";
import { useState } from "react";
import { Button, Input } from "../../components/ui";

function Signup() {
  const { registerAdminAccount } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignup = (event) => {
    event.preventDefault();
    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const adminUser = registerAdminAccount({ name, email, password });

    if (!adminUser) {
      setError("Could not create account. Try again.");
      return;
    }

    navigate("/admin");
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
          Create account
        </h2>

        <p className="text-textSecondary text-center mb-6">
          Start managing your projects with PlanIt
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-400 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <Input
            type="text"
            name="name"
            label="Full Name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            leftIcon={<User size={18} />}
          />

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

          <Input
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
            leftIcon={<Lock size={18} />}
          />

          <Button type="submit" className="w-full">
            Create Account
          </Button>
        </form>

        <p className="text-textSecondary text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
