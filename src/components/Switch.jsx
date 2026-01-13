
import React from "react";
import { useTheme } from "../context/ThemeContext";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";

const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 hover:scale-105 transition-transform"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <MoonIcon className="w-5 h-5 text-gray-700" />
      ) : (
        <SunIcon className="w-5 h-5 text-yellow-400" />
      )}
    </button>
  );
};

export default ThemeSwitch;
