import React from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  UsersIcon,
  SettingsIcon,
  MenuIcon,
  XIcon,
  LineChart,
  Folder,
  Workflow,
} from "lucide-react";
import classNames from "classnames";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    {
      name: "Dashboard",
      icon: <HomeIcon size={18} />,
      path: "/dashboard",
    },
    {
      name: "Project Organizer",
      icon: <Workflow size={18} />,
      path: "/project-organizer",
    },
    {
      name: "Team Management",
      icon: <UsersIcon size={18} />,
      path: "/teammanagement",
    },
    {
      name: "Team",
      icon: <UsersIcon size={18} />,
      path: "/team",
    },
    {
      name: "Analytics",
      icon: <LineChart size={18} />,
      path: "/analytics",
    },
    {
      name: "Profile",
      icon: <Folder size={18} />,
      path: "/profile",
    },
    {
      name: "Settings",
      icon: <SettingsIcon size={18} />,
      path: "/settings",
    },
  ];

  return (
    <motion.aside
      animate={{
        width: isOpen ? 230 : 80,
      }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      className="
        sticky
        top-0
        flex
        h-screen
        shrink-0
        flex-col
        border-r
        border-orbit-border-soft
        bg-orbit-surface
      "
    >
      {/* Brand */}
      <div
        className="
          flex
          h-16
          items-center
          justify-between
          border-b
          border-orbit-border-soft
          px-4
        "
      >
        {isOpen && (
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="whitespace-nowrap text-lg font-bold text-orbit-text"
          >
            Task <span className="text-orbit-cyan">Orbit</span>
          </motion.h1>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          className="
            rounded-lg
            p-2
            text-orbit-muted
            transition
            hover:bg-orbit-elevated
            hover:text-orbit-text
          "
        >
          {isOpen ? (
            <XIcon size={18} />
          ) : (
            <MenuIcon size={18} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ name, icon, path }) => (
          <NavLink
            key={path}
            to={path}
            end={path === "/dashboard"}
            className={({ isActive }) =>
              classNames(
                `
                  flex
                  items-center
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                `,
                isActive
                  ? `
                    border
                    border-orbit-cyan/10
                    bg-orbit-cyan/10
                    text-orbit-cyan
                  `
                  : `
                    text-orbit-muted
                    hover:bg-orbit-elevated
                    hover:text-orbit-text
                  `
              )
            }
          >
            <span
              className={classNames(
                "flex shrink-0 items-center justify-center",
                isOpen && "mr-3"
              )}
            >
              {icon}
            </span>

            {isOpen && (
              <span className="truncate">
                {name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
};

export default Sidebar;