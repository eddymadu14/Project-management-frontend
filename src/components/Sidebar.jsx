
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { HomeIcon, FolderIcon, UsersIcon, SettingsIcon, MenuIcon, XIcon, LineChart, Folder, Workflow } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import classNames from "classnames";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { theme } = useTheme();

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const navItems = [
    { name: "Dashboard", icon: <HomeIcon />, path: "/dashboard" },
    { name: "Project Organizer", icon: <Workflow />, path: "/project-organizer" },
    { name: "Team Management", icon: <UsersIcon />, path: "/teammanagement" },
    { name: "Team", icon: <UsersIcon />, path: "/team" },
    { path: "/analytics", name: "Analytics", icon: <LineChart /> },
    { name: "Profile", icon: <FolderIcon />, path: "/profile" },
    { name: "Settings", icon: <SettingsIcon />, path: "/settings" }, 
    
    
  ];

  return (
    <motion.aside
      animate={{ width: isOpen ? 230 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={classNames(
        "h-screen flex flex-col border-r border-gray-200 dark:border-gray-800 transition-colors duration-300",
        theme === "dark" ? "bg-gray-900" : "bg-white"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-bold text-gray-800 dark:text-gray-100 overflow-hidden whitespace-nowrap"
        >
          {isOpen && ""}Task Orbit
        </motion.h1>

        <button
          onClick={toggleSidebar}
          className="p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          {isOpen ? <XIcon size={18} /> : <MenuIcon size={18} />}
        </button>
      </div>

      <nav className="flex-1 mt-4 space-y-1">
        {navItems.map(({ name, icon, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              classNames(
                "flex items-center mx-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              )
            }
          >
            <span className="mr-3">{icon}</span>
            {isOpen && name}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;
