"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        localStorage.getItem("theme") === "dark" ||
        (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);

      if (isDark) {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
      } else {
        document.documentElement.classList.remove("dark");
        setDarkMode(false);
      }
      setMounted(true);
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  if (!mounted) {
    return (
      <div className="w-9 h-9 p-2 rounded-lg bg-slate-100 dark:bg-slate-800" />
    );
  }

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500"
      aria-label="Toggle theme"
      title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
    </button>
  );
}
