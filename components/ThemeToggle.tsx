"use client";

import { useEffect, useState, useCallback } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  // Read from the class the inline script already set (no flash)
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDarkMode(isDark);
    setMounted(true);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  if (!mounted) {
    // Render a neutral placeholder that matches both themes to avoid layout shift
    return (
      <div className="w-9 h-9 p-2 rounded-lg bg-slate-100 dark:bg-slate-800" aria-hidden="true" />
    );
  }

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      role="switch"
      aria-checked={darkMode}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-amber-400" aria-hidden="true" />
      ) : (
        <Moon className="w-5 h-5 text-slate-700" aria-hidden="true" />
      )}
      <span className="sr-only">{darkMode ? "Currently dark mode" : "Currently light mode"}</span>
    </button>
  );
}
