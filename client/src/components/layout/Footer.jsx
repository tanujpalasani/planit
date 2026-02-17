import { Link } from "react-router-dom";
import Logo from "/src/assets/logo/logo-light.svg";
import {
  Github,
  Linkedin,
  Twitter
} from "lucide-react";

function Footer() {
  return (
    <footer className="relative border-t border-white/10 mt-24">

      {/* Background glow */}
      <div className="
        absolute inset-0 -z-10
        bg-gradient-primary
        opacity-[0.05]
        blur-[120px]
      " />


      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Top section */}
        <div className="
          flex flex-col md:flex-row
          justify-between items-start

          gap-10
        ">


          {/* Brand */}
          <div>

            <img
              src={Logo}
              alt="PlanIt Logo"
              className="
                w-36
                scale-125
                origin-left
                object-contain
                mb-4
              "
            />

            <p className="text-textSecondary max-w-sm">
              PlanIt is a modern project management platform
              designed to help teams plan smarter and deliver faster.
            </p>

          </div>


          {/* Links */}
          <div className="
            grid grid-cols-2 md:grid-cols-3
            gap-10
          ">

            {/* Product */}
            <div>
              <h4 className="font-semibold mb-3">
                Product
              </h4>

              <div className="flex flex-col gap-2 text-textSecondary">

                <Link
                  to="/"
                  className="hover:text-white transition-colors"
                >
                  Features
                </Link>

                <Link
                  to="/signup"
                  className="hover:text-white transition-colors"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="hover:text-white transition-colors"
                >
                  Login
                </Link>

              </div>
            </div>


            {/* Company */}
            <div>
              <h4 className="font-semibold mb-3">
                Company
              </h4>

              <div className="flex flex-col gap-2 text-textSecondary">

                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  About
                </a>

                <a
                  href="#"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>

              </div>
            </div>


            {/* Social */}
            <div>
              <h4 className="font-semibold mb-3">
                Social
              </h4>

              <div className="flex gap-4 text-textSecondary">

                <a
                  href="#"
                  className="
                    hover:text-white
                    hover:scale-110
                    transition-all
                  "
                >
                  <Github />
                </a>

                <a
                  href="#"
                  className="
                    hover:text-white
                    hover:scale-110
                    transition-all
                  "
                >
                  <Linkedin />
                </a>

                <a
                  href="#"
                  className="
                    hover:text-white
                    hover:scale-110
                    transition-all
                  "
                >
                  <Twitter />
                </a>

              </div>
            </div>

          </div>

        </div>


        {/* Bottom section */}
        <div className="
          border-t border-white/10
          mt-10 pt-6

          flex flex-col md:flex-row
          justify-between items-center

          gap-4
        ">

          <p className="text-textSecondary text-sm">
            © 2026 PlanIt. All rights reserved.
          </p>


          <p className="text-textSecondary text-sm">
            Built with React, Tailwind, and MERN stack.
          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;
