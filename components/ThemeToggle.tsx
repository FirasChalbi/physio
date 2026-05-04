// components/ThemeToggle.tsx — Light/Dark mode toggle button
"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Placeholder to avoid layout shift
    return (
      <button className={`relative p-2 ${className}`} aria-label="Changer le thème">
        <div className="w-5 h-5" />
      </button>
    )
  }

  const isDark = theme === "dark"

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative p-2 rounded-full transition-all duration-300 group ${className}`}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
    >
      <div className="relative w-5 h-5">
        {/* Sun icon */}
        <Sun
          className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
            isDark
              ? "opacity-0 rotate-90 scale-0"
              : "opacity-100 rotate-0 scale-100 text-amber-500"
          }`}
        />
        {/* Moon icon */}
        <Moon
          className={`w-5 h-5 absolute inset-0 transition-all duration-300 ${
            isDark
              ? "opacity-100 rotate-0 scale-100 text-[var(--text-secondary)]"
              : "opacity-0 -rotate-90 scale-0"
          }`}
        />
      </div>
    </button>
  )
}
