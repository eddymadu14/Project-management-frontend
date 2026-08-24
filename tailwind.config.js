/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        orbit: {
          bg: "#07111F",
          surface: "#0B1728",
          elevated: "#102238",

          cyan: "#67E8F9",
          "cyan-soft": "#22D3EE",

          violet: "#A78BFA",
          "violet-strong": "#8B5CF6",

          text: "#F8FAFC",
          "text-secondary": "#CBD5E1",
          muted: "#64748B",

          border: "#1E293B",
          "border-soft": "#FFFFFF14",

          success: "#34D399",
          warning: "#FBBF24",
          danger: "#FB7185",
          info: "#38BDF8",
        },
      },
    },
  },

  plugins: [],
};