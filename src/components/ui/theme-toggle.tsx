
"use client"

import { useState, useEffect } from "react" // Added useEffect for initial theme sync if we were to use next-themes
import { Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"; // Keep this for potential future integration

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  // const [isDark, setIsDark] = useState(true) // Original local state

  // --- Integration with next-themes ---
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine isDark based on resolvedTheme once mounted
  // Fallback to true (dark) if not mounted or theme is not set, matching initial visual
  const isDark = mounted ? resolvedTheme === "dark" : true;

  if (!mounted) {
    // To prevent hydration mismatch, render a placeholder or null until mounted
    // Or, you can render the toggle based on a default and let it correct itself after mount.
    // For simplicity, returning the toggle based on initial `isDark` (true) which visually matches your new component's default.
    // A more robust solution might involve rendering a skeleton or a non-interactive version initially.
  }

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };
  // --- End integration with next-themes ---

  return (
    <div
      className={cn(
        "flex w-16 h-8 p-1 rounded-full cursor-pointer transition-all duration-300",
        isDark
           ? "bg-zinc-950 border border-zinc-800"
           : "bg-white border border-zinc-200",
        className
      )}
      onClick={toggleTheme} // Use the next-themes toggle function
      role="button"
      tabIndex={0}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      <div className="flex justify-between items-center w-full">
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark
               ? "transform translate-x-0 bg-zinc-800"
               : "transform translate-x-8 bg-gray-200"
          )}
        >
          {isDark ? (
            <Moon
               className="w-4 h-4 text-white"
               strokeWidth={1.5}
            />
          ) : (
            <Sun
               className="w-4 h-4 text-gray-700"
               strokeWidth={1.5}
            />
          )}
        </div>
        <div
          className={cn(
            "flex justify-center items-center w-6 h-6 rounded-full transition-transform duration-300",
            isDark
               ? "bg-transparent"
               : "transform -translate-x-8"
          )}
        >
          {isDark ? (
            <Sun
               className="w-4 h-4 text-gray-500"
               strokeWidth={1.5}
            />
          ) : (
            <Moon
               className="w-4 h-4 text-black"
               strokeWidth={1.5}
            />
          )}
        </div>
      </div>
    </div>
  )
}
