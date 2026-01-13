
import React from "react";
import { motion } from "framer-motion";
import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Topbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`flex items-center justify-between px-6 py-4 shadow-sm sticky top-0 z-20 ${
        theme === "dark"
          ? "bg-gray-800 text-gray-100"
          : "bg-white text-gray-800"
      }`}
    >
      <button onClick={toggleSidebar} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl">
        <Menu size={20} />
      </button>

      <h2 className="text-xl font-semibold">Dashboard</h2>

      <button
        onClick={toggleTheme}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </motion.header>
  );
};

export default Topbar;
