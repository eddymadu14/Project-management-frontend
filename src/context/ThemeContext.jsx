import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [isMounted, setIsMounted] = useState(false); // avoid hydration mismatch

  // run once on mount to read persisted value or system preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") {
        setTheme(saved);
      } else {
        // optional: follow system pref if no saved value
        const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
      }
    } catch (e) {
      console.warn("Theme read failed:", e);
      setTheme("light");
    } finally {
      setIsMounted(true);
    }
  }, []);

  // whenever theme changes, ensure html class and persist
  useEffect(() => {
    if (!isMounted) return; // skip first render until we've read localStorage
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.warn("Theme save failed:", e);
    }
    console.debug("[ThemeContext] theme set to:", theme, "html.classList:", root.className);
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme((p) => (p === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isMounted }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);