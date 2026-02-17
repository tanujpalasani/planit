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
        fadeIn: "fadeIn 0.6s ease-in-out",
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
      },

    },
  },

  plugins: [],
};
