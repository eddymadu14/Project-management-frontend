import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  Menu,
  Moon,
  Search,
  Sun,
  UserCircle,
  LogOut,
  Settings,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const pageMeta = {
  "/dashboard": {
    title: "Dashboard",
    description: "Your workspace at a glance",
  },
  "/project-organizer": {
    title: "Project Organizer",
    description: "Plan, assign and track project work",
  },
  "/teammanagement": {
    title: "Team Management",
    description: "Build and manage your project teams",
  },
  "/team": {
    title: "Team",
    description: "People working across your workspace",
  },
  "/analytics": {
    title: "Analytics",
    description: "Understand project and team performance",
  },
  "/profile": {
    title: "Profile",
    description: "Manage your personal information",
  },
  "/settings": {
    title: "Settings",
    description: "Control your workspace preferences",
  },
};

const getInitials = (user) => {
  const name =
    user?.name ||
    user?.username ||
    user?.email?.split("@")[0] ||
    "User";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

export default function Topbar({ toggleSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const meta = useMemo(() => {
    const pathname = location.pathname;

    if (pageMeta[pathname]) return pageMeta[pathname];

    if (pathname.startsWith("/project-organizer/")) {
      return pageMeta["/project-organizer"];
    }

    return {
      title: "Task Orbit",
      description: "Project management workspace",
    };
  }, [location.pathname]);

  const initials = getInitials(user);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="
        sticky top-0 z-40
        flex min-h-[76px] items-center
        border-b border-orbit-border-soft
        bg-orbit-surface/95
        px-4 sm:px-6 lg:px-8
        backdrop-blur-xl
      "
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Open navigation"
          className="
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-xl border border-orbit-border-soft
            bg-orbit-elevated text-orbit-muted
            transition hover:border-orbit-cyan/30
            hover:text-orbit-cyan
            lg:hidden
          "
        >
          <Menu size={19} />
        </button>

        <div className="min-w-0">
          <h1 className="truncate text-base font-bold text-orbit-text sm:text-lg">
            {meta.title}
          </h1>

          <p className="hidden truncate text-xs text-orbit-muted sm:block">
            {meta.description}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          aria-label="Search"
          className="
            hidden h-10 w-10 items-center justify-center
            rounded-xl border border-orbit-border-soft
            bg-orbit-elevated text-orbit-muted
            transition hover:text-orbit-cyan
            md:flex
          "
        >
          <Search size={17} />
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="
            relative flex h-10 w-10 items-center justify-center
            rounded-xl border border-orbit-border-soft
            bg-orbit-elevated text-orbit-muted
            transition hover:text-orbit-cyan
          "
        >
          <Bell size={17} />

          <span
            className="
              absolute right-2 top-2 h-1.5 w-1.5
              rounded-full bg-orbit-cyan
              shadow-[0_0_10px_rgba(103,232,249,0.8)]
            "
          />
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl border border-orbit-border-soft
            bg-orbit-elevated text-orbit-muted
            transition hover:text-orbit-cyan
          "
        >
          {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <div className="mx-1 hidden h-8 w-px bg-orbit-border-soft sm:block" />

        <button
          type="button"
          onClick={() => navigate("/profile")}
          className="
            group flex items-center gap-2 rounded-xl
            border border-transparent px-2 py-1.5
            transition hover:border-orbit-border-soft
            hover:bg-orbit-elevated
          "
        >
          <div
            className="
              flex h-9 w-9 items-center justify-center
              rounded-xl
              bg-gradient-to-br from-orbit-cyan to-orbit-violet-strong
              text-xs font-bold text-orbit-bg
            "
          >
            {initials}
          </div>

          <div className="hidden max-w-[130px] text-left lg:block">
            <p className="truncate text-sm font-semibold text-orbit-text">
              {user?.name || user?.username || "Workspace User"}
            </p>

            <p className="truncate text-[11px] text-orbit-muted">
              {user?.role || "Member"}
            </p>
          </div>

          <ChevronDown
            size={15}
            className="hidden text-orbit-muted transition group-hover:text-orbit-cyan lg:block"
          />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout"
          className="
            hidden h-10 w-10 items-center justify-center
            rounded-xl border border-orbit-border-soft
            text-orbit-muted transition
            hover:border-orbit-danger/30
            hover:bg-orbit-danger/10
            hover:text-orbit-danger
            sm:flex
          "
        >
          <LogOut size={16} />
        </button>
      </div>
    </motion.header>
  );
}