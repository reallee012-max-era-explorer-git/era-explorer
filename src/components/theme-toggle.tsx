import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("moduhistory-theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("moduhistory-theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label="다크모드 전환"
      className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
