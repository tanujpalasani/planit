export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  theme: {
    extend: {

      colors: {
        primary: "#0B0F17",
        secondary: "#111827",
        tertiary: "#1F2937",
        textPrimary: "#FFFFFF",
        textSecondary: "#9CA3AF",
        borderPrimary: "#1F2937",
      },

      backgroundImage: {
        "gradient-primary":
          "linear-gradient(135deg, #3B82F6 0%, #6366F1 16%, #8B5CF6 32%, #D946EF 52%, #EC4899 72%, #F97316 100%)",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },

      boxShadow: {
        glow: "0 0 20px rgba(139, 92, 246, 0.4)",
      },

      animation: {
        fadeIn: "fadeIn 0.6s ease-in-out forwards",
        "fade-up": "fadeUp 0.8s ease-out forwards",
        "fade-up-delay": "fadeUp 0.8s ease-out 0.2s forwards",
        "fade-up-delay-2": "fadeUp 0.8s ease-out 0.4s forwards",
        "fade-up-delay-3": "fadeUp 0.8s ease-out 0.6s forwards",
        "fade-up-delay-4": "fadeUp 0.8s ease-out 0.8s forwards",
        "float": "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 3s infinite",
        "blob": "blob 7s infinite",
        "blob-delay-1": "blob 7s 2s infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },

      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        fadeUp: {
          "0%": {
            opacity: "0 !important",
            transform: "translate3d(0, 40px, 0)",
          },
          "100%": {
            opacity: "1 !important",
            transform: "translate3d(0, 0, 0)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translate3d(0, 0, 0)",
          },
          "50%": {
            transform: "translate3d(0, -30px, 0)",
          },
        },
        blob: {
          "0%, 100%": {
            transform: "translate(0, 0) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
        },
        glow: {
          "from": {
            opacity: "0.4",
          },
          "to": {
            opacity: "0.8",
          },
        },
      },

    },
  },

  plugins: [],
};
